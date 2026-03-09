import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Badge, Button } from 'antd';

import { LogoutOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { FILE_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';
import useResponsive from '@/hooks/useResponsive';
import NotificationBell from './NotificationBell';
import GlobalSearchBar from './GlobalSearchBar';

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
        paddingRight: isMobile ? 16 : 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: isMobile ? 12 : 24,
      }}
    >
      <div style={{ flexGrow: 1, minWidth: isMobile ? '100%' : '300px', maxWidth: isMobile ? '100%' : '500px', order: isMobile ? 3 : 1 }}>
        <GlobalSearchBar />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16, order: isMobile ? 2 : 2, marginLeft: isMobile ? 0 : 'auto' }}>
        <NotificationBell />

        <Dropdown
          menu={{
            items,
          }}
          trigger={['click']}
          placement="bottomRight"
          overlayStyle={{ minWidth: '220px' }}
        >
          <Avatar
            className="last"
            src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
            style={{
              color: 'var(--primary-color)',
              backgroundColor: currentAdmin?.photo ? 'transparent' : 'var(--primary-soft)',
              boxShadow: '0 2px 10px rgba(14, 116, 144, 0.25)',
              cursor: 'pointer',
            }}
            size={isMobile ? 'middle' : 'large'}
          >
            {currentAdmin?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </Header>
  );
}

//  console.log(
//    '🚀 Welcome to INTEGRA ERP CRM! Did you know that we also offer commercial customization services? Contact us at info@gebetatech.com for more information.'
//  );
