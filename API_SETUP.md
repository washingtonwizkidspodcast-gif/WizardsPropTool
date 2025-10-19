# Wizards Prop Tool - API Setup Guide

This guide will help you set up API keys to fetch real-time NBA player data for the Washington Wizards.

## 🚀 Quick Start

1. **Copy environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Get API keys** (see sections below)

3. **Add keys to `.env.local`:**
   ```bash
   REACT_APP_SPORTS_DATA_API_KEY=your_actual_key_here
   REACT_APP_RAPID_API_KEY=your_actual_key_here
   ```

4. **Restart the development server:**
   ```bash
   npm start
   ```

## 🔑 API Keys Setup

### Option 1: Sports Data API (Recommended)
**Free Tier:** 100 requests/day

1. Go to [sportsdata.io](https://sportsdata.io/)
2. Sign up for a free account
3. Navigate to NBA API section
4. Copy your API key
5. Add to `.env.local`:
   ```
   REACT_APP_SPORTS_DATA_API_KEY=your_key_here
   ```

### Option 2: RapidAPI NBA API
**Free Tier:** 25 requests/day

1. Go to [rapidapi.com](https://rapidapi.com/)
2. Sign up for a free account
3. Search for "NBA API"
4. Subscribe to the free plan
5. Copy your API key
6. Add to `.env.local`:
   ```
   REACT_APP_RAPID_API_KEY=your_key_here
   ```

### Option 3: Ball Don't Lie API (No Key Required)
**Free Tier:** Unlimited requests

This API doesn't require a key and is used as the primary data source. It provides:
- Player rosters
- Game statistics
- Team information
- Recent game logs

## 📊 Data Sources

The app uses multiple data sources for redundancy:

1. **Primary:** Ball Don't Lie API (no key required)
2. **Secondary:** Sports Data API (requires key)
3. **Fallback:** Static data (always available)

## 🔧 Configuration Options

Add these to your `.env.local` file for customization:

```bash
# API Configuration
REACT_APP_NBA_API_BASE=https://www.balldontlie.io/api/v1
REACT_APP_CACHE_TIMEOUT=300000

# Development Settings
REACT_APP_DEBUG_MODE=true
REACT_APP_ENABLE_CACHE=true
```

## 🚨 Troubleshooting

### No Data Loading
- Check your internet connection
- Verify API keys are correct
- Check browser console for errors
- Try refreshing the page

### Rate Limit Exceeded
- Wait for the rate limit to reset
- Consider upgrading to a paid plan
- The app will fall back to cached data

### API Errors
- The app includes fallback data
- Check the error message in the UI
- Use the "Retry" button to reload

## 📈 Features Enabled with API Keys

### With API Keys:
- ✅ Real-time player statistics
- ✅ Current season averages
- ✅ Recent game logs
- ✅ Live roster updates
- ✅ Player height/weight data
- ✅ Automatic data refresh

### Without API Keys:
- ✅ Fallback player data
- ✅ Static statistics
- ✅ Basic functionality
- ✅ All UI features

## 🔄 Data Refresh

- **Cache Duration:** 5 minutes
- **Auto Refresh:** On page reload
- **Manual Refresh:** Use retry button
- **Last Updated:** Shown in sidebar

## 🛡️ Security Notes

- Never commit `.env.local` to version control
- API keys are only used client-side
- All API calls are made from the browser
- No sensitive data is stored locally

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your API keys are correct
3. Ensure you have an active internet connection
4. Try the fallback data mode

## 🎯 Next Steps

Once you have API keys set up:
1. The app will automatically load real data
2. Player statistics will update in real-time
3. Game logs will show recent performance
4. All prop analysis will use live data

Happy betting! 🏀
