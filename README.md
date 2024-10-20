# Chat Assistant

## 项目概述
这是一个交互式 AI 对话系统，用户可以输入问题并从 AI 获得回答。

## 功能
- 用户输入问题并发送
- 显示 AI 的回复
- 选择不同的对话助手
- 支持新增、编辑和删除助手
- 支持助手的描述、默认提示词和单轮最大消息数的配置
- 用户注册和登录功能，支持邮箱和 Google 登录


## 安装步骤
1. 克隆项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run serve` 启动项目

## 使用方法
在输入框中输入问题并按回车或点击发送按钮，等待 AI 的回复。选择不同的对话助手以获取不同的回答。

## UI 设计
本项目使用了 [Element Plus](https://element-plus.org/zh-CN/guide/design.html) 作为 UI 框架，确保界面美观且易于使用。整体采用深色模式样式，背景色为深色，文本颜色为白色。

## 注意事项
- 确保在 `.env.local` 文件中配置 DeepSeek 的 API 密钥。
- 确保在 `.env.local` 文件中配置 Firebase 的 API 密钥和相关信息。
