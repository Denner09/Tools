# Implementação de Camadas de Texto

## Estrutura da Camada de Texto

```javascript
{
  id: 'text-xxx',
  type: 'text',
  name: 'Texto',
  visible: true,
  locked: false,
  opacity: 1,
  x: 100,
  y: 100,
  rotation: 0,
  text: 'Digite aqui',
  fontSize: 32,
  fontFamily: 'Arial',
  color: '#000000',
  bold: false,
  italic: false,
  textTransform: 'none', // 'uppercase', 'lowercase', 'capitalize'
  letterSpacing: 0,
  lineHeight: 1.2,
  textShadow: {
    enabled: false,
    offsetX: 2,
    offsetY: 2,
    blur: 4,
    color: '#000000'
  }
}
```

## Funcionalidades Necessárias

1. ✅ Criar camada de texto ao clicar com ferramenta TEXT
2. ✅ Painel lateral de edição (TextPropertiesPanel)
3. ✅ Renderização em tempo real
4. ✅ Movimentação (usar MOVE tool)
5. ✅ Rotação (adicionar handles)
6. ✅ Todas as opções de formatação

## Componentes

- TextLayer (renderiza o texto)
- TextPropertiesPanel (painel de edição lateral)
