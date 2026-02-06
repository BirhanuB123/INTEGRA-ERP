import { ConfigProvider, App } from 'antd';
import AntdGlobalConfig from '@/components/AntdGlobalConfig';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#339393',
          colorLink: '#1640D6',
          borderRadius: 0,
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
