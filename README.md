# CSUVis_UI
CUSVis实验室可视化模块UI介绍。
该项目为一个示例项目，讲述如何调用和配置CSUVis实验室的通用可视化模块。

### 在线预览：

http://47.99.51.12:8080/river

### 项目结构

```
|-- public
|		|-- index.html			主页
|-- src									主要文件
|		|-- data/test						项目数据
|				|-- cluster.js				无线电数据
|				|-- cluster.json			无线电原始数据
|				|-- situation.js			无线电态势数据
|				|-- situation.json		窑炉态势数据
|				|-- temperature.js		窑炉温度数据
|				|-- zones.js					窑炉监测数据
|				|-- zones.json				窑炉堆栈数据
|		|-- examplePages				通用可视化组件应用示例
|				|-- AreaExample.js		面积图示例组件
|				|-- RiverExample.js		流图示例组件
|				|-- ScatterExample.js 散点图示例组件
|				|-- StackExample.js		堆栈图示例组件
|				|-- StrapExample.js		频带图示例组件
|		|-- lib									组件资源文件（如果想要复用 CSUVis_UI，则将该文件复制到自己的 react 项目中）
|		|-- App.css							项目样式
|		|-- App.js							项目组件
|		|-- AsyncComponent.js		异步加载组件
|		|-- index.css						基础样式
|		|-- index.js						入口文件
|-- package.json				项目基本信息
|-- yarn.lock						项目基本信息
```



