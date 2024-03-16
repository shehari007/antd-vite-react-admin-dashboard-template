import React from 'react'
import { Layout } from 'antd'
import Link from 'antd/es/typography/Link';

const { Footer } = Layout;
const LayoutFooter = () => {
    return (
        <Footer
            style={{
                textAlign: 'center',
            }}
        >
            Vite + React + Ant Design 5 Admin Dashboard Starter Template Created by <Link href="https://github.com/shehari007" target='_blank'>Muhammad Sheharyar Butt</Link>
        </Footer>
    )
}

export default LayoutFooter
