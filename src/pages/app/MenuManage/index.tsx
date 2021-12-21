import { Tree, Button, Form, TreeSelect, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { NormalModal } from 'csmp-ui';
// import api from 'api/config-center';
import './style.scss';
const MenuSetting: React.FC<{}> = () => {
  const [menuData, setMenuData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [editKey, setEditKey] = useState('');

  useEffect(() => {
    // api.getMenu().then((res: any) => {
    //   setMenuData(res.data || []);
    // });
  }, []);

  // 添加
  const addMenu = () => {
    form.resetFields();
    setIsEdit(false);
    setVisible(true);
  };
  // 修改
  const editMenu = (m: any) => {
    setEditKey(m.key);
    form.setFieldsValue({
      key: m.key,
      title: m.title,
      parentKey: getParentNodeByKey(m.key, { key: 'root', title: '根节点', children: [...menuData] })?.key
    });
    setIsEdit(true);
    setVisible(true);
  };
  // 删除
  const deleteMenu = (m: any) => {
    Modal.confirm({
      title: '确定删除该菜单吗？',
      onOk() {
        // 接口
        let _data = [...menuData];
        deleteTreeNodeByKey(m.key, _data);
        setMenuData(_data);
      }
    });
  };
  // 移动
  const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: string, callback: Function) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...menuData];

    // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: number, arr: any[]) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: any) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: any;
      let i: any;
      loop(data, dropKey, (item: any, index: number, arr: any[]) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }
    setMenuData(data);
  };
  const getParentTree = (menu: any[]) => [{ key: 'root', title: '根节点', children: [...menu] }];
  const getParentNodeByKey = (curKey: string, treeNode: any): any => {
    let pNode = treeNode;
    if (treeNode.children?.length) {
      let subMenus = treeNode.children;
      for (let i = 0; i < subMenus.length; i++) {
        let item = subMenus[i];
        if (item.key === curKey) {
          return pNode;
        }
        let _pNode = getParentNodeByKey(curKey, item);
        if (_pNode) {
          return _pNode;
        }
      }
    }
  };
  const getTreeNodeByKey = (key: string, tree: any[]): any => {
    for (let i = 0; i < tree.length; i++) {
      let m = tree[i];
      if (m.key === key) {
        return m;
      }
      if (m?.children?.length) {
        let _m = getTreeNodeByKey(key, m.children);
        if (_m) {
          return _m;
        }
      }
    }
  };
  const deleteTreeNodeByKey = (key: string, tree: any[]) => {
    for (let i = 0; i < tree.length; i++) {
      let m = tree[i];
      if (m.key === key) {
        tree.splice(i, 1);
      }
      if (m?.children?.length) {
        deleteTreeNodeByKey(key, m.children);
      }
    }
  };
  const getIndexInParentNodeByKey = (key: string, tree: any[]): undefined | number => {
    for (let i = 0; i < tree.length; i++) {
      let m = tree[i];
      if (m.key === key) {
        return i;
      }
      if (m?.children?.length) {
        let _index = getIndexInParentNodeByKey(key, m.children);
        if (_index) {
          return _index;
        }
      }
    }
  };
  // 提交
  const submit = () => {
    form.validateFields().then((values) => {
      let _data = [...menuData];
      let _targetNodes = values.parentKey === 'root' ? _data : getTreeNodeByKey(values.parentKey, _data).children;
      const newNode = {
        key: values.key,
        title: values.title
      };
      if (isEdit) {
        // 获取旧节点 在父节点的索引
        const index = getIndexInParentNodeByKey(editKey, _data);
        // 删除
        deleteTreeNodeByKey(editKey, _data);
        // 插入
        _targetNodes.splice(index, 0, newNode);
      } else {
        _targetNodes.push(newNode);
      }
      setMenuData(_data);
      setVisible(false);
    });
  };

  const save = () => {
    api.saveMenu(menuData).then((res) => {
      message.success('保存成功！');
    });
  };
  return (
    <div className="route-normal-container menu-setting">
      <div className="route-normal-content">
        <div
          style={{
            margin: 16
          }}>
          <Button type="primary" onClick={addMenu}>
            添加菜单
          </Button>
          <Button
            style={{
              marginLeft: 20
            }}
            onClick={save}
            type="primary">
            保存
          </Button>
        </div>
        <Tree
          style={{
            marginTop: 12,
            marginLeft: 8,
            width: 300
          }}
          className="draggable-tree"
          draggable
          blockNode
          onDrop={onDrop}
          treeData={menuData}
          titleRender={(node: any) => (
            <div className="menu-item">
              {node.title}
              <span className="menu-icon-wrap">
                <EditOutlined className="menu-icon-edit" onClick={() => editMenu(node)} />{' '}
                <DeleteOutlined className="menu-icon-delete" onClick={() => deleteMenu(node)} />
              </span>
            </div>
          )}
        />
      </div>

      <NormalModal
        title={isEdit ? '编辑菜单' : '添加菜单'}
        visible={visible}
        onOk={submit}
        onCancel={() => {
          setVisible(false);
        }}>
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Form.Item label="关键字" name="key" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="名称" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="父菜单" name="parentKey" rules={[{ required: true }]}>
            {/* 默认展开 受控 */}
            <TreeSelect disabled={isEdit} treeDefaultExpandedKeys={['root']} treeData={getParentTree(menuData)} />
          </Form.Item>
        </Form>
      </NormalModal>
    </div>
  );
};

export default MenuSetting;
