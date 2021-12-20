import { Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import api from 'api/auth';
import style from './style.module.scss';
import { useGlobalContext } from 'App';

const Auth: React.FC<{}> = () => {
  const globalContext = useGlobalContext();

  const onFinish = (values: any) => {
    console.log('Success:', values);
    api
      .login(values)
      .then((res) => {
        console.log(res);
      })
      .finally(() => {
        localStorage.setItem('isLogin', 'yes');
        globalContext.setIsLogin(true);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.introduce}></div>
        <div className={style.form}>
          <div className={style.welcome}>Welcome to</div>
          <div className={style.title}>云阵配置中心</div>
          <Form initialValues={{ remember: true }} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
            <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号!' }]}>
              <Input prefix={<UserOutlined />} placeholder="请输入账号" />
            </Form.Item>

            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
            </Form.Item>

            <Button className={style['login-btn']} type="primary" htmlType="submit">
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
