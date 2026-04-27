const KEY_DIRECTION_MAP = {
    ArrowUp: {x: 0, y: -1},
    ArrowDown: {x: 0, y: 1},
    ArrowLeft: {x: -1, y: 0},
    ArrowRight: {x: 1, y: 0},
};

export class InputService {
    constructor() {
        this._directionHandler = null;
        this._boundKeydown = (e) => this._onKeydown(e);
        window.addEventListener('keydown', this._boundKeydown);
    }

    onDirectionChange(handler) {
        this._directionHandler = handler;
    }

    _onKeydown(e) {
        const dir = KEY_DIRECTION_MAP[e.key];
        if (dir) this._directionHandler?.(dir);
    }

    destroy() {
        window.removeEventListener('keydown', this._boundKeydown);
    }
}
