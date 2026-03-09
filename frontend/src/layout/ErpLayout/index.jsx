import { ErpContextProvider } from '@/context/erp';

import { Layout } from 'antd';
import { useSelector } from 'react-redux';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow layoutPadding erp-layout-content"
        style={{
          margin: '20px auto',
          width: '100%',
          maxWidth: '1200px',
          minHeight: '600px',
          minWidth: 0,
          padding: '16px', // Default padding
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
