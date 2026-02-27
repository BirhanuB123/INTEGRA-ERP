import { notification } from 'antd';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  const showNotification = (msg, desc, duration = 15, maxCount = 1) => {
    try {
      if (typeof notification?.config === 'function') {
        notification.config({ duration, maxCount });
      }
      if (typeof notification?.error === 'function') {
        notification.error({ message: msg, description: desc });
      }
    } catch (_) {
      // fallback if notification not ready
      console.error(msg, desc);
    }
  };

  if (!navigator.onLine) {
    showNotification('No internet connection', 'Cannot connect to the Internet, Check your internet network');
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Check your internet network',
    };
  }

  const { response } = error;

  if (!response) {
    showNotification('Cannot connect to the server', 'Contact your Account administrator', 20, 1);
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Contact your Account administrator',
    };
  }

  if (response && response.data && response.data.jwtExpired) {
    const result = window.localStorage.getItem('auth');
    const jsonFile = window.localStorage.getItem('isLogout');
    const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('isLogout');
    if (result || isLogout) {
      window.location.href = '/logout';
    }
  }

  if (response && response.status) {
    const message = response.data && response.data.message;
    const errorText = message || codeMessage[response.status];
    const { status } = response;

    showNotification(`Request error ${status}`, errorText, 20, 2);

    if (response?.data?.error?.name === 'JsonWebTokenError') {
      window.localStorage.removeItem('auth');
      window.localStorage.removeItem('isLogout');
      window.location.href = '/logout';
    } else return response.data;
  }

  showNotification('Problem connecting to server', 'Cannot connect to the server, Try again later', 15, 1);
  return {
    success: false,
    result: null,
    message: 'Cannot connect to the server, Contact your Account administrator',
  };
};

export default errorHandler;
