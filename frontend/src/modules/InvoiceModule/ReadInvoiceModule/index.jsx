import NotFound from '@/components/NotFound';
import { ErpLayout } from '@/layout';
import ReadItem from '@/modules/ErpPanelModule/ReadItem';

import PageLoader from '@/components/PageLoader';
import { erp } from '@/redux/erp/actions';
import { selectReadItem } from '@/redux/erp/selectors';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

export default function ReadInvoiceModule({ config }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useLayoutEffect(() => {
    if (id) dispatch(erp.read({ entity: config.entity, id }));
  }, [id, config.entity, dispatch]);

  const { result: currentResult, isSuccess, isLoading } = useSelector(selectReadItem);

  const resultMatchesId = currentResult && String(currentResult._id) === String(id);
  const isWaitingForResult = isLoading || (id && (!currentResult || !resultMatchesId));
  const showNotFound = !isWaitingForResult && (!isSuccess || !currentResult);

  if (isWaitingForResult) {
    return (
      <ErpLayout>
        <PageLoader />
      </ErpLayout>
    );
  }

  return (
    <ErpLayout>
      {!showNotFound && currentResult ? (
        <ReadItem config={config} selectedItem={currentResult} />
      ) : (
        <NotFound entity={config.entity} />
      )}
    </ErpLayout>
  );
}
