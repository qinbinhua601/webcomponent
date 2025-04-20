## mermaid示例

```mermaid
  graph TD;
    A-->B;
    B-->C;
    C-->D;
    D-->A;
```

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

## javascript示例

```javascript
const md = markdownIt({
  highlight: function (str, lang) {
    return `<code-block language="${lang}">${str}</code-block>`;
    // 如果指定了语言
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    // 未指定语言时自动检测
    return '<pre class="hljs"><code>' +
           hljs.highlightAuto(str).value +
           '</code></pre>';
  },
  html: true,          // 允许HTML标签[2](@ref)
  linkify: true,       // 自动转换URL为链接[4](@ref)
  typographer: true    // 支持印刷字符替换[3](@ref)
});
```

