import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import DashboardModule from '@/modules/DashboardModule';
import HRDashboard from '@/modules/DashboardModule/HRDashboard';
import FinanceDashboard from '@/modules/DashboardModule/FinanceDashboard';
import EmployeeDashboard from '@/modules/DashboardModule/EmployeeDashboard';

const ROLE_DASHBOARDS = {
  owner: DashboardModule,
  admin: DashboardModule,
  hr_head: HRDashboard,
  finance_head: FinanceDashboard,
  employee: EmployeeDashboard,
};

export default function Dashboard() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const role = currentAdmin?.role || 'employee';
  const DashboardComponent = ROLE_DASHBOARDS[role] || EmployeeDashboard;
  return <DashboardComponent />;
}
