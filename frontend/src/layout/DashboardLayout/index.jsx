import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}
