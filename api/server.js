/* ════════════════════════════════════════════════════
   Wetoro API Server
   Simple backend for storing and retrieving stones
   ════════════════════════════════════════════════════ */

'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Supabase Client ── */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/* ── Health Check ── */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── Get all stones for today ── */
app.get('/api/stones/today', async (req, res) => {
  try {
    const today = getTodayString();
    
    const { data, error } = await supabase
      .from('stones')
      .select('*')
      .eq('date', today);
    
    if (error) throw error;
    
    res.json({
      success: true,
      date: today,
      stones: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching stones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stones'
    });
  }
});

/* ── Save a new stone ── */
app.post('/api/stones', async (req, res) => {
  try {
    const { tone, label } = req.body;
    
    /* Validate input */
    if (!tone || !tone.id || !tone.shape || !tone.color) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tone data'
      });
    }
    
    /* Ensure label is not too long */
    const cleanLabel = label ? String(label).substring(0, 80) : '';
    
    const stoneData = {
      date: getTodayString(),
      tone_id: tone.id,
      tone_label: tone.label,
      tone_shape: tone.shape,
      tone_color: tone.color,
      label: cleanLabel,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('stones')
      .insert([stoneData])
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      stone: data[0]
    });
  } catch (error) {
    console.error('Error saving stone:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save stone'
    });
  }
});

/* ── Get stones for a specific date ── */
app.get('/api/stones/:date', async (req, res) => {
  try {
    const { date } = req.params;
    
    /* Validate date format (YYYY-MM-DD) */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    
    const { data, error } = await supabase
      .from('stones')
      .select('*')
      .eq('date', date);
    
    if (error) throw error;
    
    res.json({
      success: true,
      date: date,
      stones: data || [],
      count: data ? data.length : 0
    });
  } catch (error) {
    console.error('Error fetching stones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stones'
    });
  }
});

/* ── Get available dates ── */
app.get('/api/dates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stones')
      .select('date')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    /* Get unique dates */
    const uniqueDates = [...new Set(data.map(s => s.date))];
    
    res.json({
      success: true,
      dates: uniqueDates
    });
  } catch (error) {
    console.error('Error fetching dates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dates'
    });
  }
});

/* ── Helper Functions ── */
function getTodayString() {
  /* Use UTC to ensure consistency across all timezones */
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ── Start Server ── */
app.listen(PORT, () => {
  console.log(`Wetoro API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
