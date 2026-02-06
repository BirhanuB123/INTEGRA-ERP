import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

import useLanguage from '@/locale/useLanguage';
import logo from '@/style/images/integra-erp-logo.svg';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ProductOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
  FileDoneOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { role } = currentAdmin;

  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1) || 'dashboard');
  const [openKeys, setOpenKeys] = useState([]);

  const translate = useLanguage();
  const navigate = useNavigate();

  const allItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to={'/'}>{translate('dashboard')}</Link>,
    },
    {
      key: 'inventory',
      label: translate('inventory'),
      icon: <ProductOutlined />,
      children: [
        {
          key: 'product',
          label: <Link to={'/product'}>{translate('products')}</Link>,
        },
        {
          key: 'product/category',
          label: <Link to={'/product/category'}>{translate('product_category')}</Link>,
        },
        {
          key: 'inventory/warehouse',
          label: <Link to={'/inventory/warehouse'}>{translate('warehouse')}</Link>,
        },
        {
          key: 'inventory/stock-movement',
          label: <Link to={'/inventory/stock-movement'}>{translate('stock_movement')}</Link>,
        },
        {
          key: 'inventory/batch',
          label: <Link to={'/inventory/batch'}>{translate('batch')}</Link>,
        },
      ],
    },
    {
      key: 'crm',
      label: translate('crm'),
      icon: <CustomerServiceOutlined />,
      children: [
        {
          key: 'customer',
          label: <Link to={'/customer'}>{translate('customers')}</Link>,
        },
        {
          key: 'lead',
          label: <Link to={'/lead'}>{translate('leads')}</Link>,
        },
      ],
    },
    {
      key: 'sales',
      label: translate('sales'),
      icon: <ShopOutlined />,
      children: [
        {
          key: 'invoice',
          label: <Link to={'/invoice'}>{translate('invoices')}</Link>,
        },
        {
          key: 'quote',
          label: <Link to={'/quote'}>{translate('quote')}</Link>,
        },
        {
          key: 'payment',
          label: <Link to={'/payment'}>{translate('payments')}</Link>,
        },
      ],
    },
    {
      key: 'staff',
      label: translate('staff_hr'),
      icon: <UserOutlined />,
      role: ['owner', 'admin', 'hr_head'],
      children: [
        {
          key: 'employee',
          label: <Link to={'/employee'}>{translate('employees')}</Link>,
        },
        {
          key: 'admin',
          label: <Link to={'/admin'}>{translate('staff_management')}</Link>,
          role: ['owner', 'admin'],
        },
        {
          key: 'payroll',
          label: <Link to={'/payroll'}>{translate('payroll')}</Link>,
          role: ['owner', 'admin', 'hr_head', 'finance_head'],
        },
        {
          key: 'attendance',
          label: <Link to={'/attendance'}>{translate('attendance')}</Link>,
        },
        {
          key: 'leave',
          label: <Link to={'/leave'}>{translate('leave')}</Link>,
        },
        {
          key: 'approval',
          label: <Link to={'/approval'}>{translate('approvals')}</Link>,
        },
      ],
    },
    {
      key: 'finance',
      label: translate('finance'),
      icon: <WalletOutlined />,
      role: ['owner', 'admin', 'finance_head'],
      children: [
        {
          key: 'account',
          label: <Link to={'/account'}>{translate('chart_of_accounts')}</Link>,
        },
        {
          key: 'fiscal-period',
          label: <Link to={'/fiscal-period'}>{translate('fiscal_period')}</Link>,
        },
      ],
    },
    {
      key: 'settings_menu',
      label: translate('settings'),
      icon: <SettingOutlined />,
      role: ['owner', 'admin'],
      children: [
        {
          key: 'settings',
          label: <Link to={'/settings'}>{translate('general_settings')}</Link>,
        },
        {
          key: 'payment/mode',
          label: <Link to={'/payment/mode'}>{translate('payments_mode')}</Link>,
        },
        {
          key: 'taxes',
          label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
        },
        {
          key: 'about',
          label: <Link to={'/about'}>{translate('about')}</Link>,
        },
      ],
    },
  ];

  const filterItems = (menuItems) => {
    return menuItems
      .filter((item) => !item.role || item.role.includes(role))
      .map((item) => {
        if (item.children) {
          return { ...item, children: filterItems(item.children) };
        }
        return item;
      });
  };

  const items = filterItems(allItems);

  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    setCurrentPath(path);

    // Automatically open the parent menu
    const parentKey = items.find((item) => item.children?.some((child) => child.key === path))?.key;
    if (parentKey) {
      setOpenKeys([parentKey]);
    }
  }, [location]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };
  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',

        position: isMobile ? 'absolute' : 'relative',
        bottom: '20px',
        ...(!isMobile && {
          ['left']: '20px',
          top: '20px',
        }),
      }}
      theme={'light'}
    >
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px'
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            height: '40px',
            width: 'auto',
            maxWidth: '100%'
          }}
        />
      </div>
      <Menu
        items={items}
        mode="inline"
        theme={'light'}
        selectedKeys={[currentPath]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{
          width: isMobile ? '100%' : 256,
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ ['marginLeft']: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        // style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
