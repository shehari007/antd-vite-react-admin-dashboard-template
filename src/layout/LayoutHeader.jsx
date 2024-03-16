import React from 'react'
import { Layout, theme, Space, Typography } from 'antd'
import  handleLogOut  from '../Utils/Auth/Logout';

const { Link } = Typography;
const { Header } = Layout;
const LayoutHeader = () => {
    const {
        token: { colorBgContainer },
      } = theme.useToken();
    return (
        <Header
            style={{
                padding: 0,
                background: colorBgContainer,
                display: 'flex',
                justifyContent: 'end',
                alignContent: 'end',
                alignItems: 'end'
            }}
        >
            <Space align='end' style={{ marginRight: '30px' }} >
                <Link onClick={() => handleLogOut()}>Logout</Link>
            </Space>
        </Header>
    )
}

export default LayoutHeader;
