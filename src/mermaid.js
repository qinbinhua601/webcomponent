import mermaid from 'mermaid';

class MermaidChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .container { padding: 12px; }
      </style>
      <div class="container"></div>
    `;
    this.container = this.shadowRoot.querySelector('.container');
  }

  // 监听属性变化
  static get observedAttributes() {
    return ['code', 'theme'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render();
    }
  }

  // 渲染逻辑
  async render() {
    const code = decodeURI(this.getAttribute('code')) || '';
    const theme = this.getAttribute('theme') || 'default';
    const shouldRender = this.getAttribute('shouldRender') === 'true';
    const key = this.getAttribute('idx') || '';
    if (!shouldRender) {
      this.container.innerHTML = `<pre><code>${code}</code></pre>`;
      return;
    }
    console.log('qin', 'render mermaid', code);
    // 初始化 Mermaid
    await mermaid.initialize({ theme });
    requestIdleCallback(async () => {
      if (window.__mermaidCache && window.__mermaidCache[key]) {
        console.log('qin', 'render mermaid from cache', key);
        this.container.innerHTML = window.__mermaidCache[key];
        return;
      }
      console.log('qin', 'render mermaid NOT from cache', key);
      const { svg } = await mermaid.render('mermaid-chart', code);
      // cache svg by key
      this.container.innerHTML = svg;
      if (!window.__mermaidCache) {
        window.__mermaidCache = {};
      }
      window.__mermaidCache[key] = svg;
      console.log('qin', 'render mermaid done', code);
    })
  }
}

// 注册自定义元素
customElements.define('mermaid-chart', MermaidChart);