# Bilibili Player Tools
[![Tampermonkey](https://img.shields.io/badge/Tool-Tampermonkey-blue)](https://www.tampermonkey.net/)
[![Version](https://img.shields.io/badge/Version-1.0-green)]()

## 简介 | Introduction
一套适用于 **Bilibili（哔哩哔哩）** 的油猴(Tampermonkey)脚本集合，基于模拟页面点击实现功能，提升视频观看体验。

A collection of Tampermonkey userscripts for Bilibili. All functions are implemented by simulating mouse clicks on the player.
## 痛点
我在观看一些学习视频的时候，由于其是分p播放，每次切换分集都需要手动点击字幕按钮，非常麻烦。

## 功能列表 | Features
### 1. 自动开启中文字幕 | Auto Chinese Subtitle
- 打开视频后**自动点击字幕按钮**
- 自动选中 AI 中文字幕
- 切换视频、切换分集自动重新生效

### 2. 播放倍速选择器 | Playback Speed Selector
- 右下角悬浮控制面板，可视化切换倍速
- 支持档位：`1.0x` / `1.25x` / `1.5x` / `2.0x`
- 记忆上次选择的倍速，切换分集/视频自动沿用
- 纯模拟页面点击，与手动操作逻辑一致

![alt text](imgs/image.png)

## 文件说明 | File List
```
bilibili-player-tools/
├── auto-chinese-subtitle.user.js   # 自动中文字幕脚本
├── playback-speed-selector.user.js # 倍速选择器脚本
└── README.md                       # 项目说明文档
```

## 使用教程 | Usage
### 前置要求 | Prerequisite
1. 浏览器安装 **Tampermonkey（暴力猴）** 扩展
   - Chrome / Edge / Firefox 均可在官方应用商店搜索安装

### 安装脚本 | Install Scripts
1. 打开 Tampermonkey，点击 **创建新脚本**
2. 将对应脚本的完整代码粘贴到编辑区
3. 按下 `Ctrl + S` 保存，脚本自动启用
4. 打开 Bilibili 视频页面，功能即刻生效

![alt text](imgs/image1.png)

### 倍速脚本使用说明
1. 视频页面右下角会出现 `设置倍速` 悬浮按钮
2. 点击按钮展开菜单，选择需要的播放速度
3. 切换视频/分集时，会自动沿用上一次设置的倍速

## 开源协议 | License
MIT License
