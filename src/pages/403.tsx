import React from 'react';
import { Empty, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { common } from 'assets';

const Forbidden: React.FC = () => {
  const history = useHistory();
  return (
    <div className="error-page-container">
      <Empty
        className="forbidden"
        imageStyle={{
          height: 600
        }}
        description={
          <>
            抱歉，您无权限访问该页面~
            <Button
              type="link"
              size="small"
              onClick={() => {
                history.push('/app');
              }}>
              返回
            </Button>
          </>
        }
        image={<img src={common.forbidden} alt="" />}
      />
    </div>
  );
};
export default Forbidden;
