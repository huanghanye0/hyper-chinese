# hyper-chinese

`hyper-chinese` 是一个面向 Hyper `3.4.1` 稳定版的简体中文插件，目标是在 Hyper 插件能力边界内，尽可能把 Hyper 自身 UI 中文化。

## 范围

- 中文化 Hyper 可由插件控制的界面文案
  - 应用菜单
  - 标签栏与头部区域
  - 搜索相关界面
  - 通知及部分外壳 UI 文案
- 不处理以下内容
  - shell 或命令行程序输出
  - Hyper 安装器、更新器和系统级原生窗口
  - 繁体、多语言切换、用户自定义词典

## 兼容性

- 首要目标：Hyper `3.4.1`
- 配置入口：`.hyper.js`
- 插件格式：CommonJS

## 安装

发布到 npm 后：

```bash
hyper install hyper-chinese
```

然后在 `.hyper.js` 中确认插件已在 `plugins` 数组中：

```javascript
module.exports = {
  config: {},
  plugins: ['hyper-chinese'],
  localPlugins: []
};
```

修改后刷新 Hyper，或使用热重载快捷键。

## 本地开发

将本仓库放到 Hyper 本地插件目录后，在 `.hyper.js` 中通过 `localPlugins` 加载：

```javascript
module.exports = {
  config: {},
  plugins: [],
  localPlugins: ['hyper-chinese']
};
```

常见本地插件目录：

- Windows: `%APPDATA%\\Hyper\\.hyper_plugins\\local`
- macOS: `~/Library/Application Support/Hyper/.hyper_plugins/local`
- Linux: `~/.config/Hyper/.hyper_plugins/local`

## 实现说明

- 使用 `decorateMenu` 递归翻译菜单标签，保留原有 `role`、快捷键和点击行为。
- 使用 `decorateHeader`、`decorateTabs`、`decorateTab`、`decorateNotification`、`decorateNotifications`、`decorateHyper`、`decorateTerms` 包装可达 UI。
- 使用一个受控的 renderer DOM 本地化器补足 hook 触达不到的少量外壳文案。
- 明确跳过 `xterm.js` 终端画布及相关辅助节点，避免误翻译终端内容。

## 验证

运行纯逻辑校验：

```bash
npm run verify
```

建议手工验证：

- 插件可被 Hyper `3.4.1` 识别并成功加载
- 顶层菜单和常见子菜单已中文化
- 搜索界面、通知、标签栏可见文案已中文化
- 卸载插件后 UI 恢复英文
