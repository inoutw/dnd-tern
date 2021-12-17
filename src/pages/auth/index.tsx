import { Form, Input, Button } from 'antd';
import api from 'api/auth';
const Auth: React.FC<{}> = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
    api
      .login(values)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {});
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(245,245,245,0.8)'
      }}>
      <div
        style={{
          width: 400,
          height: 270,
          padding: '20px',
          background: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: '40px',
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 20,
            textShadow: '0 0 10px rgba(0,0,0,0.1)',
            letterSpacing: '2px'
          }}>
          欢迎登录配置中心
        </div>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号!' }]}>
            <Input placeholder="请输入账号" />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Auth;
