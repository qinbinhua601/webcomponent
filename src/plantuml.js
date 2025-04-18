import plantumlEncoder from 'plantuml-encoder';

class PlantUMLDiagram extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._render();
  }

  async _render() {
    const content = decodeURI(this.getAttribute('content')) || '';
    if (!content.endsWith('@enduml\n')) {
      this.shadowRoot.innerHTML = `<pre><code>${content}</code></pre>`;
      return
    }
    const svg = await this._callPlantUMLServer(content);
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