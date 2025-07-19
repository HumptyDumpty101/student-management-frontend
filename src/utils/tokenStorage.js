class TokenStorage {
  constructor() {
    this.accessTokenKey = 'accessToken';
    this.refreshTokenKey = 'refreshToken';
    this.userKey = 'user';
  }

  // Store access token securely
  setAccessToken(token) {
    try {
      if (token) {
        localStorage.setItem(this.accessTokenKey, token);
      } else {
        localStorage.removeItem(this.accessTokenKey);
      }
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  // Get access token
  getAccessToken() {
    try {
      return localStorage.getItem(this.accessTokenKey);
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
      return null;
    }
  }

  // Store refresh token securely
  setRefreshToken(token) {
    try {
      if (token) {
        localStorage.setItem(this.refreshTokenKey, token);
      } else {
        localStorage.removeItem(this.refreshTokenKey);
      }
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  // Get refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem(this.refreshTokenKey);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  // Store user data
  setUser(user) {
    try {
      if (user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.userKey);
      }
    } catch (error) {
      console.error('Failed to store user data:', error);
    }
  }

  // Get user data
  getUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  // Clear all stored data
  clear() {
    try {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userKey);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Check if tokens are valid (basic validation)
  isTokenValid(token) {
    if (!token) return false;
    
    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  // Get token expiration time
  getTokenExpiration(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }
}

export const tokenStorage = new TokenStorage();