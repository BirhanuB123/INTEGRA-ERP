import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Spin, Grid } from 'antd';
import { motion } from 'framer-motion';
import {
  TeamOutlined,
  FileDoneOutlined,
  CalendarOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import StatCard from './components/StatCard';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const { useBreakpoint } = Grid;

export default function HRDashboard() {
  const translate = useLanguage();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const screens = useBreakpoint();
  const gutter = screens.lg ? [24, 24] : screens.sm ? [16, 16] : [12, 12];
  const displayName = currentAdmin?.name || currentAdmin?.email || translate('User');
  const displayRole = currentAdmin?.role ? translate(currentAdmin.role) : 'HR';

  const [approvalSummary, setApprovalSummary] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await request.summary({ entity: 'approval' });
        if (res?.result) setApprovalSummary(res.result);
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  return (
    <div className="dashboard-container">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <header className="dashboard-page-header">
          <div className="dashboard-greeting">
            <h1 className="dashboard-greeting-title">
              {translate('hello')}, {displayName}
            </h1>
            <p className="dashboard-greeting-role">{displayRole}</p>
          </div>
          <h2 className="dashboard-title">{translate('dashboard')}</h2>
          <p className="dashboard-subtitle">{translate('dashboard_subtitle_hr')}</p>
        </header>

        <h3 className="dashboard-overview-title">{translate('overview')}</h3>
        <Row gutter={gutter}>
          <StatCard
            title={translate('approvals')}
            prefix={translate('pending')}
            value={approvalSummary.pending}
            icon={ClockCircleOutlined}
            linkTo="/approval"
            isLoading={loading}
            iconVariant="blue"
          />
          <StatCard
            title={translate('approvals')}
            prefix={translate('approved')}
            value={approvalSummary.approved}
            icon={CheckCircleOutlined}
            linkTo="/approval"
            isLoading={loading}
            iconVariant="green"
          />
          <StatCard
            title={translate('payroll')}
            prefix=""
            value=""
            icon={WalletOutlined}
            linkTo="/payroll"
            isLoading={false}
            iconVariant="yellow"
          />
          <StatCard
            title={translate('attendance')}
            prefix=""
            value=""
            icon={CalendarOutlined}
            linkTo="/attendance"
            isLoading={false}
            iconVariant="orange"
          />
        </Row>

        <div className="space30" />
        <Row gutter={gutter}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
            <Card className="whiteBox shadow premium-card pad20" title={translate('staff_hr')}>
              <Link to="/employee">{translate('employees')}</Link>
              <br />
              <Link to="/leave">{translate('leave')}</Link>
              <br />
              <Link to="/approval">{translate('approvals')}</Link>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
}
