'use strict';

const EXACT_TRANSLATIONS = new Map(
  Object.entries({
    Hyper: 'Hyper',
    'About Hyper': '关于 Hyper',
    File: '文件',
    Shell: '终端',
    Edit: '编辑',
    View: '视图',
    Tools: '工具',
    Plugins: '插件',
    Window: '窗口',
    Windows: '窗口',
    Help: '帮助',
    Services: '服务',
    Hide: '隐藏',
    'Hide Others': '隐藏其他',
    'Show All': '全部显示',
    Quit: '退出',
    'Quit Hyper': '退出 Hyper',
    'New Window': '新建窗口',
    'New Tab': '新建标签页',
    'New Session': '新建会话',
    'Split Down': '向下分屏',
    'Split Right': '向右分屏',
    Close: '关闭',
    'Close Window': '关闭窗口',
    'Close Tab': '关闭标签页',
    'Close Pane': '关闭分屏',
    'Close Split': '关闭分屏',
    Minimize: '最小化',
    Zoom: '缩放',
    'Zoom In': '放大',
    'Zoom Out': '缩小',
    'Reset Zoom': '重置缩放',
    'Toggle Full Screen': '切换全屏',
    Reload: '重新加载',
    'Full Reload': '完全重新加载',
    'Reload Plugins': '重新加载插件',
    Undo: '撤销',
    Redo: '重做',
    Cut: '剪切',
    Copy: '复制',
    Paste: '粘贴',
    Delete: '删除',
    'Delete...': '删除...',
    'Delete…': '删除…',
    'Select All': '全选',
    Find: '查找',
    Search: '搜索',
    'Search Hyper': '搜索 Hyper',
    'Move to...': '移动到...',
    'Move to…': '移动到…',
    'No results': '无结果',
    'Case sensitive': '区分大小写',
    'Case Sensitive': '区分大小写',
    'Whole word': '全词匹配',
    'Whole Word': '全词匹配',
    Regex: '正则表达式',
    'Use Regular Expression': '使用正则表达式',
    'Match Case': '区分大小写',
    'Match Whole Word': '全词匹配',
    'Preferences...': '偏好设置...',
    'Preferences…': '偏好设置…',
    Preferences: '偏好设置',
    'Settings...': '设置...',
    'Settings…': '设置…',
    Settings: '设置',
    'Open Config': '打开配置',
    'Open Config File': '打开配置文件',
    'Open Config Directory': '打开配置目录',
    'Open Plugin Directory': '打开插件目录',
    'Update all now': '立即更新全部',
    'Check for Updates': '检查更新',
    Documentation: '文档',
    'Hyper Website': 'Hyper 官网',
    'Report Issue': '报告问题',
    'Report Bug': '报告缺陷',
    'Developer Tools': '开发者工具',
    'Toggle Developer Tools': '切换开发者工具',
    'Open DevTools': '打开开发者工具',
    'Actual Size': '实际大小',
    'Reset Zoom Level': '重置缩放级别',
    Front: '前置',
    'Spelling and Grammar': '拼写与语法',
    'Show Spelling and Grammar': '显示拼写与语法',
    'Hide Spelling and Grammar': '隐藏拼写与语法',
    'Check Document Now': '立即检查文稿',
    'Check Spelling While Typing': '输入时检查拼写',
    'Learn Spelling': '学习拼写',
    Speech: '语音',
    'Start Speaking': '开始朗读',
    'Stop Speaking': '停止朗读',
    'Show Menu Bar': '显示菜单栏',
    'Bring All to Front': '全部置前',
    'Always on Top': '始终置顶',
    'Toggle Always on Top': '切换始终置顶',
    'Install Hyper CLI command in PATH': '将 Hyper CLI 命令安装到 PATH',
    'Add Hyper to system context menu': '将 Hyper 添加到系统右键菜单',
    'Remove Hyper from system context menu': '从系统右键菜单移除 Hyper',
    'Update plugins': '更新插件',
    'Update Plugins': '更新插件',
    'Select Profile': '选择配置',
    'Select Tab': '选择标签页',
    'Select Pane': '选择分屏',
    Previous: '上一个',
    Next: '下一个',
    Last: '最后一个',
    'Previous word': '上一个单词',
    'Next word': '下一个单词',
    'Line beginning': '行首',
    'Line end': '行尾',
    Default: '默认',
    SearchBox: '搜索框',
    Notifications: '通知',
    'Plugin error': '插件错误',
    'Plugin errors': '插件错误',
    Success: '成功',
    Error: '错误',
    Warning: '警告',
    Info: '信息',
    'Find Next': '查找下一个',
    'Find Previous': '查找上一个',
    'Close Search': '关闭搜索',
    'Copied to clipboard': '已复制到剪贴板',
    'Nothing to copy': '没有可复制的内容',
    'No matches': '无匹配项'
  })
);

const REGEX_TRANSLATIONS = [
  {
    pattern: /^Plugin (.+) \((.+)\) loaded\.$/,
    replace: (_match, name, version) => `插件 ${name}（${version}）已加载。`
  },
  {
    pattern: /^Plugin (.+) loaded\.$/,
    replace: (_match, name) => `插件 ${name} 已加载。`
  },
  {
    pattern: /^Plugin (.+) updated\.$/,
    replace: (_match, name) => `插件 ${name} 已更新。`
  },
  {
    pattern: /^Installed (.+)\.$/,
    replace: (_match, name) => `已安装 ${name}。`
  },
  {
    pattern: /^Uninstalled (.+)\.$/,
    replace: (_match, name) => `已卸载 ${name}。`
  },
  {
    pattern: /^Loading plugin (.+)\.\.\.$/,
    replace: (_match, name) => `正在加载插件 ${name}...`
  }
];

function translateCoreText(coreText) {
  if (!coreText) {
    return coreText;
  }

  const direct = EXACT_TRANSLATIONS.get(coreText);
  if (direct) {
    return direct;
  }

  const normalized = coreText.replace(/\u2026/g, '...');
  const normalizedDirect = EXACT_TRANSLATIONS.get(normalized);
  if (normalizedDirect) {
    return coreText.includes('\u2026')
      ? normalizedDirect.replace(/\.\.\./g, '\u2026')
      : normalizedDirect;
  }

  const acceleratorNormalized = normalized.replace(/&/g, '');
  const acceleratorDirect = EXACT_TRANSLATIONS.get(acceleratorNormalized);
  if (acceleratorDirect) {
    return coreText.includes('\u2026')
      ? acceleratorDirect.replace(/\.\.\./g, '\u2026')
      : acceleratorDirect;
  }

  for (const rule of REGEX_TRANSLATIONS) {
    const match =
      coreText.match(rule.pattern) ||
      normalized.match(rule.pattern) ||
      acceleratorNormalized.match(rule.pattern);
    if (match) {
      return rule.replace(...match);
    }
  }

  return coreText;
}

function translateText(text) {
  if (typeof text !== 'string' || text.length === 0) {
    return text;
  }

  const leadingWhitespace = text.match(/^\s*/)[0];
  const trailingWhitespace = text.match(/\s*$/)[0];
  const start = leadingWhitespace.length;
  const end = text.length - trailingWhitespace.length;
  const core = text.slice(start, end);

  if (!core) {
    return text;
  }

  return `${leadingWhitespace}${translateCoreText(core)}${trailingWhitespace}`;
}

module.exports = {
  EXACT_TRANSLATIONS,
  REGEX_TRANSLATIONS,
  translateText
};
