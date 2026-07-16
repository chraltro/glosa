# Glosa - Article Summarizer

A single-page web app that turns pasted articles into 5-bullet summaries using the Gemini API.

## How it works

1. Paste one or more articles into the box. Separate them with a line of `====================`.
2. Click "Analyze & Save".
3. Each article is parsed for a title and URL, then summarized. Sessions are saved to your history.

Articles are sent to Gemini in batches of 5 to stay under the API token limit. If an article has no
`TITLE:` line, the model generates one.

## Setup

You need a [Gemini API key](https://aistudio.google.com/app/apikey).

Optionally, a [GitHub personal access token](https://github.com/settings/tokens/new?scopes=gist&description=Glosa)
with `gist` scope. With a token, history syncs to a private Gist and is available on any device you
sign in from. Without one, history is kept in `localStorage` in that browser only.

There are two ways to provide keys:

- **Sign in with Google.** Keys are stored in Firestore and retrieved automatically on other devices.
- **Enter keys manually.** Keys are stored in `localStorage` on that browser.

Either way the key is also cached in `localStorage` so returning visits skip the login screen.
Settings (gear icon, or Ctrl+,) lets you change keys later.

## Running it

No build step and no dependencies. Open `index.html` from any static web server. It has to be served
over http(s) rather than opened as a `file://` path, because the app loads as an ES module and Google
sign-in requires the domain to be listed in the Firebase console under authorized domains.

## Firebase

Google sign-in and key sync use Firebase. `lib/firebase-config.js` holds the web config for the
existing project. To point Glosa at your own project, replace that config and follow the setup notes
in the same file: enable Google authentication, create a Firestore database, apply the rules given
there, and add your domain to the authorized domains list.

Sign-in is optional. If Firebase is unreachable the app still runs with manually entered keys.

## Keyboard shortcuts

- `Ctrl/Cmd + Enter` analyze
- `Ctrl/Cmd + K` focus the input
- `Ctrl/Cmd + E` expand or collapse all
- `Ctrl/Cmd + ,` settings
- `Escape` close a dialog

## Data storage

- Credentials: `localStorage`, plus Firestore (encrypted) when signed in with Google.
- History: a private Gist when a GitHub token is set, otherwise `localStorage`.
- Article text goes directly from the browser to the Gemini API. There is no server in between.

The encryption on stored keys uses a key that ships in the source (`lib/crypto.js`). It keeps keys
from being read at a glance, it is not protection against someone who wants them.

## Themes

Seven color schemes, light and dark. The default, "Glosa", uses a bronze amber accent. The theme
follows the system light/dark preference until you pick one explicitly.

## License

MIT. See [LICENSE](LICENSE).
