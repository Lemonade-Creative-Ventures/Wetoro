# Wetoro

A quiet digital ritual to release what you're feeling. Anonymous, calm, and shared.

## About

Wetoro is inspired by the Japanese tradition of Toro Nagashi, where lanterns are released onto rivers carrying messages of memory, hope, or letting go. This modern digital version provides a mindful space to express emotions through symbolic stones in a shared clearing.

## Features

- **Anonymous Expression**: Write what you're feeling in a safe, judgment-free space
- **Symbolic Representation**: Choose from 24 different emotional tones, each with unique shapes and colors
- **Collective Release**: See all stones from other users in a shared clearing (requires backend setup)
- **Mindful Ritual**: Includes a breathing exercise to help release and let go
- **Privacy First**: Your written feelings are never stored - only the symbol and optional label
- **Timeline View**: Browse past clearings to see the collective emotional journey

## Quick Start

### Local Development (No Backend)

1. Clone this repository
2. Open `index.html` in a modern browser
3. That's it! The app works entirely in the browser with local storage

### With Backend (Collective Feature)

To enable the collective release feature where all users see each other's stones:

**📚 For Non-Coders**: Check out the [`SETUP`](SETUP/) folder for beginner-friendly, step-by-step guides!
- [Start Here: Overview & Prerequisites](SETUP/01-OVERVIEW.md)
- [Getting Your API Keys](SETUP/02-GETTING-KEYS.md)
- [Setting Up the Database](SETUP/03-DATABASE-SETUP.md)
- [Deploying Your API Server](SETUP/04-API-DEPLOYMENT.md)
- [Connecting Everything](SETUP/05-CONNECTING.md)
- [Deploying Your Website](SETUP/06-WEBSITE-DEPLOYMENT.md)
- [Testing Everything](SETUP/07-TESTING.md)
- [Troubleshooting](SETUP/08-TROUBLESHOOTING.md)

**For Developers**: See [`DEPLOYMENT.md`](DEPLOYMENT.md) for technical deployment instructions.

## Architecture

### Frontend
- Pure HTML, CSS, and JavaScript (no build tools required)
- Responsive design for mobile and desktop
- SVG-based visualization of the clearing
- Voice input support for writing

### Backend (Optional)
- Node.js + Express API server
- Supabase (PostgreSQL) database
- RESTful API endpoints
- Fully CORS-enabled for cross-origin requests

### Data Storage

**Without Backend:**
- Stones stored in browser localStorage
- Only your own stones visible
- Data persists on your device only

**With Backend:**
- All stones stored in Supabase database
- Everyone sees all stones (collective clearing)
- Privacy maintained: only tone + label stored, not text

## Privacy & Data

✅ **What is stored:**
- Emotional tone (e.g., "Happy", "Sadness")
- Symbol shape and color
- Optional short label (max 80 characters)
- Date of release

❌ **What is NOT stored:**
- The "what are you feeling?" text content
- User identification or tracking data
- IP addresses or analytics
- Any personal information

## API Documentation

See [`api/README.md`](api/README.md) for API documentation.

## Deployment

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for comprehensive deployment instructions.

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Netlify/Vercel (frontend), Vercel/Railway (API)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

See [LICENSE](LICENSE) file for details.

## Acknowledgments

Inspired by the Japanese tradition of Toro Nagashi (灯籠流し), a ceremony where paper lanterns are floated down rivers to guide the spirits of ancestors and symbolically release what we carry.

## Support

For setup help or questions, please:
1. Check [`DEPLOYMENT.md`](DEPLOYMENT.md) for deployment issues
2. Check [`api/README.md`](api/README.md) for API-specific issues
3. Open an issue on GitHub for bugs or feature requests