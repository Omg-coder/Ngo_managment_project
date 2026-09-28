// Simple API fetch wrapper with Authorization header and automatic token refresh

let accessToken = localStorage.getItem('ngo_access_token') || '';
let onTokenRefreshedCallback = null;
let onLogoutCallback = null;

export const setAuthToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('ngo_access_token', token);
  } else {
    localStorage.removeItem('ngo_access_token');
  }
};

export const getAuthToken = () => accessToken;

export const registerAuthCallbacks = ({ onTokenRefreshed, onLogout }) => {
  onTokenRefreshedCallback = onTokenRefreshed;
  onLogoutCallback = onLogout;
};

// Main fetch wrapper
export const apiFetch = async (url, options = {}) => {
  // 1. Prepare headers
  const headers = { ...options.headers };

  // Set Content-Type to JSON if body is a plain JS object
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  // Attach Bearer access token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Always include credentials so httpOnly cookies (refreshToken) are sent
  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  // 2. Perform the initial request
  let response = await fetch(url, config);

  // 3. If unauthorized (401), try to refresh the access token once
  if (response.status === 401 && !url.includes('/api/auth/refresh') && !url.includes('/api/auth/login')) {
    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.accessToken;
        
        // Update local token
        setAuthToken(newAccessToken);
        if (onTokenRefreshedCallback) {
          onTokenRefreshedCallback(newAccessToken);
        }

        // Retry the original request with the new access token
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, config);
      } else {
        // Refresh failed (cookie expired or invalid) -> trigger logout
        setAuthToken('');
        if (onLogoutCallback) {
          onLogoutCallback();
        }
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
    }
  }

  return response;
};
