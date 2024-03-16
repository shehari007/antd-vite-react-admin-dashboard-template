import React from 'react'
import { Layout } from 'antd';
import LayoutLogo from './LayoutLogo';
import LayoutMenu from './LayoutMenu';

const { Sider } = Layout;
const LayoutSidebar = () => {
    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                // console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                // console.log(collapsed, type);
            }}
        >
            <LayoutLogo />
            <LayoutMenu />
        </Sider>
    )
}

export default LayoutSidebar
