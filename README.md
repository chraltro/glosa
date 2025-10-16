# Glosa - Article Summarizer

A web application for processing and summarizing articles with automatic history management via GitHub Gists.

## Features

- Batch article processing with automatic summarization
- Cross-device synchronization through private GitHub Gists
- Browsable history with session management
- Theme customization with multiple presets
- Expandable summaries with full article text
- Mobile-responsive interface

## How It Works

1. Paste article content (separate multiple articles with a line of `====================`)
2. Click "Analyze & Save" to generate summaries
3. Access your history from any device by logging in with the same credentials

Each article is parsed to extract title and URL (if present), then processed to generate a concise 5-point summary. All sessions are automatically saved to a private Gist for cross-device access.

## Prerequisites

- [Google Gemini API key](https://aistudio.google.com/app/apikey)
- [GitHub Personal Access Token](https://github.com/settings/tokens/new?scopes=gist&description=Glosa) with `gist` scope

## Usage

The application is client-side only and requires no installation. Simply:

1. Open the application
2. Enter your API credentials (stored locally in your browser)
3. Start analyzing articles

## Technical Details

Built with vanilla JavaScript as a single-page application. Uses the Gemini 2.5 Flash API for text summarization with batch processing to handle multiple articles efficiently.

### Data Storage

- **Credentials:** Stored in `localStorage` (browser-local only)
- **History:** Private GitHub Gist (user-controlled)
- **Processing:** Direct API calls (no intermediary servers)

### Architecture

The application implements a streaming response pattern for real-time summary generation, processing articles in batches of 5 to balance API token limits with user experience. All state management is handled client-side with reactive UI updates.

## Theme System

Includes multiple color schemes with light and dark variants. The default "Glosa" theme uses bronze amber accents inspired by Old Norse aesthetics.

## License

MIT
