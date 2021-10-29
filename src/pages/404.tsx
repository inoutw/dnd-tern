import React from 'react';
import { Empty } from 'antd';

const NotFount: React.FC = () => {
  return (
    <div className="error-page-container">
      <Empty
        imageStyle={{
          height: 600
        }}
        description={<>抱歉，您找的页面不存在~</>}
      />
    </div>
  );
};
export default NotFount;
