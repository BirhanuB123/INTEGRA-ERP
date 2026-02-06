import * as antd from '@/utils/antdGlobal';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  const notification = antd.notification || import('antd').then(m => m.notification); // Fallback

  if (!navigator.onLine) {
    if (notification.error) {
      notification.config({
        duration: 15,
        maxCount: 1,
      });
      notification.error({
        message: 'No internet connection',
        description: 'Cannot connect to the Internet, Check your internet network',
      });
    }
    return {
      success: false,
      result: null,
      message: 'Cannot connect to the server, Check your internet network',
    };
  }

  const { response } = error;

  if (!response) {
    if (notification.config) {
      notification.config({
        duration: 20,
        maxCount: 1,
      });
    }
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
    const { status, error } = response;

    if (notification.error) {
      notification.config({
        duration: 20,
        maxCount: 2,
      });
      notification.error({
        message: `Request error ${status}`,
        description: errorText,
      });
    }

    if (response?.data?.error?.name === 'JsonWebTokenError') {
      window.localStorage.removeItem('auth');
      window.localStorage.removeItem('isLogout');
      window.location.href = '/logout';
    } else return response.data;
  } else {
    if (notification.error) {
      notification.config({
        duration: 15,
        maxCount: 1,
      });
    }

    if (navigator.onLine) {
      if (notification.error) {
        notification.error({
          message: 'Problem connecting to server',
          description: 'Cannot connect to the server, Try again later',
        });
      }
      return {
        success: false,
        result: null,
        message: 'Cannot connect to the server, Contact your Account administrator',
      };
    } else {
      if (notification.error) {
        notification.error({
          message: 'No internet connection',
          description: 'Cannot connect to the Internet, Check your internet network',
        });
      }
      return {
        success: false,
        result: null,
        message: 'Cannot connect to the server, Check your internet network',
      };
    }
  }
};

export default errorHandler;
