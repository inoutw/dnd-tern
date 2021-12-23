import { Menu, Dropdown, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { common } from 'assets';
import eventBus from 'utils/eventBus';
import style from './style.module.scss';

const Header = () => {
  const onClick = (e: any) => {
    if (e.key === 'logout') {
      Modal.confirm({
        title: `确定退出系统吗？`,
        onOk: () => {
          eventBus.emit('logout');
        }
      });
    }
  };

  const userMenu = (
    <Menu onClick={onClick} style={{ width: 130, margin: '16px 0 0 40px' }}>
      <Menu.Item key="logout">退出</Menu.Item>
    </Menu>
  );

  return (
    <div className={style.header}>
      <Dropdown overlay={userMenu}>
        <span>
          <img src={common.default_person} alt="" className={style['head-avatar']} />
          <span className="cursor-pointer">你好，系统超管</span>
          <DownOutlined
            style={{
              marginLeft: '5px',
              fontSize: '10px',
              verticalAlign: 'baseline'
            }}
          />
        </span>
      </Dropdown>
    </div>
  );
};

export default Header;
