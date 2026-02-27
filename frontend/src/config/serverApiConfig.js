const backendServer =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE === 'remote'
    ? import.meta.env.VITE_BACKEND_SERVER
    : null;
const devApi = 'http://localhost:8888/api/';
const devBase = 'http://localhost:8888/';

if (
  (import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE === 'remote') &&
  (!backendServer || backendServer === 'undefined' || String(backendServer).includes('undefined'))
) {
  console.error(
    '[INTEGRA ERP] VITE_BACKEND_SERVER is not set or invalid. ' +
      'In Vercel: Project Settings → Environment Variables → add VITE_BACKEND_SERVER = https://your-backend.onrender.com/ (with trailing slash), then redeploy.'
  );
}

export const API_BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE === 'remote'
    ? backendServer && !String(backendServer).includes('undefined')
      ? (backendServer.endsWith('/') ? backendServer : backendServer + '/') + 'api/'
      : devApi
    : devApi;
export const BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE
    ? backendServer && !String(backendServer).includes('undefined')
      ? backendServer.endsWith('/') ? backendServer : backendServer + '/'
      : devBase
    : devBase;

export const WEBSITE_URL = import.meta.env.PROD
  ? 'http://gebetatech.com/'
  : 'http://localhost:3000/';
export const DOWNLOAD_BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE
    ? BASE_URL + 'download/'
    : 'http://localhost:8888/download/';
export const ACCESS_TOKEN_NAME = 'x-auth-token';

export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

//  console.log(
//    '🚀 Welcome to INTEGRA ERP SOLUTIONS! Did you know that we also offer commercial customization services? Contact us at info@gebetatech.com for more information.'
//  );
