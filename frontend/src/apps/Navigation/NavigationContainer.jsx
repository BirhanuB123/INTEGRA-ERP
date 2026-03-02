import { useState, useEffect, useCallback } from 'react';
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
  DashboardOutlined,
  UserOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  WalletOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const SIDEBAR_WIDTH_KEY = 'integra-sidebar-width';
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 320;
const DEFAULT_SIDEBAR_WIDTH = 256;

function getStoredSidebarWidth() {
  try {
    const w = parseInt(localStorage.getItem(SIDEBAR_WIDTH_KEY), 10);
    if (Number.isFinite(w) && w >= MIN_SIDEBAR_WIDTH && w <= MAX_SIDEBAR_WIDTH) return w;
  } catch (_) {}
  return DEFAULT_SIDEBAR_WIDTH;
}

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { role } = currentAdmin;

  const [sidebarWidth, setSidebarWidth] = useState(getStoredSidebarWidth);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1) || 'dashboard');
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    if (!collapsible || isMobile) return;
    localStorage.setItem(SIDEBAR_WIDTH_KEY, String(sidebarWidth));
  }, [sidebarWidth, collapsible, isMobile]);

  const startResize = useCallback(
    (e) => {
      if (!collapsible || isMobile || isNavMenuClose) return;
      e.preventDefault();
      setIsResizing(true);
    },
    [collapsible, isMobile, isNavMenuClose]
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e) => {
      const next = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, e.clientX));
      setSidebarWidth(next);
    };
    const onUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

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
      role: ['owner', 'admin', 'hr_head', 'employee'],
      children: [
        {
          key: 'employee',
          label: <Link to={'/employee'}>{translate('employees')}</Link>,
          role: ['owner', 'admin', 'hr_head', 'department_manager'],
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

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const onCollapse = () => {
    navMenu.collapse();
  };

  const effectiveWidth = collapsible && isNavMenuClose ? 80 : sidebarWidth;

  return (
    <div className="sidebar-wrapper-resizable">
      <Sider
        collapsible={collapsible}
        collapsed={collapsible ? isNavMenuClose : false}
        onCollapse={onCollapse}
        trigger={null}
        className="navigation navigation-dark"
        width={effectiveWidth}
        collapsedWidth={80}
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: isMobile ? 'absolute' : 'relative',
          flex: `0 0 ${effectiveWidth}px`,
          maxWidth: effectiveWidth,
          minWidth: effectiveWidth,
        }}
        theme="dark"
      >
        <div className="navigation-inner">
          <div className="sidebar-header" onClick={() => !isNavMenuClose && navigate('/')} role="button" aria-label="Home">
            <div className="sidebar-logo-wrap">
              <img src={logo} alt="INTEGRA ERP" className="sidebar-logo-img" />
            </div>
            {!isNavMenuClose && <span className="sidebar-app-name">INTEGRA ERP</span>}
            {collapsible && !isMobile && (
              <Button
                type="text"
                className="sidebar-collapse-btn"
                icon={isNavMenuClose ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCollapse();
                }}
                aria-label={isNavMenuClose ? 'Expand menu' : 'Collapse menu'}
              />
            )}
          </div>
          <div className="sidebar-menu-wrap">
            <Menu
              items={items}
              mode="inline"
              theme="dark"
              selectedKeys={[currentPath]}
              openKeys={isNavMenuClose ? [] : openKeys}
              onOpenChange={onOpenChange}
              inlineIndent={16}
              style={{ width: isMobile ? '100%' : effectiveWidth, borderRight: 'none' }}
            />
          </div>
          {!isNavMenuClose && (
            <div className="sidebar-footer">
              <Link to="/about" className="sidebar-footer-link">
                <QuestionCircleOutlined />
                <span>Help Center</span>
                <RightOutlined className="sidebar-footer-arrow" />
              </Link>
              <Link to="/settings" className="sidebar-footer-link">
                <SettingOutlined />
                <span>{translate('general_settings')}</span>
              </Link>
            </div>
          )}
        </div>
      </Sider>
      {!isMobile && collapsible && !isNavMenuClose && (
        <div
          className={`sidebar-resize-handle ${isResizing ? 'active' : ''}`}
          onMouseDown={startResize}
          role="separator"
          aria-label="Resize sidebar"
        />
      )}
    </div>
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
