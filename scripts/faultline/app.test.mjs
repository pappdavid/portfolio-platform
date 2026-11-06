import test from 'node:test';
import assert from 'node:assert/strict';

// A small DOM harness for the standalone module. Browser QA additionally checks
// actual focus behavior and the accessibility tree.
async function setup() {
  const elements = new Map();
  const document = {
    activeElement: null,
    createElement: (tag) => new Element(tag),
    querySelector(selector) {
      if (selector === '[data-fault][aria-pressed="true"]')
        return faults.find(
          (item) => item.attributes['aria-pressed'] === 'true'
        );
      if (selector === '#trace .empty-state')
        return (
          elements
            .get('#trace')
            .children.find((item) => item.className === 'empty-state') || null
        );
      if (selector === '#trace .empty-state .mini-flow')
        return (
          elements
            .get('#trace')
            .children.find((item) => item.className === 'empty-state')
            ?.children.find((item) => item.className === 'mini-flow') || null
        );
      if (
        selector === '#trace .empty-state h2' ||
        selector === '#trace .empty-state p'
      ) {
        const tag = selector.endsWith('h2') ? 'H2' : 'P';
        return (
          elements
            .get('#trace')
            .children.find((item) => item.className === 'empty-state')
            ?.children.find((item) => item.tagName === tag) || null
        );
      }
      return elements.get(selector) || null;
    },
    querySelectorAll(selector) {
      return selector === '[data-fault]' ? faults : [];
    }
  };
  class Element {
    constructor(tag = 'div') {
      this.tagName = tag.toUpperCase();
      this.children = [];
      this.attributes = {};
      this.dataset = {};
      this.listeners = {};
      this._text = '';
      this.className = '';
      this.hidden = false;
      this._disabled = false;
      this.value = '';
      this.checked = false;
      this.classList = { toggle: () => {}, add: () => {} };
    }
    set textContent(value) {
      this._text = String(value);
      this.children = [];
    }
    get textContent() {
      return this._text + this.children.map((c) => c.textContent).join('');
    }
    set disabled(value) {
      this._disabled = value;
      if (value && document.activeElement === this)
        document.activeElement = null;
    }
    get disabled() {
      return this._disabled;
    }
    setAttribute(name, value) {
      this.attributes[name] = value;
    }
    cloneNode(deep) {
      const e = new Element(this.tagName);
      e.className = this.className;
      e._text = this._text;
      if (deep) e.children = this.children.map((c) => c.cloneNode(true));
      return e;
    }
    replaceChildren(...nodes) {
      this._text = '';
      this.children = nodes;
    }
    append(...nodes) {
      this.children.push(...nodes);
    }
    addEventListener(name, fn) {
      this.listeners[name] = fn;
    }
    focus() {
      if (!this.disabled && !this.hidden) document.activeElement = this;
    }
    click() {
      if (this.disabled || this.hidden) return;
      this.focus();
      this.listeners.click?.();
    }
  }
  const ids = [
    'trace',
    'stable-key',
    'retries',
    'scenario-note',
    'adapter-label',
    'visit-count',
    'state-callout',
    'visits',
    'completion',
    'uniqueness',
    'primary',
    'guidance',
    'export',
    'retry-more',
    'probe',
    'probe-result',
    'announcement',
    'reset'
  ];
  for (const id of ids) elements.set(`#${id}`, new Element());
  elements.get('#stable-key').checked = true;
  elements.get('#retries').value = '1';
  const empty = new Element('li');
  empty.className = 'empty-state';
  const heading = new Element('h2');
  heading.textContent = 'Meet the uncertainty window.';
  const description = new Element('p');
  description.textContent = 'Send one request and lose its response.';
  const flow = new Element('div');
  flow.className = 'mini-flow';
  flow.textContent = 'Request → Commit × Response';
  empty.append(heading, description, flow);
  elements.get('#trace').children = [empty];
  const faults = ['after', 'before', 'none'].map((name) => {
    const e = new Element('button');
    e.dataset.fault = name;
    e.setAttribute('aria-pressed', String(name === 'after'));
    return e;
  });
  globalThis.document = document;
  await import(`../../public/faultline/app.mjs?test=${Math.random()}`);
  return { document, elements, faults };
}

test('no-fault guidance accurately describes the control before and after send', async () => {
  const { elements, faults } = await setup();
  faults[2].click();
  assert.doesNotMatch(elements.get('#trace').textContent, /lose its response/i);
  assert.doesNotMatch(elements.get('#guidance').textContent, /uncertainty/i);
  elements.get('#primary').click();
  assert.doesNotMatch(elements.get('#guidance').textContent, /timeout/i);
  assert.match(elements.get('#guidance').textContent, /confirm|arriv/i);
});

test('fixed replay and conflict keep focus usable and announce the conflict', async () => {
  const { document, elements } = await setup();
  const primary = elements.get('#primary');
  primary.click();
  primary.click();
  primary.click();
  assert.equal(document.activeElement, elements.get('#retry-more'));
  elements.get('#probe').click();
  assert.equal(document.activeElement, elements.get('#retry-more'));
  assert.match(
    elements.get('#announcement').textContent,
    /409.*original visit preserved/i
  );
});

test('empty-state diagram matches each fault position', async () => {
  const { document, faults } = await setup();
  const flow = () =>
    document.querySelector('#trace .empty-state .mini-flow').textContent;
  assert.match(flow(), /Request.*→.*Commit.*×.*Response/);
  faults[1].click();
  assert.match(flow(), /Request.*×.*Receiver/);
  faults[2].click();
  assert.match(flow(), /Request.*→.*Commit.*→.*Response/);
});
