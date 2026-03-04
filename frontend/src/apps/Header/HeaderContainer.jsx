import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button } from 'antd';

import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';
import useResponsive from '@/hooks/useResponsive';

import UpgradeButton from './UpgradeButton';
import NotificationBell from './NotificationBell';

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate('/profile')}>
        <Avatar
          size="large"
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: 'var(--primary-color)',
            backgroundColor: currentAdmin?.photo ? 'transparent' : 'var(--primary-soft)',
            boxShadow: '0 2px 8px rgba(14, 116, 144, 0.2)',
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: 'ProfileDropdown',
    },
    {
      type: 'divider',
    },
    {
      icon: <UserOutlined />,
      key: 'settingProfile',
      label: (
        <Link to={'/profile'}>
          <DropdownMenu text={translate('profile_settings')} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: 'settingApp',
      label: <Link to={'/settings'}>{translate('app_settings')}</Link>,
    },

    {
      type: 'divider',
    },

    {
      icon: <LogoutOutlined />,
      key: 'logout',
      label: <Link to={'/logout'}>{translate('logout')}</Link>,
    },
  ];

  const { isMobile } = useResponsive();

  return (
    <Header
      className="app-header"
      style={{
        paddingLeft: isMobile ? 16 : 24,
        display: 'flex',
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        gap: isMobile ? 10 : 16,
      }}
    >
      <NotificationBell />

      <Dropdown
        menu={{
          items,
        }}
        trigger={['click']}
        placement="bottomRight"
        stye={{ width: '280px', float: 'right' }}
      >
        {/* <Badge dot> */}
        <Avatar
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: 'var(--primary-color)',
            backgroundColor: currentAdmin?.photo ? 'transparent' : 'var(--primary-soft)',
            boxShadow: '0 2px 10px rgba(14, 116, 144, 0.25)',
            float: 'right',
            cursor: 'pointer',
          }}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        {/* </Badge> */}
      </Dropdown>

      {/* <AppsButton /> */}

      <UpgradeButton />
    </Header>
  );
}

//  console.log(
//    '🚀 Welcome to INTEGRA ERP CRM! Did you know that we also offer commercial customization services? Contact us at info@gebetatech.com for more information.'
//  );
