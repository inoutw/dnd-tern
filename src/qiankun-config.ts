const _package = require('../package.json');

export const inQianKun = () => (window as any).__POWERED_BY_QIANKUN__;
// if inQianKun then activeRule; else 部署目录
// export const getBaseUrl = () => (inQianKun() ? _package.activeRule : _package.homepage);

export const getBaseUrl = () => (inQianKun() ? `/main/${_package.microName}` : `/apps/${_package.microName}/`);
