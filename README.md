# 六爻占卜 · 微信小程序

> 基于传统《周易》六爻起卦法的微信小程序，离线运行，完整支持 64 卦的多种解卦流派解读。

[![微信小程序](https://img.shields.io/badge/平台-微信小程序-07C160)](https://developers.weixin.qq.com/miniprogram/dev/)
[![JavaScript](https://img.shields.io/badge/语言-JavaScript%20ES5-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/许可证-MIT-blue)](LICENSE)

---

## 功能特性

| 功能 | 描述 |
|------|------|
| 🪙 **起卦仪式** | 仿古仪式化流程，默念所求后开始，支持点击龟壳或摇一摇起卦 |
| 🐢 **龟壳动画** | 透明背景 GIF 龟壳 + CSS 立体投影效果，增强沉浸感 |
| 📜 **六次摇卦** | 三硬币法，每次点击/摇动生成一爻，从初爻至上爻依次排列 |
| 📖 **卦象展示** | 本卦/变卦 + 六爻（老阴/少阳/少阴/老阳）可视化，变爻高亮 |
| 📚 **八种解卦** | 白话文、爻辞详解、卦辞原文、邵雍解、傅佩荣解、张铭仁解、断易天机、**传统解卦**（含运势/事业/经商/求名/婚恋/决策子栏目） |
| 📋 **历史记录** | 保存起卦结果至本地缓存，支持查看历史详情 |
| 🔄 **重新起卦** | 完成后一键重新开始 |
| 📴 **离线运行** | 所有数据和算法内置，无需网络连接 |

## 快速开始

### 前提条件

- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)（最新稳定版）
- 微信小程序 AppID（可使用测试号）

### 克隆与运行

```bash
# 克隆仓库
git clone https://github.com/joshua76y/liuyao-miniprogram.git

# 用微信开发者工具打开项目目录
# 1. 启动微信开发者工具
# 2. 点击"导入项目"
# 3. 选择项目目录，填入 AppID（或用测试号）
# 4. 点击"导入"
```

### 项目结构

```
liuyao-miniprogram/
├── app.js                     # 应用入口，含历史记录存取
├── app.json                   # 全局配置（页面注册、窗口样式）
├── app.wxss                   # 全局样式（古朴风格变量）
├── project.config.json        # 项目配置
├── sitemap.json               # 站点地图
├── pages/
│   ├── index/                 # 首页（起卦界面）
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   ├── result/                # 解卦结果页
│   │   ├── result.js          # 卦象分析 + 多流派解卦逻辑
│   │   ├── result.json
│   │   ├── result.wxml
│   │   └── result.wxss
│   └── history/               # 历史记录页
│       ├── history.js
│       ├── history.json
│       ├── history.wxml
│       └── history.wxss
├── data/
│   ├── guaData.js             # 64 卦完整数据（卦辞、爻辞、彖辞、小象）
│   ├── wenwangGuaTable.js     # 文王六十四卦序对应表
│   └── guaInterpretation.js   # 多流派解卦数据（白话/邵雍/傅佩荣/张铭仁/断易天机/传统）
├── utils/
│   └── util.js                # 工具函数
└── images/
    └── guixiao.gif            # 龟壳动画（22帧透明背景）
```

## 核心算法

### 起卦逻辑

采用经典 **三硬币法**，模拟六次抛掷：

| 组合 | 符号 | 编码 | 阴阳 | 变爻 |
|------|------|------|------|------|
| 三正（3 背） | ●●● | 0 | 老阴 | → 少阳 |
| 二正（2 背） | ●○ | 1 | 少阳 | 不变 |
| 一正（1 背） | ● | 2 | 少阴 | 不变 |
| 零正（0 背） |  | 3 | 老阳 | → 少阴 |

- 从初爻（第 1 次）至上爻（第 6 次）依次构建本卦
- 变爻即"动爻"，标记后生成变卦
- 变卦由本卦按变爻规则转换后获得

### 解卦数据

卦象数据整合自以下来源：
- **卦辞/爻辞**：[freizl/yijing](https://github.com/freizl/yijing)（MIT 许可证）
- **多流派解卦**：[易路搜搜](https://yilusoso.com/) 公开数据爬取
- **传统解卦**：包含大象、运势、事业、经商、求名、婚恋、决策等维度

## 技术细节

### 编码规范

- 原生微信小程序开发，JavaScript ES5（`var`/`function`），兼容所有微信版本
- WXML 条件渲染使用 `==`/`!=`（微信 WXML 编译器不支持 `===`/`!==`）
- 数据预计算原则：中文 Key 访问在 JS 中通过 Bracket Notation 完成，WXML 只接收 ASCII Key

### 设计风格

```
底色:   #1A0F0A (深棕黑)
主色:   #D4A847 (古铜金)
辅色:   #8B2500 (朱砂红)
字体:   宋体
氛围:   古朴神秘风

龟壳:   CSS filter: drop-shadow 三层投影 + 椭圆地影
按钮:   古朴按钮样式，竖排布局
结果页:  Tab 式多流派切换
```

## 依赖

无外部依赖。纯原生微信小程序，所有数据、算法、样式均为内置。

## 开发说明

### 数据爬取

爬虫脚本位于项目根目录（`liuyao-miniprogram/` 外），使用 Python 实现：

```
fetch_gua_data.py             # 爬取卦象数据
fetch_gua_interpretations.py  # 爬取多流派解卦数据（yilusoso.com，含链式导航）
fill_gua.py                   # 补充缺失卦象
merge_explanations.py         # 合并多源解释数据
```

如需重新爬取，请确保遵守目标网站的 `robots.txt` 及使用条款。

## 许可证

[MIT](LICENSE)

---

*本项目仅供学习与传统文化交流，不构成任何形式的结果预测或决策建议。*
