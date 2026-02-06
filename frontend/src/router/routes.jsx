import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customer = lazy(() => import('@/pages/Customer'));
const CustomerRead = lazy(() => import('@/pages/Customer/CustomerRead'));
const Lead = lazy(() => import('@/pages/Lead'));
const Employee = lazy(() => import('@/pages/Employee'));
const Payroll = lazy(() => import('@/pages/Payroll'));
const PayrollRead = lazy(() => import('@/pages/Payroll/PayrollRead'));
const Account = lazy(() => import('@/pages/Account'));
const FiscalPeriod = lazy(() => import('@/pages/FiscalPeriod'));
const Attendance = lazy(() => import('@/pages/Attendance'));
const Leave = lazy(() => import('@/pages/Leave'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));
const Product = lazy(() => import('@/pages/Product'));
const ProductCategory = lazy(() => import('@/pages/ProductCategory'));
const Warehouse = lazy(() => import('@/pages/Warehouse'));
const StockMovement = lazy(() => import('@/pages/StockMovement'));
const PurchaseOrder = lazy(() => import('@/pages/PurchaseOrder'));
const GoodsReceivedNote = lazy(() => import('@/pages/GoodsReceivedNote'));
const Batch = lazy(() => import('@/pages/Batch'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));
const Quote = lazy(() => import('@/pages/Quote/index'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));
const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Taxes = lazy(() => import('@/pages/Taxes'));

const Profile = lazy(() => import('@/pages/Profile'));

const About = lazy(() => import('@/pages/About'));
const ApprovalDashboard = lazy(() => import('@/pages/Approval/ApprovalDashboard'));
const Admin = lazy(() => import('@/pages/Admin'));

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
    },
    {
      path: '/product',
      element: <Product />,
    },
    {
      path: '/product/category',
      element: <ProductCategory />,
    },
    {
      path: '/inventory/warehouse',
      element: <Warehouse />,
    },
    {
      path: '/inventory/stock-movement',
      element: <StockMovement />,
    },
    {
      path: '/inventory/purchase-order',
      element: <PurchaseOrder />,
    },
    {
      path: '/inventory/grn',
      element: <GoodsReceivedNote />,
    },
    {
      path: '/inventory/batch',
      element: <Batch />,
    },
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/customer/read/:id',
      element: <CustomerRead />,
    },
    {
      path: '/lead',
      element: <Lead />,
    },
    {
      path: '/employee',
      element: <Employee />,
    },
    {
      path: '/payroll',
      element: <Payroll />,
    },
    {
      path: '/payroll/read/:id',
      element: <PayrollRead />,
    },
    {
      path: '/account',
      element: <Account />,
    },
    {
      path: '/fiscal-period',
      element: <FiscalPeriod />,
    },
    {
      path: '/attendance',
      element: <Attendance />,
    },
    {
      path: '/leave',
      element: <Leave />,
    },
    {
      path: '/approval',
      element: <ApprovalDashboard />,
    },
    {
      path: '/admin',
      element: <Admin />,
    },

    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: <PaymentUpdate />,
    },

    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/settings/edit/:settingsKey',
      element: <Settings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/taxes',
      element: <Taxes />,
    },

    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
