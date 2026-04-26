import {Vector2} from '../types';

export interface IInputService {
    onDirectionChange(handler: (dir: Vector2) => void): void;
    destroy(): void;
}

const KEY_DIRECTION_MAP: Readonly<Record<string, Vector2>> = {
    ArrowUp: {x: 0, y: -1},
    ArrowDown: {x: 0, y: 1},
    ArrowLeft: {x: -1, y: 0},
    ArrowRight: {x: 1, y: 0},
};

export class InputService implements IInputService {
    private _directionHandler: ((dir: Vector2) => void) | null = null;
    private readonly _boundKeydown: (e: KeyboardEvent) => void;

    constructor() {
        this._boundKeydown = (e: KeyboardEvent) => this._onKeydown(e);
        window.addEventListener('keydown', this._boundKeydown);
    }

    onDirectionChange(handler: (dir: Vector2) => void): void {
        this._directionHandler = handler;
    }

    private _onKeydown(e: KeyboardEvent): void {
        const dir = KEY_DIRECTION_MAP[e.key];
        if (dir) this._directionHandler?.(dir);
    }

    destroy(): void {
        window.removeEventListener('keydown', this._boundKeydown);
    }
}
