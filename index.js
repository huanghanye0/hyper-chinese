'use strict';

const { translateText } = require('./lib/dictionary');
const { translateMenu } = require('./lib/menu');
const { createLocalizedDecorator, ensureDomLocalization } = require('./lib/renderer');

function decorateConfig(config = {}) {
  const chineseUiFallback =
    '"Microsoft YaHei UI", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC"';
  const uiFontFamily = config.uiFontFamily
    ? `${chineseUiFallback}, ${config.uiFontFamily}`
    : chineseUiFallback;

  return Object.assign({}, config, {
    uiFontFamily,
    css: `
      ${config.css || ''}

      .tabs_nav .tab_text,
      .tabs_nav .tabs_title,
      .header_header,
      .notification_message {
        letter-spacing: normal;
      }
    `
  });
}

function decorateMenu(menu) {
  return translateMenu(menu);
}

function onRendererWindow(rendererWindow) {
  if (!rendererWindow || typeof rendererWindow.addEventListener !== 'function') {
    return;
  }

  if (rendererWindow.document && rendererWindow.document.body) {
    ensureDomLocalization(rendererWindow);
    return;
  }

  rendererWindow.addEventListener(
    'DOMContentLoaded',
    () => {
      ensureDomLocalization(rendererWindow);
    },
    { once: true }
  );
}

function makeDecorator(name) {
  return (Component, { React }) => createLocalizedDecorator(Component, React, name);
}

const decorateHyper = makeDecorator('Hyper');
const decorateHeader = makeDecorator('Header');
const decorateTabs = makeDecorator('Tabs');
const decorateTab = makeDecorator('Tab');
const decorateTerms = makeDecorator('Terms');
const decorateNotifications = makeDecorator('Notifications');
const decorateNotification = makeDecorator('Notification');

module.exports = {
  decorateConfig,
  decorateMenu,
  onRendererWindow,
  decorateHyper,
  decorateHyperTerm: decorateHyper,
  decorateHeader,
  decorateTabs,
  decorateTab,
  decorateTerms,
  decorateNotifications,
  decorateNotification,
  __internal: {
    translateMenu,
    translateText,
    decorateConfig
  }
};
