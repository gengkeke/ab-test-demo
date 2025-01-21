import {Button, Flex, message} from 'antd';
import React, {useEffect, useState} from 'react';
import Mock from 'mockjs'

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
    window["hina"].track('roombuyNowClick',
      Mock.mock({
        'commodity_id': '@integer(10, 100000)',
        'commodity_name': '@cword(5)',
        'present_price': '@integer(10, 100000)',
        strList: Mock.mock(['@ctitle()', '@ctitle()', '@ctitle()']),
        obj: Mock.mock({
          'id': '@integer(10, 100000)',
          'name': '@name',
          'age|20-30': 25,
          'gender|1': ['男', '女']
        }),
      }));
    message.success('购买成功', 0.2);
  };


  return (
    <Flex gap="small" wrap>
      <Button type="primary" onClick={() => {
        window["hina"].track('H_AppStart', {
          obj: Mock.mock({
            'id': '@integer(10, 100000)',
            'name': '@name',
            'age|20-30': 25,
            'gender|1': ['男', '女']
          }),
          strList: Mock.mock(['@ctitle()', '@ctitle()', '@ctitle()']),
          H_is_first_time: Mock.mock('@boolean()'),
          H_screen_name: Mock.mock('@ctitle()'),
          H_title: Mock.mock('@ctitle()')
        })
        ;
      }}>App 启动</Button>
      <Button type="primary" onClick={() => {
        window["hina"].track('inRoom', {
          room_name: Mock.mock('@cword(5)'),
          player_name: Mock.mock('@cname()'),
          is_follow_anchor: Mock.mock('@boolean()'),
          strList: Mock.mock(['@ctitle()', '@ctitle()', '@ctitle()']),
          obj: Mock.mock({
            'id': '@integer(10, 100000)',
            'name': '@name',
            'age|20-30': 25,
            'gender|1': ['男', '女']
          }),
        });
      }}>进入直播间</Button>
      <Button type="primary" style={{backgroundColor: btnColor}} onClick={() => {
        commitRoombuyNowClick();
      }}>立即购买</Button>
    </Flex>
  );
};

export default ABTest;
