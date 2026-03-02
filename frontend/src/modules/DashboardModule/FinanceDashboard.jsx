import { useEffect, useState } from 'react';
import { Row, Col, Grid } from 'antd';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { useMoney } from '@/settings';
import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import { selectMoneyFormat } from '@/redux/settings/selectors';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import RecentTable from './components/RecentTable';
import DonutChart from './components/DonutChart';

const { useBreakpoint } = Grid;

export default function FinanceDashboard() {
  const translate = useLanguage();
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const screens = useBreakpoint();
  const gutter = screens.lg ? [24, 24] : screens.sm ? [16, 16] : [12, 12];
  const displayName = currentAdmin?.name || currentAdmin?.email || translate('User');
  const displayRole = currentAdmin?.role ? translate(currentAdmin.role) : 'Finance';

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({ entity, options: { currency } });
  };

  const { result: invoiceResult, isLoading: invoiceLoading, onFetch: fetchInvoicesStats } = useOnFetch();
  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();
  const { result: paymentResult, isLoading: paymentLoading, onFetch: fetchPaymentsStats } = useOnFetch();

  useEffect(() => {
    const currency = money_format_settings?.default_currency_code || null;
    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPaymentsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [money_format_settings?.default_currency_code]);

  const dataTableColumns = [
    { title: translate('number'), dataIndex: 'number' },
    { title: translate('Client'), dataIndex: ['client', 'name'] },
    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => ({ style: { textAlign: 'right', whiteSpace: 'nowrap', direction: 'ltr' } }),
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    { title: translate('Status'), dataIndex: 'status' },
  ];

  const statisticCards = [
    { result: invoiceResult, isLoading: invoiceLoading, entity: 'invoice', title: translate('Invoices') },
    { result: quoteResult, isLoading: quoteLoading, entity: 'quote', title: translate('quote') },
  ].map((data, index) => (
    <PreviewCard
      key={index}
      title={data.title}
      isLoading={data.isLoading}
      entity={data.entity}
      statistics={
        !data.isLoading &&
        data.result?.performance?.map((item) => ({
          tag: item?.status,
          color: 'blue',
          value: item?.percentage,
        }))
      }
    />
  ));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  if (!money_format_settings) return null;

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
          <p className="dashboard-subtitle">{translate('dashboard_subtitle_finance')}</p>
        </header>

        <h3 className="dashboard-overview-title">{translate('works_overview')}</h3>
        <Row gutter={gutter}>
          <SummaryCard
            title={translate('Invoices')}
            prefix={translate('This month')}
            isLoading={invoiceLoading}
            data={invoiceResult?.total}
          />
          <SummaryCard
            title={translate('Quote')}
            prefix={translate('This month')}
            isLoading={quoteLoading}
            data={quoteResult?.total}
          />
          <SummaryCard
            title={translate('paid')}
            prefix={translate('This month')}
            isLoading={paymentLoading}
            data={paymentResult?.total}
          />
          <SummaryCard
            title={translate('Unpaid')}
            prefix={translate('Not Paid')}
            isLoading={invoiceLoading}
            data={invoiceResult?.total_undue}
          />
        </Row>
        <div className="space30" />
        <Row gutter={gutter}>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <DonutChart
              title={translate('invoice_status')}
              loading={invoiceLoading}
              data={
                invoiceResult?.performance?.map((item) => ({
                  name: item?.status,
                  value: item?.percentage,
                })) || []
              }
            />
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <DonutChart
              title={translate('quote_status')}
              loading={quoteLoading}
              data={
                quoteResult?.performance?.map((item) => ({
                  name: item?.status,
                  value: item?.percentage,
                })) || []
              }
            />
          </Col>
        </Row>
        <div className="space30" />
        <Row className="pad20" gutter={[0, 0]}>
          {statisticCards}
        </Row>
        <div className="space30" />
        <Row gutter={gutter}>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <div className="whiteBox shadow premium-card recent-activity-card pad20 dashboard-recent-card">
              <h3 className="dashboard-section-title">{translate('Recent Invoices')}</h3>
              <RecentTable entity="invoice" dataTableColumns={dataTableColumns} />
            </div>
          </Col>
          <Col xs={{ span: 24 }} lg={{ span: 12 }}>
            <div className="whiteBox shadow premium-card recent-activity-card pad20 dashboard-recent-card">
              <h3 className="dashboard-section-title">{translate('Recent Quotes')}</h3>
              <RecentTable entity="quote" dataTableColumns={dataTableColumns} />
            </div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
}
