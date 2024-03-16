import { Image } from 'antd'
import React from 'react'

const LayoutLogo = () => {
    return (
        <div className="demo-logo-vertical"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem', marginBottom: '2rem' }}
        >
            <Image
                src='/vite.svg'
                alt='logo'
                height={80}
                width={80}
                preview={false} />
        </div>
    )
}

export default LayoutLogo;
