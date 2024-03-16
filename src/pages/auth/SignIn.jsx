import { Flex, Input, Form, Button, Card, Space } from 'antd'
import React from 'react'

const SignIn = () => {

  const handleOnSubmt = async (values) => {
    console.log('Received values of form: ', values)
  }
  return (
    <>

      <Flex align='center' justify='centrer' vertical style={{ marginTop: '30vh' }}>
        <Card
        >
          <Flex align='center' justify='center'><img src='/vite.svg' alt='signin' /></Flex>
          <br />
          <Form
            onFinish={handleOnSubmt}
            layout='vertical'
            style={{ width: '250px' }}
          >

            <Form.Item label="Email" name="email"
              rules={[
                {
                  required: true,
                  type: 'email'
                },
              ]}
            >
              <Input placeholder='email' size='large' />
            </Form.Item>

            <Form.Item label="Password" name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                },
              ]}
            >
              <Input.Password placeholder='password' size='large' />
            </Form.Item>

            <Form.Item>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Sign In
                </Button>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Forgot Password?
                </Button>
              </Space>
            </Form.Item>

          </Form>
        </Card>
      </Flex>

    </>
  )
}

export default SignIn