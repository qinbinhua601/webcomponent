import plantumlEncoder from 'plantuml-encoder';

class PlantUMLDiagram extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._render();
  }

  async _render() {
    const content = decodeURI(this.getAttribute('content')) || '';
    const isEnd = this.getAttribute('is-end') === 'true';
    if (!isEnd) {
      this.shadowRoot.innerHTML = `<pre><code>${content}</code></pre>`;
      return
    }
    window.plantumlMap = window.plantumlMap || {};
    let svg = window.plantumlMap[content] || await this._callPlantUMLServer(content);
    window.plantumlMap[content] = svg
    this.shadowRoot.innerHTML = `
      <style>/* 样式隔离 */</style>
      <div class="container">${svg}</div>
    `;
  }

  async _callPlantUMLServer(code) {
    const encoded = plantumlEncoder.encode(code); // 使用 plantuml-encoder（网页1）[1](@ref)
    const url = `https://www.plantuml.com/plantuml/svg/${encoded}`;
    const res = await fetch(url);
    return await res.text();
  }
}
customElements.define('plantuml-chart', PlantUMLDiagram);