'use strict';

const assert = require('node:assert/strict');

const plugin = require('../index.js');
const { translateText } = require('../lib/dictionary');
const { translateMenu } = require('../lib/menu');

function testTranslateText() {
  assert.equal(translateText('Plugins'), '插件');
  assert.equal(translateText('Windows'), '窗口');
  assert.equal(translateText('&Help'), '帮助');
  assert.equal(translateText(' Case sensitive '), ' 区分大小写 ');
  assert.equal(translateText('Custom Label'), 'Custom Label');
  assert.equal(translateText('Plugin hyper-demo (1.0.0) loaded.'), '插件 hyper-demo（1.0.0）已加载。');
}

function testTranslateMenu() {
  const originalMenu = [
    {
      label: 'Plugins',
      submenu: [
        {
          label: 'Update all now',
          accelerator: 'Ctrl+Shift+U',
          click() {}
        }
      ]
    },
    {
      role: 'window'
    },
    {
      role: 'help'
    },
    {
      submenu: [
        {
          role: 'copy'
        },
        {
          label: 'Move to...'
        },
        {
          label: 'Previous word'
        }
      ]
    }
  ];

  const translatedMenu = translateMenu(originalMenu);

  assert.notStrictEqual(translatedMenu, originalMenu);
  assert.notStrictEqual(translatedMenu[0], originalMenu[0]);
  assert.equal(translatedMenu[0].label, '插件');
  assert.equal(translatedMenu[0].submenu[0].label, '立即更新全部');
  assert.equal(translatedMenu[0].submenu[0].accelerator, 'Ctrl+Shift+U');
  assert.equal(translatedMenu[0].submenu[0].click, originalMenu[0].submenu[0].click);
  assert.equal(translatedMenu[1].label, '窗口');
  assert.equal(translatedMenu[2].label, '帮助');
  assert.equal(translatedMenu[3].submenu[0].label, '复制');
  assert.equal(translatedMenu[3].submenu[1].label, '移动到...');
  assert.equal(translatedMenu[3].submenu[2].label, '上一个单词');
}

function testDecorateConfig() {
  const config = plugin.__internal.decorateConfig({
    uiFontFamily: 'Segoe UI',
    css: '.foo { color: red; }'
  });

  assert.match(config.uiFontFamily, /Microsoft YaHei UI/);
  assert.match(config.uiFontFamily, /Segoe UI/);
  assert.match(config.css, /\.foo \{ color: red; \}/);
  assert.match(config.css, /letter-spacing: normal/);
}

function testExports() {
  assert.equal(typeof plugin.decorateMenu, 'function');
  assert.equal(typeof plugin.decorateConfig, 'function');
  assert.equal(typeof plugin.decorateHeader, 'function');
  assert.equal(typeof plugin.decorateNotifications, 'function');
}

function run() {
  testTranslateText();
  testTranslateMenu();
  testDecorateConfig();
  testExports();
  console.log('verify: ok');
}

run();
