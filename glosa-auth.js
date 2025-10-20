/**
 * Glosa Authentication Module
 * Handles Google Sign-In + GitHub Personal Access Token
 */

import { initGoogleSignIn, signInWithGoogle, getCurrentGoogleUser } from '../shared/google-auth.js';
import { retrieveSyncedKeys, saveSyncedKeys } from '../shared/key-sync.js';

let authCallbacks = {
    onSuccess: null,
    onError: null
};

export async function initAuth() {
    try {
        await initGoogleSignIn();
        return true;
    } catch (error) {
        console.error('Failed to initialize Google auth:', error);
        return false;
    }
}

export function setAuthCallbacks(onSuccess, onError) {
    authCallbacks.onSuccess = onSuccess;
    authCallbacks.onError = onError;
}

export async function handleGoogleSignIn() {
    try {
        const user = await signInWithGoogle();
        return user;
    } catch (error) {
        throw new Error('Google sign-in failed: ' + error.message);
    }
}

export async function retrieveKeys(githubToken) {
    try {
        const keys = await retrieveSyncedKeys(githubToken);
        return keys;
    } catch (error) {
        console.error('Failed to retrieve keys:', error);
        return null;
    }
}

export async function saveKeys(geminiKey, githubToken) {
    try {
        await saveSyncedKeys({
            geminiKey,
            githubToken
        });
        return true;
    } catch (error) {
        console.error('Failed to save keys:', error);
        throw error;
    }
}

export function isAuthenticated(githubToken) {
    const googleUser = getCurrentGoogleUser();
    return !!(googleUser && githubToken);
}

export function getCurrentAuth() {
    return {
        googleUser: getCurrentGoogleUser()
    };
}
