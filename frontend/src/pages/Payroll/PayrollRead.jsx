import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Result, Button, Spin, Divider, Typography } from 'antd';
import { request } from '@/request';
import PayrollTable from './PayrollTable';
import useLanguage from '@/locale/useLanguage';
import { ErpLayout } from '@/layout';

const { Content } = Layout;
const { Title } = Typography;

export default function PayrollRead() {
    const { id } = useParams();
    const translate = useLanguage();
    const [payroll, setPayroll] = useState(null);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const payrollRes = await request.read({ entity: 'payroll', id });
                if (payrollRes.success) {
                    setPayroll(payrollRes.result);

                    // Fetch associated payslips
                    const payslipsRes = await request.list({ entity: 'payslip', options: { payroll: id } });
                    if (payslipsRes.success) {
                        setPayslips(payslipsRes.result);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    }

    if (!payroll) {
        return <Result status="404" title="Payroll not found" />;
    }

    return (
        <ErpLayout>
            <Content
                className="whiteBox shadow"
                style={{
                    padding: '20px',
                    margin: '20px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>
                        Payroll: {payroll.month}/{payroll.year} ({payroll.status.toUpperCase()})
                    </Title>
                    <Button type="primary" onClick={() => window.print()}>
                        Print Payroll
                    </Button>
                </div>
                <Divider />
                <PayrollTable payslips={payslips} />

                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ marginRight: '50px' }}>
                        <Title level={5}>Total Gross: {payroll.totalGrossSalary?.toFixed(2)}</Title>
                        <Title level={5}>Total Tax: {payroll.totalTax?.toFixed(2)}</Title>
                    </div>
                    <div>
                        <Title level={4} type="success">Total Net Pay: {payroll.totalNetPay?.toFixed(2)}</Title>
                    </div>
                </div>
            </Content>
        </ErpLayout>
    );
}
