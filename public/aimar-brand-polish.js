const replacements = [
  ['AIMAR OS', 'Aimar OS'],
  ['AIMAR Ops', 'Aimar Ops'],
  ['AIMAR started', 'Aimar started'],
  ['AIMAR applies', 'Aimar applies'],
  ['AIMAR treats', 'Aimar treats'],
  ['AIMAR systems', 'Aimar systems'],
  ['AIMAR remains', 'Aimar remains'],
  ['AIMAR is being', 'Aimar is being'],
  ['AIMAR builds', 'Aimar builds'],
  ['AIMAR', 'Aimar']
];

function polishTextNode(node) {
  let value = node.nodeValue;
  for (const [from, to] of replacements) {
    value = value.replaceAll(from, to);
  }
  node.nodeValue = value;
}

function polishBrandText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.includes('AIMAR')) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(polishTextNode);
}

function bootBrandPolish() {
  document.body.classList.add('aimar-brand-polish-ready');
  polishBrandText();

  const observer = new MutationObserver(() => polishBrandText());
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootBrandPolish, { once: true });
} else {
  bootBrandPolish();
}
