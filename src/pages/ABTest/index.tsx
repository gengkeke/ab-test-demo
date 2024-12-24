import {Button, Flex, message} from 'antd';
import React, {useEffect, useState} from 'react';

const ABTest: React.FC = () => {

  const [btnColor, setBtnColor] = useState<string>('pink');

  useEffect(() => {
    const abtest_experiment_id = '1871081456440115201';
    window['abTest']?.asyncFetchABTest({
      abtestExperimentId: abtest_experiment_id,
      paramName: 'color',
      valueType: 'STRING',
      defaultValue: 'pink',
      timeoutMilliseconds: 3000,
      callback: (result: string) => {
        setBtnColor(result);
      }
    });
  }, []);

  /**
   * 上报【立即购买】事件
   */
  const commitRoombuyNowClick = () => {
    window["hina"].track('roombuyNowClick', {commodity_id: "1", commodity_name: '洗发水', present_price: 10});
    message.success('购买成功', 0.2);
  };


  return (
    <Flex gap="small" wrap>
      <Button type="primary" style={{backgroundColor: btnColor}} onClick={() => {
        commitRoombuyNowClick();
      }}>立即购买</Button>
    </Flex>
  );
};

export default ABTest;
