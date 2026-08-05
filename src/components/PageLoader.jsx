import { Flex, Skeleton, Spin } from 'antd';

/**
 * Suspense fallback while a lazily loaded route downloads.
 *
 * `variant="skeleton"` keeps the page shape so the layout does not jump when
 * the real content arrives. The spinner variant is for smaller inline waits.
 */
const PageLoader = ({ variant = 'skeleton', minHeight = 320 }) => {
  if (variant === 'spinner') {
    return (
      <Flex align="center" justify="center" style={{ minHeight }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div style={{ minHeight }} aria-busy="true" aria-live="polite">
      <Skeleton active paragraph={{ rows: 2 }} style={{ maxWidth: 420, marginBottom: 32 }} />
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  );
};

export default PageLoader;
