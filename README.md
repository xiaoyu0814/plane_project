# winter

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Android打包说明
### 证书文件
* 证书文件位于项目根目录下：`airPlane.keystore`
* 证书的别名：`airPlane`
* 证书私钥：`UQAR1vFDKXe9tU7W`

### 打包过程
1. 需要先在[DCloud开发者中心](https://dev.dcloud.net.cn/)上注册开发者账号，并创建一个"5+app"类型的应用，保留"App id"。
2. 在编辑器HBuilder X（[下载地址](https://www.dcloud.io/hbuilderx.html)）登录上述自己的账号。
3. 从Git上拉取项目代码[aviation_surveillance_mobile_frontend的newSearch分支](http://47.94.41.92:680/xfjtdsj/aviation_surveillance_mobile_frontend/-/archive/newSearch/aviation_surveillance_mobile_frontend-newSearch.zip)，解压后在HBuilder X中打开项目。
4. 使用`npm install`安装依赖，随后使用`npm run build`编译项目。
5. 在HBuilder X的“文件”菜单->“新建”->“项目”中，选择“5+App”，使用“默认模板”，新建一个项目“airPlane”，并选择存放位置。
6. 将第4步中，编译完成后新出现的`dist`文件夹下的`static`文件夹以及`index.html`文件复制至上述第5步中的`airPlane`文件夹下。
7. 在HBuilder X中打开airPlane项目*（在第5步后应该已经打开了）*，选择菜单栏中的“发行”->“原生App-云打包”。
   1. 首先“修改manifest设置”
      - 在“基础配置”部分，勾选“应用是否全屏显示”，勾选全部“横竖屏设置”。
      - 在“图标配置”部分，单击“浏览...”，选择`Android_icon.png`，并点击“自动生成所有图标并替换”
      - *（可选）*在“App常用其它设置”部分，勾选所有“支持CPU类型”
   2. 保存`manifest.json`文件的修改，并关闭。回到“App云端打包界面”，进行打包设置。
      - 填入“Android包名”*（需与登录HBuilder X的账号在DCloud后台申请的一致，默认的话，编辑器应该已经填上了）*
      - 选择“使用自有证书”，填入证书信息
      - 选择“打正式包”
      - 取消包括“原生混淆”，“广告联盟”，“换量联盟”等推广选项组下的所有的多选框
   3. 点击“打包”，提交云打包任务，并查看控制台输出，等待apk下载链接的出现
