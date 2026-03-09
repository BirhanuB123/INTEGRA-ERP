import { useState, useCallback, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { request } from '@/request';
import useDebounce from '@/hooks/useDebounce';
import useLanguage from '@/locale/useLanguage';
import useResponsive from '@/hooks/useResponsive';

export default function GlobalSearchBar() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const translate = useLanguage();
  const { isMobile } = useResponsive();

  const [, cancelDebounce] = useDebounce(
    () => setDebouncedSearchText(searchText),
    500,
    [searchText]
  );

  const fetchResults = useCallback(async (query) => {
    if (!query || query.trim() === '') {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await request.search({
        entity: 'global',
        options: { q: query },
      });

      if (response && response.success && response.result) {
        const groupedResults = response.result.reduce((acc, item) => {
          if (!acc[item.entity]) {
            acc[item.entity] = [];
          }
          acc[item.entity].push({
            value: `${item.entity}:${item._id}`,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.label}</span>
                <span style={{ color: '#999', fontSize: '12px' }}>{item.sublabel}</span>
              </div>
            ),
          });
          return acc;
        }, {});

        const formattedOptions = Object.keys(groupedResults).map((entity) => ({
          key: entity,
          label: <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{entity}s</span>,
          options: groupedResults[entity],
        }));

        setOptions(formattedOptions);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Global search error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchText && debouncedSearchText.trim()) {
      fetchResults(debouncedSearchText.trim());
    } else {
      setOptions([]);
    }
    return () => cancelDebounce();
  }, [debouncedSearchText, fetchResults]);

  const onSelect = (value) => {
    const [entity, id] = value.split(':');
    let path = `/${entity}`;

    switch (entity) {
      case 'client':
        path = `/customer/read/${id}`;
        break;
      case 'invoice':
      case 'quote':
      case 'payment':
        path = `/${entity}/read/${id}`;
        break;
      case 'employee':
      case 'product':
        path = `/${entity}`;
        break;
      default:
        path = `/${entity}`;
    }

    setSearchText('');
    navigate(path);
  };

  return (
    <div 
      className="global-search-bar" 
      style={{ 
        flexGrow: 1, 
        width: '100%',
        maxWidth: isMobile ? '100%' : '500px', 
        margin: isMobile ? '0' : '0 24px 0 0' 
      }}
    >
      <AutoComplete
        popupClassName="global-search-dropdown"
        dropdownStyle={{ zIndex: 1100, minWidth: isMobile ? 'calc(100vw - 32px)' : '300px' }}
        style={{ width: '100%' }}
        options={options}
        onSelect={onSelect}
        onSearch={(text) => setSearchText(text)}
        value={searchText}
        filterOption={false}
        notFoundContent={loading ? null : (searchText.trim() ? translate('no_results') : null)}
      >
        <Input
          size={isMobile ? "small" : "medium"}
          placeholder={isMobile ? translate('search') : translate('search_everything')}
          prefix={<SearchOutlined />}
          loading={loading}
          allowClear
          style={{
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
          }}
        />
      </AutoComplete>
    </div>
  );
}
