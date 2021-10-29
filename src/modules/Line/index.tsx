import React from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../customEcharts';

// 表单配置文件
export const LineFormOption = {
  options: [
    {
      name: 'title', //与options中对应
      label: '图表名称',
      type: 'input',
      placeholder: '请输入图表名称'
    },
    {
      name: 'isSmooth',
      label: '是否光滑',
      type: 'switch'
    },
    {
      name: 'showArea',
      label: '是否显示阴影',
      type: 'switch'
    },
    {
      name: 'showLegend',
      label: '是否显示图例',
      type: 'switch'
    },
    {
      name: 'max',
      label: 'y轴最大值',
      type: 'number', // Number类型
      placeholder: '请输入'
    },
    {
      name: 'unit',
      label: '单位',
      type: 'input',
      placeholder: '请输入单位'
    },
    {
      name: 'symbol',
      label: '形状',
      placeholder: '请选择',
      type: 'select',
      items: [
        {
          name: '空心圆',
          value: 'emptyCircle'
        },
        {
          name: '实心圆',
          value: 'circle'
        },
        {
          name: '矩形',
          value: 'rect'
        },
        {
          name: '圆角矩形',
          value: 'roundRect'
        },
        {
          name: '三角形',
          value: 'triangle'
        },
        {
          name: '菱形',
          value: 'diamond'
        },
        {
          name: '大头针',
          value: 'pin'
        },
        {
          name: '箭头',
          value: 'arrow'
        },
        {
          name: '无',
          value: 'none'
        }
      ]
    },
    {
      name: 'symbolSize',
      label: '形状大小',
      type: 'number', // Number类型
      placeholder: '请输入'
    }
  ],
  data: [
    {
      name: 'apiEnable',
      label: 'Api Enable',
      type: 'switch',
      belong: 'options' //todo
    },
    {
      name: 'data',
      label: 'Static Data',
      type: 'json',
      belong: 'data'
      //visible: (module) => !module.options.apiEnable
    },
    {
      name: 'data',
      label: 'Dynamic Data',
      type: 'api',
      belong: 'data'
      //visible: (module) => !!module.options.apiEnable
    }
  ]
};

// 默认props
export const lineDefaultOption = {
  type: 'line',
  title: 'Line Chart',
  layout: {
    width: 100
  },
  options: {
    isSmooth: true,
    showArea: true,
    max: undefined,
    unit: '',
    symbol: 'circle', // emptyCircle, 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    symbolSize: 10,
    colorList: [],
    grid: {
      top: 30,
      bottom: 10,
      left: 30,
      right: 30
    },
    xAxisLabel: {
      rotate: 0,
      textLength: 5,
      margin: 20,
      align: 'center' // left center right
    },
    showLegend: false,
    legendPosition: {
      left: 'center', // left center right
      top: 'bottom' // top middle bottom
    },
    legendOrient: 'horizontal', // 'horizontal'4
    apiEnable: false,
    remote: {
      url: '',
      resolveFn: ''
    }
  },
  data: {
    xAxis: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'],
    series: [
      {
        name: '勇神一号',
        data: [94, 88, 99, 75, 86, 59]
      },
      {
        name: '勇神二号',
        data: [71, 35, 41, 53, 67, 71]
      },
      {
        name: '勇神三号',
        data: [11, 25, 31, 43, 67, 71]
      }
    ]
  }
};

interface LineProps {
  type: string;
  [propName: string]: any;
}

const Line: React.FC<LineProps> = (props) => {
  return <ReactEChartsCore echarts={echarts} option={props || lineDefaultOption} notMerge={true} lazyUpdate={true} theme={'dark_theme'} />;
};

export default Line;
