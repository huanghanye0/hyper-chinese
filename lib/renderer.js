'use strict';

const { translateText } = require('./dictionary');

const LOCALIZER_KEY = '__hyperChineseLocalizer';
const TRANSLATABLE_ATTRIBUTES = ['title', 'aria-label', 'placeholder'];
const TRANSLATABLE_PROP_NAMES = new Set([
  'title',
  'label',
  'text',
  'message',
  'placeholder',
  'ariaLabel',
  'aria-label',
  'description',
  'children',
  'customChildren',
  'customChildrenBefore'
]);
const BLOCKED_ROOT_SELECTORS = [
  'canvas',
  '.xterm',
  '.xterm-helpers',
  '.xterm-accessibility',
  '.xterm-screen',
  '.xterm-viewport',
  '.xterm-decoration-container',
  '.xterm-decoration-overview-ruler'
].join(', ');
const SELF_TEXT_BLOCKED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'SCRIPT', 'STYLE']);

function isElementNode(node) {
  return Boolean(node) && node.nodeType === 1;
}

function isTextNode(node) {
  return Boolean(node) && node.nodeType === 3;
}

function isBlockedElement(element) {
  return isElementNode(element) && Boolean(element.closest(BLOCKED_ROOT_SELECTORS));
}

function translateDomAttributes(element) {
  if (!isElementNode(element) || isBlockedElement(element)) {
    return;
  }

  for (const attributeName of TRANSLATABLE_ATTRIBUTES) {
    const value = element.getAttribute(attributeName);
    if (!value) {
      continue;
    }

    const translated = translateText(value);
    if (translated !== value) {
      element.setAttribute(attributeName, translated);
    }
  }
}

function translateDomTextNode(textNode) {
  if (!isTextNode(textNode)) {
    return;
  }

  const parentElement = textNode.parentElement;
  if (!parentElement || isBlockedElement(parentElement)) {
    return;
  }

  const translated = translateText(textNode.nodeValue);
  if (translated !== textNode.nodeValue) {
    textNode.nodeValue = translated;
  }
}

function translateDomSubtree(root, targetWindow) {
  if (!root || !targetWindow || !targetWindow.document) {
    return;
  }

  const startNode = root.nodeType === 9 ? root.body : root;
  if (!startNode) {
    return;
  }

  const stack = [startNode];
  while (stack.length > 0) {
    const node = stack.pop();

    if (isTextNode(node)) {
      translateDomTextNode(node);
      continue;
    }

    if (!isElementNode(node)) {
      continue;
    }

    if (isBlockedElement(node)) {
      continue;
    }

    translateDomAttributes(node);

    if (SELF_TEXT_BLOCKED_TAGS.has(node.tagName)) {
      continue;
    }

    const childNodes = node.childNodes;
    for (let index = childNodes.length - 1; index >= 0; index -= 1) {
      stack.push(childNodes[index]);
    }
  }
}

function getLocalizerState(targetWindow) {
  if (!targetWindow[LOCALIZER_KEY]) {
    targetWindow[LOCALIZER_KEY] = {
      observer: null,
      scheduled: false,
      pendingRoots: new Set()
    };
  }

  return targetWindow[LOCALIZER_KEY];
}

function scheduleTranslation(targetWindow, root) {
  const state = getLocalizerState(targetWindow);
  const translationRoot =
    root && root.nodeType === 3 ? root.parentElement : root || targetWindow.document.body;

  if (!translationRoot) {
    return;
  }

  state.pendingRoots.add(translationRoot);
  if (state.scheduled) {
    return;
  }

  state.scheduled = true;
  const flush = () => {
    state.scheduled = false;
    const roots = Array.from(state.pendingRoots);
    state.pendingRoots.clear();

    for (const currentRoot of roots) {
      translateDomSubtree(currentRoot, targetWindow);
    }
  };

  if (typeof targetWindow.requestAnimationFrame === 'function') {
    targetWindow.requestAnimationFrame(flush);
  } else {
    targetWindow.setTimeout(flush, 0);
  }
}

function ensureDomLocalization(targetWindow = window) {
  if (!targetWindow || !targetWindow.document || !targetWindow.document.body) {
    return;
  }

  const state = getLocalizerState(targetWindow);
  if (state.observer) {
    scheduleTranslation(targetWindow, targetWindow.document.body);
    return;
  }

  state.observer = new targetWindow.MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        scheduleTranslation(targetWindow, mutation.target);
        continue;
      }

      scheduleTranslation(targetWindow, mutation.target);
      for (const addedNode of mutation.addedNodes) {
        scheduleTranslation(targetWindow, addedNode);
      }
    }
  });

  state.observer.observe(targetWindow.document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: TRANSLATABLE_ATTRIBUTES
  });

  scheduleTranslation(targetWindow, targetWindow.document.body);
}

function translateReactNode(value, React) {
  if (typeof value === 'string') {
    return translateText(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateReactNode(item, React));
  }

  if (!React.isValidElement(value)) {
    return value;
  }

  const translatedProps = translateVisibleProps(value.props, React);
  return React.cloneElement(value, translatedProps);
}

function translateVisibleProps(props, React) {
  if (!props) {
    return props;
  }

  let changed = false;
  const nextProps = {};

  for (const [key, value] of Object.entries(props)) {
    let nextValue = value;

    if (TRANSLATABLE_PROP_NAMES.has(key)) {
      nextValue = translateReactNode(value, React);
    } else if (typeof value === 'string' && TRANSLATABLE_PROP_NAMES.has(key)) {
      nextValue = translateText(value);
    }

    if (nextValue !== value) {
      changed = true;
    }

    nextProps[key] = nextValue;
  }

  return changed ? nextProps : props;
}

function createLocalizedDecorator(Component, React, name) {
  class HyperChineseDecorator extends React.Component {
    componentDidMount() {
      ensureDomLocalization();
    }

    componentDidUpdate() {
      ensureDomLocalization();
    }

    render() {
      const translatedProps = translateVisibleProps(this.props, React);
      return React.createElement(Component, translatedProps);
    }
  }

  HyperChineseDecorator.displayName = `HyperChinese${name || 'Decorator'}`;
  return HyperChineseDecorator;
}

module.exports = {
  createLocalizedDecorator,
  ensureDomLocalization,
  translateDomSubtree
};
