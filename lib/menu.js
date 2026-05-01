'use strict';

const { translateText } = require('./dictionary');

const ROLE_LABELS = new Map(
  Object.entries({
    about: '关于 Hyper',
    help: '帮助',
    services: '服务',
    hide: '隐藏',
    hideothers: '隐藏其他',
    unhide: '全部显示',
    quit: '退出',
    close: '关闭',
    minimize: '最小化',
    zoom: '缩放',
    front: '全部置前',
    window: '窗口',
    togglefullscreen: '切换全屏',
    undo: '撤销',
    redo: '重做',
    cut: '剪切',
    copy: '复制',
    paste: '粘贴',
    pasteandmatchstyle: '粘贴并匹配样式',
    delete: '删除',
    selectall: '全选',
    reload: '重新加载',
    forceReload: '完全重新加载',
    toggleDevTools: '开发者工具'
  })
);

function translateMenuItem(item) {
  if (Array.isArray(item)) {
    return item.map(translateMenuItem);
  }

  if (!item || typeof item !== 'object') {
    return item;
  }

  const translatedItem = Object.assign({}, item);

  if (typeof item.label === 'string') {
    translatedItem.label = translateText(item.label);
  } else if (typeof item.role === 'string' && ROLE_LABELS.has(item.role)) {
    translatedItem.label = ROLE_LABELS.get(item.role);
  }

  if (typeof item.sublabel === 'string') {
    translatedItem.sublabel = translateText(item.sublabel);
  }

  if (Array.isArray(item.submenu)) {
    translatedItem.submenu = item.submenu.map(translateMenuItem);
  }

  return translatedItem;
}

function translateMenu(menu) {
  return Array.isArray(menu) ? menu.map(translateMenuItem) : menu;
}

module.exports = {
  translateMenu,
  translateMenuItem
};
