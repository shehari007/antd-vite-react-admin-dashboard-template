import React from 'react';
import { Layout, Drawer } from 'antd';
import LayoutLogo from './LayoutLogo';
import LayoutMenu from './LayoutMenu';

const { Sider } = Layout;

const LayoutSidebar = ({ collapsed, isMobile, mobileDrawerOpen, onClose }) => {
  const siderContent = (
    <>
      <LayoutLogo collapsed={collapsed && !isMobile} />
      <LayoutMenu onItemClick={isMobile ? onClose : undefined} />
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={onClose}
        open={mobileDrawerOpen}
        width={250}
        styles={{
          body: {
            padding: 0,
            background: '#001529',
          },
        }}
      >
        {siderContent}
      </Drawer>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {siderContent}
    </Sider>
  );
};

export default LayoutSidebar;
