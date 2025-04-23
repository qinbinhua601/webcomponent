class MinderChart extends HTMLElement {
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
    this.km = new kityminder.Minder({
      renderTo: this.container
    })
    window.km = this.km;
    this._render();
  }

  async _render() {
    const content = decodeURI(this.getAttribute('content')) || '';
    const isEnd = this.getAttribute('is-end') === 'true';
    if (!isEnd) {
      this.container.innerHTML = `<pre><code>${content}</code></pre>`;
      return
    }
    await this.km.importData('markdown', content);
    this.timer = setTimeout(() => {
      const renderContainer = this.km.getRenderContainer();
      const height = renderContainer.getHeight();
      if (height > 0) {
        this.container.style.height = `${height + 120}px`;
      }
      // km.execute('Camera', 'fit');
      this.km.execCommand('Camera');
    }, 400);
  }

  async _callPlantUMLServer(code) {
    const encoded = plantumlEncoder.encode(code); // 使用 plantuml-encoder（网页1）[1](@ref)
    const url = `https://www.plantuml.com/plantuml/svg/${encoded}`;
    const res = await fetch(url);
    return await res.text();
  }
}
customElements.define('minder-chart', MinderChart);