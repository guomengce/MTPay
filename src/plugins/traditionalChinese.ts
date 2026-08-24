import OpenCC from 'opencc-js';

const toHongKongTraditional = OpenCC.Converter({ from: 'cn', to: 'hk' });
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE']);

function convertText(value: string) {
  return /\p{Script=Han}/u.test(value) ? toHongKongTraditional(value) : value;
}

function convertNode(node: Node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentElement;
    if (!parent || SKIPPED_TAGS.has(parent.tagName)) return;
    const current = node.nodeValue || '';
    const converted = convertText(current);
    if (converted !== current) node.nodeValue = converted;
    return;
  }

  if (!(node instanceof Element)) return;
  if (SKIPPED_TAGS.has(node.tagName)) return;
  for (const attribute of TRANSLATABLE_ATTRIBUTES) {
    const current = node.getAttribute(attribute);
    if (!current) continue;
    const converted = convertText(current);
    if (converted !== current) node.setAttribute(attribute, converted);
  }
  for (const child of node.childNodes) convertNode(child);
}

/** 只转换最终呈现的 DOM，不修改接口值、表单 model 或业务判断。 */
export function installTraditionalChinese() {
  const root = document.documentElement;
  convertNode(root);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') convertNode(mutation.target);
      else if (mutation.type === 'attributes') convertNode(mutation.target);
      else for (const node of mutation.addedNodes) convertNode(node);
    }
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
  });
}
