import React from 'react'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
const LayoutMenu = () => {

    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const selectedMenu = pathParts[pathParts.length - 1];

    const items = [
        {
            key: 'home',
            label: <Link to='/dashboard/home'>Home</Link>,

        },
        {
            key: 'blank',
            label: <Link to='/dashboard/blank'>Blank Page</Link>,
        }
    ]

    return (
        <Menu theme="dark" mode="inline" items={items} selectedKeys={selectedMenu} />
    )
}

export default LayoutMenu
