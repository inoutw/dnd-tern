import './public-path';
import ReactDOM from 'react-dom';
import App from './App';
import { inQianKun } from 'qiankun-config';
import reportWebVitals from './reportWebVitals';
import './index.scss';

// ReactDOM.render(<App />, document.getElementById('root'));
/** 微应用配置 begin */
function render(props: any) {
  const { container } = props;
  ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
}

if (!inQianKun()) {
  render({});
}

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props: any) {
  render(props);
}

export async function unmount(props: any) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}

/** 微应用配置 end */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
