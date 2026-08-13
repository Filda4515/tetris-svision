/**/

/*/

/**/
// begin code

export class TetrisInputController {
  constructor(model) {
    this.model = model;
    this.app = model.app;
    this.activeTouches = {};
  } // constructor

  touchStart(event, side) {
    const ts = this.app.controlsOptions.touchscreen.types[this.app.controls.touchscreen.type][side];
    if (ts.type === 'button') {
      if (ts.action === 'hardDrop') {
        this.model.hardDropActivePiece();
      }
    }

    this.app.inputEventsManager.touchesGameControls[event.identifier] = {
      center: { x: event.x, y: event.y },
      type: ts.type,
      control: ts.control,
      action: ts.action,
      actions: ts.actions,
      hasRotated: false,
    };
  } // touchStart

  touchEnd(event) {
    if (event.identifier in this.app.inputEventsManager.touchesGameControls) {
      delete this.app.inputEventsManager.touchesGameControls[event.identifier];
    }
  } // touchEnd

  touchMove(event) {
    if (this.model.isFastDropping || !this.model.activePiece) return;

    if (event.identifier in this.app.inputEventsManager.touchesGameControls) {
      const touchGameControl = this.app.inputEventsManager.touchesGameControls[event.identifier];

      if (touchGameControl.type === 'joystick') {
        const dx = event.x - touchGameControl.center.x;
        const dy = event.y - touchGameControl.center.y;

        let action = false;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx < -15) {
            action = touchGameControl.actions[3]; // 'left'
            touchGameControl.center.x = event.x;
            touchGameControl.center.y = event.y;
          } else if (dx > 15) {
            action = touchGameControl.actions[1]; // 'right'
            touchGameControl.center.x = event.x;
            touchGameControl.center.y = event.y;
          }
        } else {
          if (dy < -15) {
            action = touchGameControl.actions[0]; // 'rotate'
            touchGameControl.center.y = event.y;
            touchGameControl.center.x = event.x;
          } else if (dy > 15) {
            touchGameControl.center.y = event.y;
            touchGameControl.center.x = event.x;
          }
        }

        if (action) {
          if (action === 'left') {
            this.model.moveLeft();
          } else if (action === 'right') {
            this.model.moveRight();
          } else if (action === 'rotate') {
            if (!touchGameControl.hasRotated) {
              this.model.rotateActivePiece();
              touchGameControl.hasRotated = true;
            }
          }
        }
      }
    }
  } // touchMove

  handleEvent(event) {
    switch (event.id) {
      case 'keyPress':
        if (!this.model.activePiece) return false;

        if (event.key === 'Touch') {
          const side = event.x < this.model.desktopWidth / 2 ? 'left' : 'right';
          this.activeTouches[event.identifier] = side;
          this.app.inputEventsManager.touchesMap[event.identifier] = this.model.desktopEntity;
          this.touchStart(event, side);
          return true;
        }

        let key = event.key;
        if (key.length === 1) {
          key = key.toUpperCase();
        }

        switch (key) {
          case this.app.controls.keyboard.left:
          case 'A':
          case 'GamepadLeft':
            this.model.moveLeft();
            return true;
          case this.app.controls.keyboard.right:
          case 'D':
          case 'GamepadRight':
            this.model.moveRight();
            return true;
          case this.app.controls.keyboard.down:
          case ' ':
          case 'Spacebar':
          case 'GamepadDown':
            this.model.hardDropActivePiece();
            return true;
          case this.app.controls.keyboard.rotate:
          case 'W':
          case 'GamepadOK':
            this.model.rotateActivePiece();
            return true;
        }
        break;

      case 'keyMove':
        if (event.key === 'Touch') {
          this.touchMove(event);
          return true;
        }
        break;

      case 'keyRelease':
        if (event.key === 'Touch') {
          this.touchEnd(event);
          delete this.activeTouches[event.identifier];
          return true;
        }
        break;
    }

    return false;
  } // handleEvent
} // TetrisInputController

export default TetrisInputController;
