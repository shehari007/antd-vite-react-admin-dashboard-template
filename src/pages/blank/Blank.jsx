import React from 'react';
import { Card, Typography, Empty, Button, Space } from 'antd';
import { PlusOutlined, FileAddOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Blank = () => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Blank Page
      </Title>
      
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical" size={8}>
              <Text strong>This is a blank page template</Text>
              <Paragraph type="secondary" style={{ maxWidth: 400, margin: '0 auto' }}>
                Use this page as a starting point for creating new pages in your
                admin dashboard. Add your content, components, and logic here.
              </Paragraph>
            </Space>
          }
        >
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Content
            </Button>
            <Button icon={<FileAddOutlined />}>
              Create Component
            </Button>
          </Space>
        </Empty>
      </Card>
    </div>
  );
};

export default Blank;
