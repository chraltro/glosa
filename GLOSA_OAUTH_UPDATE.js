/**
 * GLOSA OAUTH UPDATE
 *
 * INSTRUCTIONS:
 * 1. Open glosa/index.html
 * 2. Find line 400: <script>
 * 3. Change it to: <script type="module">
 * 4. Add imports after line 400 (after the <script type="module"> tag):
 *    import { initAuth, handleGoogleSignIn, handleGitHubConnect, retrieveKeys, saveKeys, getCurrentAuth } from './glosa-auth.js';
 * 5. Replace the functions below with the new implementations
 */

// ===== UPDATE DOM REFERENCES (line ~407-431) =====
// ADD these new dom elements to the existing dom object:
/*
const dom = {
    // ... existing dom elements ...
    googleSignInBtn: document.getElementById('googleSignInBtn'),
    githubConnectBtn: document.getElementById('githubConnectBtn'),
    showManualBtn: document.getElementById('showManualBtn'),
    manualSubmitBtn: document.getElementById('manualSubmitBtn'),
    manualEntryForm: document.getElementById('manualEntryForm'),
    manualEntryLink: document.getElementById('manualEntryLink'),
    loginStatus: document.getElementById('loginStatus'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    oauthFlow: document.getElementById('oauthFlow'),
    // ... rest of existing dom elements ...
};
*/

// ===== REPLACE initializeApp() function (line ~447-463) =====
async function initializeApp() {
    loadTheme();
    renderThemeModal();

    // Initialize Google Auth
    await initAuth();

    // Check if already authenticated via OAuth
    const auth = getCurrentAuth();
    if (auth.githubToken) {
        try {
            const keys = await retrieveKeys();
            if (keys && keys.geminiKey) {
                state.googleApiKey = keys.geminiKey;
                state.githubToken = auth.githubToken;
                dom.appContainer.classList.remove('hidden');
                dom.loginScreen.classList.add('hidden');
                loadDataFromGist();
                setupEventListeners();
                return;
            }
        } catch (error) {
            console.error('Failed to retrieve keys:', error);
        }
    }

    // Fallback: Check localStorage (for existing users)
    const savedGoogleKey = localStorage.getItem('googleApiKey');
    const savedGithubToken = localStorage.getItem('githubToken');

    if (savedGoogleKey && savedGithubToken) {
        state.googleApiKey = savedGoogleKey;
        state.githubToken = savedGithubToken;
        dom.appContainer.classList.remove('hidden');
        dom.loginScreen.classList.add('hidden');
        loadDataFromGist();
    } else {
        dom.loginScreen.classList.remove('hidden');
    }

    setupEventListeners();
}

// ===== REPLACE setupEventListeners() function (line ~465-475) =====
function setupEventListeners() {
    // OAuth event listeners
    dom.googleSignInBtn.addEventListener('click', handleOAuthGoogleSignIn);
    dom.githubConnectBtn.addEventListener('click', handleOAuthGitHubConnect);
    dom.showManualBtn.addEventListener('click', showManualEntry);
    dom.manualSubmitBtn.addEventListener('click', handleManualSubmit);

    // Existing event listeners
    dom.logoutBtn.addEventListener('click', handleLogout);
    dom.expandAllBtn.addEventListener('click', handleExpandAll);
    dom.themeBtn.addEventListener('click', () => dom.themeModal.classList.remove('hidden'));
    dom.themeModal.addEventListener('click', (e) => { if (e.target === dom.themeModal) dom.themeModal.classList.add('hidden'); });
    dom.submitBtn.addEventListener('click', handleSubmit);
    dom.clearBtn.addEventListener('click', clearCurrentView);
    dom.articlesContainer.addEventListener('click', handleArticleClick);
    dom.historyList.addEventListener('click', handleHistoryClick);
}

// ===== ADD NEW FUNCTIONS (before existing handleLogout function ~line 502) =====

