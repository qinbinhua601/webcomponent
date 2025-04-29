// import mermaid from 'mermaid';

// const { default: mermaid } = require("mermaid");

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
    return ['code', 'theme', 'is-end'];
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
    const isEnd = this.getAttribute('is-end') === 'true';
    // console.log('qin', 'isEnd', code, isEnd);
    window.mermaidMap = window.mermaidMap || {};
    if (!isEnd) {
      this.shadowRoot.innerHTML = `<pre><code>${code}</code></pre>`;
      // this.container.innerHTML = 'loading...';
      return;
    }
    // 初始化 Mermaid
    await mermaid.initialize({ theme, suppressErrorRendering: true });
    // console.log(mermaid)
    try {
      // console.log('qin', 'render mermaid', code, );
      if (window.mermaidMap[code]) {
        this.container.innerHTML = window.mermaidMap[code];
        return;
      }
      
      const {svg} = await mermaid.render('mermaid-chart', code);
      // console.log(res)
      // cache svg by key
      this.container.innerHTML = svg;
      window.mermaidMap[code] = svg;
    } catch (e) {
      console.log(e)
      this.container.innerHTML = `<div style="color: red;">Error: ${e.message}</div>`;
    }
  }
}

// 注册自定义元素
customElements.define('mermaid-chart', MermaidChart);