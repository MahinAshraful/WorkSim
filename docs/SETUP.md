# Setup Guide

## Environment Configuration

### Google Gemini API Setup

The comprehensive data analyst simulation uses Google Gemini AI for intelligent evaluation of submitted work. To enable this feature:

1. **Get a Google Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated API key

2. **Configure Environment Variables:**
   - Copy `env.example` to `.env.local`
   - Replace `your_gemini_api_key_here` with your actual API key
   - The file should look like:
     ```
     GOOGLE_GEMINI_API_KEY=AIzaSyC...your_actual_key_here
     ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

### Security Notes

- **Never commit API keys** - The `.gitignore` file is configured to prevent `.env*` files from being committed
- **Use environment variables** - API keys are stored in environment variables, not in code
- **Rotate keys regularly** - Consider rotating your API key periodically for security

### Fallback Mode

If the Google Gemini API key is not configured:
- The simulation will still work
- Users will receive a message that AI evaluation is not configured
- Manual evaluation or basic completion will be used as fallback

## Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual API keys
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to the Comprehensive Data Analyst simulation

## Production Deployment

For production deployment:

1. **Set Environment Variables:**
   - Configure `GOOGLE_GEMINI_API_KEY` in your hosting platform
   - Examples:
     - **Vercel:** Add in Project Settings → Environment Variables
     - **Netlify:** Add in Site Settings → Environment Variables
     - **Railway:** Add in Variables tab

2. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

## Troubleshooting

### API Key Issues
- **"AI evaluation not configured"** - Check that `GOOGLE_GEMINI_API_KEY` is set in `.env.local`
- **"Evaluation failed"** - Verify your API key is valid and has sufficient quota
- **Rate limiting** - Google Gemini has rate limits; consider implementing retry logic

### Development Issues
- **Environment variables not loading** - Restart the development server after adding `.env.local`
- **TypeScript errors** - Run `npm run build` to check for type issues
- **Missing dependencies** - Run `npm install` to ensure all packages are installed 