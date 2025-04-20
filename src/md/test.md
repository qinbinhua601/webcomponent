## plantuml示例

```plantuml
@startuml
actor User
participant "主控MCU" as MCU
participant "温湿度传感器" as Sensor

MCU -> Sensor: 发送启动信号(START)
activate Sensor #LightBlue
MCU -> Sensor: 发送设备地址(0x44)
alt 地址匹配成功
    Sensor --> MCU: ACK响应
    MCU -> Sensor: 读取寄存器
    Sensor --> MCU: 数据字节(2 Bytes)
else 地址不匹配
    Sensor --> MCU: NACK响应
    MCU -> MCU: 错误处理
end
deactivate Sensor
@enduml
```

```javascript
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
    const code = this.getAttribute('code') || '';
    const theme = this.getAttribute('theme') || 'default';
    
    // 初始化 Mermaid
    await mermaid.initialize({ theme });
    const { svg } = await mermaid.render('mermaid-chart', code);
    this.container.innerHTML = svg;
  }
}

// 注册自定义元素
customElements.define('mermaid-chart', MermaidChart);
```