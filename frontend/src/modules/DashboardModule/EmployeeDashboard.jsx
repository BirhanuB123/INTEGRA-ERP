import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Spin, Grid } from 'antd';
import { motion } from 'framer-motion';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  UserOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import useMoney from '@/settings/useMoney';
import StatCard from './components/StatCard';
import DonutChart from './components/DonutChart';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const { useBreakpoint } = Grid;

export default function EmployeeDashboard() {
  const translate = useLanguage();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const screens = useBreakpoint();
  const gutter = screens.lg ? [24, 24] : screens.sm ? [16, 16] : [12, 12];
  const displayName = currentAdmin?.name || currentAdmin?.email || translate('User');
  const displayRole = currentAdmin?.role ? translate(currentAdmin.role) : translate('employee');
  const { moneyFormatter } = useMoney();
  const isEmployee = currentAdmin?.role === 'employee';

  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [leaveCount, setLeaveCount] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(null);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [salaryLoading, setSalaryLoading] = useState(false);

  // Employee's own approval requests (use list - backend filters by requestedBy for non-owner)
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await request.list({ entity: 'approval', options: { items: 250 } });
        if (res?.success && Array.isArray(res?.result)) {
          const pending = res.result.filter((a) => a.status === 'pending').length;
          setPendingApprovals(pending);
        }
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // My leave requests (backend filters by current user's employee when role is employee)
  useEffect(() => {
    const fetch = async () => {
      setLeaveLoading(true);
      try {
        const res = await request.list({ entity: 'leave', options: { items: 500 } });
        if (res?.success && Array.isArray(res?.result)) {
          setLeaveCount(res.result.length);
        }
      } catch (_) {
        // ignore
      } finally {
        setLeaveLoading(false);
      }
    };
    fetch();
  }, []);

  // My attendance records
  useEffect(() => {
    const fetch = async () => {
      setAttendanceLoading(true);
      try {
        const res = await request.list({ entity: 'attendance', options: { items: 500 } });
        if (res?.success && Array.isArray(res?.result)) {
          setAttendanceCount(res.result.length);
        }
      } catch (_) {
        // ignore
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetch();
  }, []);

  // My salary / profile (only for employee role – backend returns own record only)
  useEffect(() => {
    if (!isEmployee) return;
    const fetch = async () => {
      setSalaryLoading(true);
      try {
        const res = await request.get({ entity: 'employee', options: { endpoint: 'myProfile' } });
        if (res?.success && res?.result) {
          setMyProfile(res.result);
        }
      } catch (_) {
        // ignore
      } finally {
        setSalaryLoading(false);
      }
    };
    fetch();
  }, [isEmployee]);

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
          <p className="dashboard-subtitle">{translate('dashboard_subtitle_employee')}</p>
        </header>

        <h3 className="dashboard-overview-title">{translate('works_overview')}</h3>
        <Row gutter={gutter}>
          {isEmployee && (
            <StatCard
              title={translate('salary')}
              prefix=""
              value={
                salaryLoading
                  ? null
                  : myProfile?.salary != null && myProfile.salary !== ''
                  ? moneyFormatter({ amount: Number(myProfile.salary) })
                  : '—'
              }
              icon={DollarOutlined}
              linkTo={null}
              isLoading={salaryLoading}
              iconVariant="green"
            />
          )}
          <StatCard
            title={translate('approvals')}
            prefix={translate('pending')}
            value={pendingApprovals}
            icon={ClockCircleOutlined}
            linkTo="/approval"
            isLoading={loading}
            iconVariant="blue"
          />
          <StatCard
            title={translate('leave')}
            prefix=""
            value={leaveCount}
            icon={CalendarOutlined}
            linkTo="/leave"
            isLoading={leaveLoading}
            iconVariant="yellow"
          />
          <StatCard
            title={translate('attendance')}
            prefix=""
            value={attendanceCount}
            icon={FileDoneOutlined}
            linkTo="/attendance"
            isLoading={attendanceLoading}
            iconVariant="green"
          />
          <StatCard
            title={translate('profile')}
            prefix=""
            value=""
            icon={UserOutlined}
            linkTo="/profile"
            isLoading={false}
            iconVariant="orange"
          />
        </Row>

        <div className="space30" />
        <Row gutter={gutter}>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <DonutChart
              title={translate('approval_status')}
              loading={loading || leaveLoading || attendanceLoading}
              data={(() => {
                const p = pendingApprovals ?? 0;
                const l = leaveCount ?? 0;
                const a = attendanceCount ?? 0;
                const total = p + l + a;
                if (total === 0) return [];
                return [
                  { name: 'pending', value: Math.round((p / total) * 100), color: '#0077b6' },
                  { name: 'leave', value: Math.round((l / total) * 100), color: '#ffc107' },
                  { name: 'attendance', value: Math.round((a / total) * 100), color: '#28a745' },
                ].filter((d) => d.value > 0);
              })()}
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Card className="whiteBox shadow premium-card pad20" title={translate('dashboard_quick_links')}>
              <Link to="/approval">{translate('approvals')}</Link>
              <br />
              <Link to="/leave">{translate('leave')}</Link>
              <br />
              <Link to="/attendance">{translate('attendance')}</Link>
              <br />
              <Link to="/profile">{translate('profile')}</Link>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
}
