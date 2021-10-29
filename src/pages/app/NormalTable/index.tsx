import React, { useState } from 'react';
import { Button, Table, Modal } from 'antd';
// import api from 'api/dashboard';

const NormalTable: React.FC<{}> = () => {
  const [visible, setVisible] = useState(false);
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age'
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address'
    }
  ];
  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: 12
        }}
        onClick={() => {
          setVisible(true);
        }}>
        弹窗
      </Button>
      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={() => {
          // do something
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};

export default NormalTable;
