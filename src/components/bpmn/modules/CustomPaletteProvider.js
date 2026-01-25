export default function CustomPaletteProvider(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, translate, commandStack) {
    this._create = create;
    this._elementFactory = elementFactory;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._globalConnect = globalConnect;
    this._translate = translate;
    this._commandStack = commandStack;
  
    palette.registerProvider(this);
  }
  
  CustomPaletteProvider.$inject = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect',
    'translate',
    'commandStack'
  ];
  
  CustomPaletteProvider.prototype.getPaletteEntries = function(element) {
    const { _commandStack } = this;
  
    return {
      'action.undo': {
        group: 'zz_footer',
        className: 'fas fa-undo custom-palette-icon', 
        title: 'Desfazer',
        action: {
          click: function() {
            _commandStack.undo();
          }
        }
      },
      'action.redo': {
        group: 'zz_footer',
        className: 'fas fa-redo custom-palette-icon',
        title: 'Refazer',
        action: {
          click: function() {
            _commandStack.redo();
          }
        }
      }
    };
  };
