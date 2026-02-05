import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/integra-erp-logo.svg';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content
      className="sideContent animate-entrance"
    >
      <div className="side-content-wrapper">
        <img
          src={logo}
          alt="INTEGRA ERP SOLUTIONS"
          style={{ margin: '0 0 40px', display: 'block', maxWidth: '240px' }}
          height={70}
          width={'auto'}
        />

        <Title level={1} className="side-content-title">
          INTEGRA ERP SOLUTIONS
        </Title>
        <Text style={{ fontSize: '18px', color: '#4a5568', display: 'block', marginBottom: '8px' }}>
          {translate('Accounting / Invoicing / Quote App')}
        </Text>
        <Text style={{ fontSize: '16px', color: '#718096' }}>
          {translate('Powerful solutions based on your company needs')}
        </Text>

        <div className="space20"></div>
      </div>
    </Content>
  );
}
