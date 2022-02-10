## 基于 create-react-app 改造的微前端模板

### 内置`antd` `react-router-dom` `axios` 急速开发

只需要配置 `package.json` 中的 `homepage` 、`activeRule` 即可插入到主应用

开发子应用流程
* step0. 拉取模板 git clone git@github.com:SilenceTiger/micro-app-template.git
* step1. 修改名字 micro-app-template => cnpc（子应用名称）
* step2. npm i
* step3. npm i micro-app-lib (如果需要、是否内置？)
* step4（弃用）. 修改 package.json 的 name（子应用名称）、homepage(资源路径)、activeRule(与main对应)  homepage 需与 activeRule 不同，分离部署 homepage不关键，还有buildPath
* step4. 为了减少改动只需配置 package.json中的 microName 即可，会生成homepage = `/apps/${microName}/` ,activeRule = `/main/${microName}`, buildPath = `${microName}`, microName与注册应用中的`keyword`对应
* step5. npm run start 开发模式
* step6. npm run build 打包
* step7. 注册子应用，平台部署：打包上传 cnpc.zip 与相关信息 注册路由，独立部署无需上传
* step8. 平台部署：后端将 cnpc.zip 解压到 nginx/html/apps 下, 修改 nginx.conf 中的location（使用正则，无需修改和重启）
* step9. 注册路由菜单

### drag and drop issue
拖动元素在页面中，mouse up in container没起作用，
pointer-event：none，鼠标会穿透到下层元素，引起mouse-hover效果
pageY和clientY相等？