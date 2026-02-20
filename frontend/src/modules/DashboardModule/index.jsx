import { useEffect, useState } from 'react';

import { Tag, Row, Col, Grid } from 'antd';
import { motion } from 'framer-motion';
import useLanguage from '@/locale/useLanguage';

import { useMoney } from '@/settings';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import useOnFetch from '@/hooks/useOnFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { useSelector } from 'react-redux';

const { useBreakpoint } = Grid;

export default function DashboardModule() {
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const money_format_settings = useSelector(selectMoneyFormat);
  const screens = useBreakpoint();
  const gutter = screens.lg ? [24, 24] : screens.sm ? [16, 16] : [12, 12];

  const getStatsData = async ({ entity, currency }) => {
    return await request.summary({
      entity,
      options: { currency },
    });
  };

  const {
    result: invoiceResult,
    isLoading: invoiceLoading,
    onFetch: fetchInvoicesStats,
  } = useOnFetch();

  const { result: quoteResult, isLoading: quoteLoading, onFetch: fetchQuotesStats } = useOnFetch();

  const {
    result: paymentResult,
    isLoading: paymentLoading,
    onFetch: fetchPayemntsStats,
  } = useOnFetch();

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  useEffect(() => {
    const currency = money_format_settings.default_currency_code || null;

    if (currency) {
      fetchInvoicesStats(getStatsData({ entity: 'invoice', currency }));
      fetchQuotesStats(getStatsData({ entity: 'quote', currency }));
      fetchPayemntsStats(getStatsData({ entity: 'payment', currency }));
    }
  }, [money_format_settings.default_currency_code]);

  const dataTableColumns = [
    {
      title: translate('number'),
      dataIndex: 'number',
    },
    {
      title: translate('Client'),
      dataIndex: ['client', 'name'],
    },

    {
      title: translate('Total'),
      dataIndex: 'total',
      onCell: () => {
        return {
          style: {
            textAlign: 'right',
            whiteSpace: 'nowrap',
            direction: 'ltr',
          },
        };
      },
      render: (total, record) => moneyFormatter({ amount: total, currency_code: record.currency }),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
  ];

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
      title: translate('Invoices'),
    },
    {
      result: quoteResult,
      isLoading: quoteLoading,
      entity: 'quote',
      title: translate('quote'),
    },
  ];

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading, title } = data;

    return (
      <PreviewCard
        key={index}
        title={title}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (money_format_settings) {
    return (
      <div className="dashboard-container">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <header className="dashboard-page-header">
            <h1 className="dashboard-title">{translate('dashboard')}</h1>
            <p className="dashboard-subtitle">
              {translate('dashboard_subtitle')}
            </p>
          </header>

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
            <Col className="gutter-row w-full" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
              <div className="whiteBox shadow premium-card dashboard-stats-box">
                <Row className="pad20" gutter={[0, 0]}>
                  {statisticCards}
                </Row>
              </div>
            </Col>
            <Col className="gutter-row w-full" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
              <CustomerPreviewCard
                isLoading={clientLoading}
                activeCustomer={clientResult?.active}
                newCustomer={clientResult?.new}
              />
            </Col>
          </Row>
          <div className="space30" />
          <Row gutter={gutter}>
            <Col className="gutter-row w-full" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
              <div className="whiteBox shadow premium-card recent-activity-card pad20 dashboard-recent-card">
                <h3 className="dashboard-section-title">{translate('Recent Invoices')}</h3>
                <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
              </div>
            </Col>
            <Col className="gutter-row w-full" xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }}>
              <div className="whiteBox shadow premium-card recent-activity-card pad20 dashboard-recent-card">
                <h3 className="dashboard-section-title">{translate('Recent Quotes')}</h3>
                <RecentTable entity={'quote'} dataTableColumns={dataTableColumns} />
              </div>
            </Col>
          </Row>
        </motion.div>
      </div>
    );
  } else {
    return <></>;
  }
}
