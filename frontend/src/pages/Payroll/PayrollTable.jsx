import { Table, Typography } from 'antd';
import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

export default function PayrollTable({ payslips = [] }) {
    const translate = useLanguage();

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
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Taxable Allowance',
            dataIndex: 'taxableAllowance',
            key: 'taxableAllowance',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Non-Taxable Allowance',
            dataIndex: 'nonTaxableAllowance',
            key: 'nonTaxableAllowance',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Over Time',
            dataIndex: 'overtime',
            key: 'overtime',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Penalty',
            dataIndex: 'penalty',
            key: 'penalty',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Gross Salary',
            dataIndex: 'grossSalary',
            key: 'grossSalary',
            render: (val) => <Text strong>{val?.toFixed(2)}</Text>,
        },
        {
            title: 'Taxable Income',
            dataIndex: 'taxableIncome',
            key: 'taxableIncome',
            render: (val) => val?.toFixed(2),
        },
        {
            title: '11% Pension Fund (Company)',
            dataIndex: 'pensionCompany',
            key: 'pensionCompany',
            render: (val) => val?.toFixed(2),
        },
        {
            title: '7% Pension Contrib (Employee)',
            dataIndex: 'pensionEmployee',
            key: 'pensionEmployee',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Loan',
            dataIndex: 'loan',
            key: 'loan',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Income Tax',
            dataIndex: 'incomeTax',
            key: 'incomeTax',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Total Deduction',
            dataIndex: 'totalDeduction',
            key: 'totalDeduction',
            render: (val) => val?.toFixed(2),
        },
        {
            title: 'Net Pay',
            dataIndex: 'netPay',
            key: 'netPay',
            render: (val) => <Text strong type="success">{val?.toFixed(2)}</Text>,
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
