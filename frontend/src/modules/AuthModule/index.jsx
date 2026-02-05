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
      <Content
        className="auth-container"
        style={{
          padding: isForRegistre ? '40px 30px' : '60px 30px',
        }}
      >
        <div
          className="glass-morphism"
          style={{
            maxWidth: '440px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
            <img
              src={logo}
              alt="Logo"
              style={{
                margin: '0px auto 20px',
                display: 'block',
                maxWidth: '220px'
              }}
              height={63}
              width={'auto'}
            />
            <div className="space10" />
          </Col>
          <Title level={1} className="auth-header-title">{translate(AUTH_TITLE)}</Title>

          <Divider style={{ margin: '12px 0 24px' }} />
          <div className="site-layout-content">{authContent}</div>
        </div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
