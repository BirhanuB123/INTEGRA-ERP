import { Table, Typography } from 'antd';
import useLanguage from '@/locale/useLanguage';
import useMoney from '@/settings/useMoney';

const { Text } = Typography;

export default function PayrollTable({ payslips = [] }) {
    const translate = useLanguage();
    const { moneyFormatter } = useMoney();

    const columns = [
        {
            title: 'S/N',
            dataIndex: 'sn',
            key: 'sn',
            render: (_, __, index) => index + 1,
            width: 50,
        },
        {
            title: 'Name of Employees',
            dataIndex: ['employee', 'name'],
            key: 'name',
        },
        {
            title: 'Basic Salary',
            dataIndex: 'basicSalary',
            key: 'basicSalary',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Taxable Allowance',
            dataIndex: 'taxableAllowance',
            key: 'taxableAllowance',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Non-Taxable Allowance',
            dataIndex: 'nonTaxableAllowance',
            key: 'nonTaxableAllowance',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Over Time',
            dataIndex: 'overtime',
            key: 'overtime',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Penalty',
            dataIndex: 'penalty',
            key: 'penalty',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Gross Salary',
            dataIndex: 'grossSalary',
            key: 'grossSalary',
            render: (val) => <Text strong>{moneyFormatter({ amount: Number(val) || 0 })}</Text>,
        },
        {
            title: 'Taxable Income',
            dataIndex: 'taxableIncome',
            key: 'taxableIncome',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: '11% Pension Fund (Company)',
            dataIndex: 'pensionCompany',
            key: 'pensionCompany',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: '7% Pension Contrib (Employee)',
            dataIndex: 'pensionEmployee',
            key: 'pensionEmployee',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Loan',
            dataIndex: 'loan',
            key: 'loan',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Income Tax',
            dataIndex: 'incomeTax',
            key: 'incomeTax',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Total Deduction',
            dataIndex: 'totalDeduction',
            key: 'totalDeduction',
            render: (val) => moneyFormatter({ amount: Number(val) || 0 }),
        },
        {
            title: 'Net Pay',
            dataIndex: 'netPay',
            key: 'netPay',
            render: (val) => <Text strong type="success">{moneyFormatter({ amount: Number(val) || 0 })}</Text>,
        },
        {
            title: 'Signature',
            dataIndex: 'signature',
            key: 'signature',
            render: () => '________________',
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={payslips}
            rowKey="_id"
            pagination={false}
            bordered
            size="small"
            scroll={{ x: 1500 }}
        />
    );
}
