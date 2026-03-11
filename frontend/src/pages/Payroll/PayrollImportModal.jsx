import { useState } from 'react';
import { Modal, Button, Select, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import { useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

// Map common sheet column names to API field names
const COLUMN_MAP = {
  'name of employees': 'employeeName',
  'employee name': 'employeeName',
  'name': 'employeeName',
  'basic salary': 'basicSalary',
  'taxable allowance': 'taxableAllowance',
  'non-taxable allowance': 'nonTaxableAllowance',
  'overtime': 'overtime',
  'penalty': 'penalty',
  'gross salary': 'grossSalary',
  'taxable income': 'taxableIncome',
  '11% pension (company)': 'pensionCompany',
  '11% pension fund (company share)': 'pensionCompany',
  'pension company': 'pensionCompany',
  '7% pension (employee)': 'pensionEmployee',
  '7% pension contrib. (employee share)': 'pensionEmployee',
  'pension employee': 'pensionEmployee',
  'loan': 'loan',
  'income tax': 'incomeTax',
  'total deduction': 'totalDeduction',
  'net pay': 'netPay',
};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { payslips: [], headers: [] };
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());
  const payslips = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const row = {};
    headers.forEach((h, idx) => {
      const key = COLUMN_MAP[h] || h.replace(/\s+/g, '');
      let val = values[idx];
      if (key === 'employeeName') row[key] = val ? String(val).trim() : '';
      else {
        if (val !== '' && val !== undefined && val !== null) {
          const num = Number(String(val).replace(/,/g, ''));
          row[key] = Number.isFinite(num) ? num : 0;
        } else row[key] = 0;
      }
    });
    if (row.employeeName) payslips.push(row);
  }
  return { payslips, headers };
}

export default function PayrollImportModal({ open, onClose, onSuccess }) {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    const { payslips } = parseCSV(csvText);
    if (payslips.length === 0) {
      message.warning(translate('Import requires a header row and at least one row with employee name.'));
      return;
    }
    setLoading(true);
    try {
      const res = await request.post({
        entity: 'payroll',
        jsonData: { month, year, payslips },
        options: { endpoint: 'import' },
      });
      if (res?.success) {
        message.success(res.message || translate('Import successful.'));
        setCsvText('');
        onSuccess?.();
        dispatch(crud.list({ entity: 'payroll' }));
        onClose();
      } else {
        message.error(res?.message || translate('Import failed.'));
      }
    } catch (e) {
      message.error(e?.message || translate('Import failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCsvText('');
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({ value: currentYear - 5 + i, label: String(currentYear - 5 + i) }));

  return (
    <Modal
      title={translate('import_from_sheet')}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          {translate('Cancel')}
        </Button>,
        <Button key="import" type="primary" loading={loading} onClick={handleImport} icon={<UploadOutlined />}>
          {translate('Import')}
        </Button>,
      ]}
      width={640}
      destroyOnClose
    >
      <p style={{ marginBottom: 12, color: '#666' }}>
        {translate('import_payroll_help')}
      </p>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>{translate('Month')}</label>
          <Select value={month} onChange={setMonth} options={MONTHS} style={{ width: 160 }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4 }}>{translate('Year')}</label>
          <Select value={year} onChange={setYear} options={yearOptions} style={{ width: 120 }} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: 4 }}>{translate('paste_csv_headers')}</label>
        <Input.TextArea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="Name of Employees,Basic Salary,Taxable Allowance,Non-Taxable Allowance,Overtime,Penalty,Gross Salary,Taxable Income,11% Pension (Company),7% Pension (Employee),Loan,Income Tax,Total Deduction,Net Pay"
          rows={10}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
        />
      </div>
    </Modal>
  );
}
