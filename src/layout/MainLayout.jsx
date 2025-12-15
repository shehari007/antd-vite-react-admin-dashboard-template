import React, { useState, useEffect } from 'react';
import { Layout, theme, Grid } from 'antd';
import LayoutFooter from './LayoutFooter';
import LayoutHeader from './LayoutHeader';
import LayoutSidebar from './LayoutSidebar';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDrawerOpen(!mobileDrawerOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeMobileDrawer = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LayoutSidebar
        collapsed={collapsed}
        isMobile={isMobile}
        mobileDrawerOpen={mobileDrawerOpen}
        onClose={closeMobileDrawer}
      />
      <Layout
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
          overflow: 'auto',
        }}
      >
        <LayoutHeader
          collapsed={collapsed}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        <Content
          style={{
            margin: isMobile ? '16px 8px 0' : '24px 16px 0',
            flex: '1 0 auto',
          }}
        >
          <div
            style={{
              padding: isMobile ? 16 : 24,
              minHeight: '100%',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <LayoutFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;