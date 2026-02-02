import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'INTEGRA ERP'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.gebetatech.com">www.gebetatech.com</a>{' '}
          </p>
          <p>
            GitHub :{' '}
            <a href="https://github.com/BirhanuB123/integra-erp">
              https://github.com/BirhanuB123/integra-erp
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.gebetatech.com/contact/`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
