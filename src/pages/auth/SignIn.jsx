import { Flex, Input, Form, Button, Card, Space, Image } from 'antd'
import React from 'react'
import handleSignIn from '../../Utils/Auth/SignIn';

const SignIn = () => {

  const handleOnSubmt = async (values) => {
    console.log('Received values of form: ', values);
    await handleSignIn(values);
  }
  
  return (
    <>

      <Flex align='center' justify='centrer' vertical style={{ marginTop: '10vh' }}>
        <Card
        style={{
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
        >
          <Flex align='center' justify='center'><Image src='/vite.svg' height={150} width={150} preview={false} alt='signin' /></Flex>
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
