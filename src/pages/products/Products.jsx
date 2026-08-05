import { useCallback, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Rate,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import {
  AppstoreOutlined,
  DollarOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import ErrorState from '@/components/ErrorState';
import { useAsync } from '@/hooks/useAsync';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getCatalogSummary, getProducts } from '@/services/catalogService';
import { PRODUCT_CATEGORIES } from '@/data/products';

const STATUS_TAGS = {
  active: { color: 'success', label: 'In stock' },
  low_stock: { color: 'warning', label: 'Low stock' },
  out_of_stock: { color: 'error', label: 'Out of stock' },
};

/**
 * The page to copy when you build a real list screen.
 *
 * Search, filter, sort, and paging are all passed to the service rather than
 * applied to an array in the component, which is the shape a paginated API
 * needs. Swapping getProducts for a fetch call changes nothing here.
 */
const Products = () => {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [sorter, setSorter] = useState({ field: null, order: 'ascend' });
  const [simulateError, setSimulateError] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 300);
  const pageSize = 6;

  const loadProducts = useCallback(
    () =>
      getProducts({
        search: debouncedSearch,
        category,
        page,
        pageSize,
        sortBy: sorter.field,
        sortOrder: sorter.order,
        simulateError,
      }),
    [debouncedSearch, category, page, sorter, simulateError]
  );

  const { data, loading, error, refresh } = useAsync(loadProducts);
  const { data: summary } = useAsync(useCallback(() => getCatalogSummary(), []));

  const resetToFirstPage = (apply) => (value) => {
    setPage(1);
    apply(value);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name, record) => (
        <Space orientation="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{record.sku}</span>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['md'],
      render: (value) => <Tag>{value}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: true,
      responsive: ['sm'],
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      responsive: ['lg'],
      render: (value) => (
        <Space size={6}>
          <Rate disabled allowHalf defaultValue={value} style={{ fontSize: 12 }} />
          <span style={{ fontSize: 12, opacity: 0.7 }}>{value}</span>
        </Space>
      ),
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = STATUS_TAGS[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title={t('page.products.title')}
        subtitle={t('page.products.subtitle')}
        extra={
          <Space>
            <Tooltip title="Throw an error from the service so you can see the failure state">
              <Space size={6}>
                <WarningOutlined style={{ opacity: 0.6 }} />
                <Switch
                  size="small"
                  checked={simulateError}
                  onChange={resetToFirstPage(setSimulateError)}
                  aria-label="Simulate a failed request"
                />
              </Space>
            </Tooltip>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              {t('common.refresh')}
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Products"
            value={summary?.totalProducts ?? 0}
            icon={<AppstoreOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Inventory value"
            value={summary?.inventoryValue ?? 0}
            prefix="$"
            icon={<DollarOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Out of stock"
            value={summary?.outOfStock ?? 0}
            icon={<WarningOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            title="Average rating"
            value={summary?.averageRating ?? 0}
            icon={<StarOutlined />}
          />
        </Col>
      </Row>

      <Card>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ opacity: 0.45 }} />}
            placeholder="Search by name or SKU"
            value={search}
            onChange={(event) => resetToFirstPage(setSearch)(event.target.value)}
            style={{ width: 260 }}
            aria-label="Search products"
          />
          <Select
            allowClear
            placeholder="All categories"
            value={category}
            onChange={resetToFirstPage(setCategory)}
            options={PRODUCT_CATEGORIES.map((item) => ({ value: item, label: item }))}
            style={{ width: 180 }}
            aria-label="Filter by category"
          />
        </Space>

        {simulateError && !error && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Error simulation is on. The next request will fail on purpose."
          />
        )}

        {error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : (
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={data?.items || []}
            scroll={{ x: 'max-content' }}
            onChange={(_pagination, _filters, nextSorter) =>
              setSorter({
                field: nextSorter?.order ? nextSorter.field : null,
                order: nextSorter?.order || 'ascend',
              })
            }
            pagination={{
              current: page,
              pageSize,
              total: data?.total ?? 0,
              onChange: setPage,
              showSizeChanger: false,
              showTotal: (total) => `${total} products`,
            }}
            locale={{
              emptyText: (
                <EmptyState
                  title="No products matched"
                  description="Try a different search term or clear the category filter."
                  actionLabel="Clear filters"
                  onAction={() => {
                    setSearch('');
                    setCategory(null);
                    setPage(1);
                  }}
                />
              ),
            }}
          />
        )}
      </Card>
    </>
  );
};

export default Products;
