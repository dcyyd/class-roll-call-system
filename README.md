<h1><center>🎓 班级点名系统</center></h1>
<div>
    <center>
        <a href="https://github.com/dcyyd/class-roll-call-system/blob/main/LICENSE">
            <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License">
        </a>
        <a href="https://github.com/dcyyd/class-roll-call-system">
            <img src="https://img.shields.io/github/stars/dcyyd/class-roll-call-system?style=social" alt="GitHub Repo stars">
        </a>
    </center>
</div>

> 一个轻量高效的随机点名工具，支持名单导入、动态展示和状态管理，助力教师提升课堂效率。

## 🌟 功能特性

- **一键导入** - 支持 **`.txt`** 格式名单文件快速解析
- **随机滚动** - 动态特效展示点名过程
- **状态持久化** - 自动标记已点名学生
- **多端适配** - 响应式设计兼容PC/移动设备
- **开源免费** - MIT协议可自由二次开发

## 🚀 快速开始

### 环境准备

- 现代浏览器（推荐 Chrome 90+/Edge 90+/Firefox 88+）
- 文本编辑器（用于准备学生名单）

### 基础用法

#### 1. 导入名单

1. 点击 **`📤 导入名单`** 按钮
2. 选择按行分隔的 **`.txt`** 文件（示例文件：[doc/name.txt](doc/name.txt)）
3. 成功提示后即可开始操作

#### 2. 随机点名

| 操作							| 效果说明						|
|------------------------------	|-----------------------------	|
| 单击 **`🎲 开始点名`**		| 启动随机滚动动画				|
| 再次单击 **`⏹ 停止`**			| 锁定当前选中学生				|
| 点击 **`🔄 重置`**				| 清空所有点名记录				|

#### 3. 界面示意

![](images/ui-showcase.png)

## 🛠️ 项目结构

```bash
class-roll-call-system/
├── doc/
│   └── name.txt          # 示例名单（每行一个姓名）
├── js/
│   └── script.js         # 核心逻辑（文件解析/随机算法）
├── images                # 存放站点中用到的各种图像文件
├── font                  # 存放站点字体文件
├── css/
│   └── styles.css        # UI样式
├── index.html            # 主界面
└── LICENSE               # MIT协议文件
```

## 📥 源码获取

### 方式一：Git克隆（推荐）

```bash
git clone https://github.com/dcyyd/class-roll-call-system.git
cd class-roll-call-system
```

### 方式二：直接下载

1. 访问 [**Releases页面**](https://github.com/dcyyd/class-roll-call-system/releases)
2. 下载最新版 **`Source code.zip`**
3. 解压后双击 **`index.html`** 即可运行

## 📜 开源协议

本项目采用 **[MIT License](https://github.com/dcyyd/class-roll-call-system/blob/main/LICENSE)**，您可：

- ✅ 自由使用/修改代码
- ✅ 用于商业项目
- ✅ 保留版权声明即可

## 📮 联系开发者

| 联系方式					| 详情																	|
|------------------------	|------------------------------											|
| 📧 电子邮箱				| [dcyyd_kcug@yeah.net](mailto:dcyyd_kcug@yeah.net)						|
| 📱 联系电话				| [17633963626](tell:17633963626)										|
| 💻 GitHub Issues		| [提交问题报告](https://github.com/dcyyd/class-roll-call-system/issues)	|
