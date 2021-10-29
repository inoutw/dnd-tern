import Line from './Line';

// 需要lazy吗？
// 打包单独发布？
// preview 单独发布？ 这样不需要一个iframe嵌入 而是以组件方式 <Preview config={json} /> <iframe src='' />
const modules = {
  line: Line
};

export default modules;
