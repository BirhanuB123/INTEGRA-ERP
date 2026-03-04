import { ConfigProvider, App } from 'antd';
import AntdGlobalConfig from '@/components/AntdGlobalConfig';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0e7490',
          colorLink: '#0e7490',
          borderRadius: 10,
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
      <App>
        <AntdGlobalConfig />
        {children}
      </App>
    </ConfigProvider>
  );
}