async function handleOAuthGoogleSignIn() {
    try {
        dom.loadingSpinner.classList.remove('hidden');
        dom.oauthFlow.classList.add('hidden');
        dom.loginStatus.classList.remove('hidden');
        dom.loginStatus.textContent = 'Signing in with Google...';
        hideError('loginError');

        const user = await handleGoogleSignIn();
        dom.loginStatus.textContent = 'Google sign-in successful!';

        // Show GitHub connect button
        dom.githubConnectBtn.classList.remove('hidden');
        dom.loadingSpinner.classList.add('hidden');
    } catch (error) {
        showError(error.message, 'loginError');
        dom.loadingSpinner.classList.add('hidden');
        dom.oauthFlow.classList.remove('hidden');
        dom.manualEntryLink.classList.remove('hidden');
    }
}

async function handleOAuthGitHubConnect() {
    try {
        dom.loadingSpinner.classList.remove('hidden');
        dom.githubConnectBtn.classList.add('hidden');
        dom.loginStatus.textContent = 'Connecting to GitHub...';
        hideError('loginError');

        const token = await handleGitHubConnect();
        state.githubToken = token;

        dom.loginStatus.textContent = 'Retrieving synced keys...';

        // Try to retrieve synced keys
        const keys = await retrieveKeys();

        if (keys && keys.geminiKey) {
            // Keys found!
            state.googleApiKey = keys.geminiKey;
            dom.loginStatus.textContent = 'Keys retrieved! Signing you in...';

            setTimeout(() => {
                dom.appContainer.classList.remove('hidden');
                dom.loginScreen.classList.add('hidden');
                loadDataFromGist();
            }, 500);
        } else {
            // First time - need Gemini key
            dom.loginStatus.textContent = 'No saved keys. Please enter your Gemini API key.';
            dom.loadingSpinner.classList.add('hidden');
            dom.manualEntryForm.classList.remove('hidden');
        }
    } catch (error) {
        showError(error.message, 'loginError');
        dom.loadingSpinner.classList.add('hidden');
        dom.manualEntryLink.classList.remove('hidden');
    }
}

async function handleManualSubmit() {
    const geminiKey = dom.googleApiKeyInput.value.trim();

    if (!geminiKey) {
        showError('Please enter a Gemini API key', 'loginError');
        return;
    }

    try {
        dom.loadingSpinner.classList.remove('hidden');
        dom.manualEntryForm.classList.add('hidden');
        dom.loginStatus.classList.remove('hidden');
        dom.loginStatus.textContent = 'Saving keys...';
        hideError('loginError');

        // Validate key
        const testResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
        if (!testResponse.ok) throw new Error('Invalid Gemini API key');

        // Save to gist (if OAuth completed)
        const auth = getCurrentAuth();
        if (auth.googleUser && auth.githubToken) {
            await saveKeys(geminiKey);
            dom.loginStatus.textContent = 'Keys saved and synced!';
        } else {
            // Fallback to localStorage
            localStorage.setItem('googleApiKey', geminiKey);
            dom.loginStatus.textContent = 'Keys saved locally (sign in with Google to sync across devices)';
        }

        state.googleApiKey = geminiKey;

        setTimeout(() => {
            dom.appContainer.classList.remove('hidden');
            dom.loginScreen.classList.add('hidden');
            loadDataFromGist();
        }, 500);
    } catch (error) {
        showError(error.message, 'loginError');
        dom.loadingSpinner.classList.add('hidden');
        dom.manualEntryForm.classList.remove('hidden');
    }
}

function showManualEntry() {
    dom.oauthFlow.classList.add('hidden');
    dom.manualEntryLink.classList.add('hidden');
    dom.manualEntryForm.classList.remove('hidden');
}

// ===== DELETE OLD handleLogin() function (line ~477-500) =====
// Remove the entire async function handleLogin(e) { ... } block
