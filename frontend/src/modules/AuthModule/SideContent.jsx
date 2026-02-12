import { Typography } from 'antd';
import logo from '@/style/images/integra-erp-logo.svg';
import useLanguage from '@/locale/useLanguage';

const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <div className="side-content-wrapper">
      <img
        src={logo}
        alt="INTEGRA ERP SOLUTIONS"
        style={{ margin: '0 0 20px', display: 'inline-block', maxWidth: '180px', filter: 'brightness(0) invert(1)' }}
        height={60}
        width={'auto'}
      />

      <div className="space20" />

      <Title level={1} className="side-content-title">
        INTEGRA ERP
      </Title>

      <div className="space20" />

      <Text className="side-content-text">
        {translate('Accounting / Invoicing / Quote App')}
        <br />
        {translate('Powerful solutions based on your company needs')}
      </Text>
    </div>
  );
}
