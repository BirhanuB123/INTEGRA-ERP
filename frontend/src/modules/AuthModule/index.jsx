import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Divider, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

import logo from '@/style/images/integra-erp-logo.svg';

const { Content } = Layout;
const { Title } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <div className="auth-container">
        <div className="auth-form-card animate-entrance">
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
            <img
              src={logo}
              alt="Logo"
              style={{
                margin: '0px auto 20px',
                display: 'block',
                maxWidth: '180px'
              }}
              height={50}
              width={'auto'}
            />
            <div className="space10" />
          </Col>

          <Title level={1} className="auth-header-title">{translate(AUTH_TITLE)}</Title>
          <span className="auth-header-subtitle">Welcome back! Please enter your details.</span>
          <Divider style={{ margin: '10px 0 28px', borderColor: 'var(--glass-border)' }} />
          <div className="site-layout-content">{authContent}</div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthModule;
