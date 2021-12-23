import React from 'react';
import { Empty, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { common } from 'assets';

const NotFount: React.FC = () => {
  const history = useHistory();
  return (
    <div className="error-page-container">
      <Empty
        imageStyle={{
          height: 600
        }}
        description={
          <>
            抱歉，您找的页面不存在~
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
        image={<img src={common.not_found} alt="" />}
      />
    </div>
  );
};
export default NotFount;
