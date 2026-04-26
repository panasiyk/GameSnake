import {Position, Vector2} from '../types';

export interface ISnake {
    readonly body: ReadonlyArray<Position>;
    readonly head: Position;
    readonly direction: Vector2;
    reset(): void;
    setDirection(dir: Vector2): void;
    applyDirection(): void;
    moveHead(newHead: Position): void;
    teleportHead(to: Position): void;
    grow(): void;
    collidesWithOwnBody(): boolean;
}

const INITIAL_BODY: Position[] = [
    {x: 5, y: 10},
    {x: 4, y: 10},
    {x: 3, y: 10},
];

const INITIAL_DIRECTION: Vector2 = {x: 1, y: 0};

export class Snake implements ISnake {
    private _body: Position[];
    private _direction: Vector2;
    private _nextDirection: Vector2;
    private _pendingGrowth = false;

    constructor() {
        this._body = [...INITIAL_BODY];
        this._direction = {...INITIAL_DIRECTION};
        this._nextDirection = {...INITIAL_DIRECTION};
    }

    get body(): ReadonlyArray<Position> {
        return this._body;
    }

    get head(): Position {
        return this._body[0];
    }

    get direction(): Vector2 {
        return this._direction;
    }

    reset(): void {
        this._body = [...INITIAL_BODY];
        this._direction = {...INITIAL_DIRECTION};
        this._nextDirection = {...INITIAL_DIRECTION};
        this._pendingGrowth = false;
    }

    setDirection(dir: Vector2): void {
        const isReverse = dir.x === -this._direction.x && dir.y === -this._direction.y;
        if (!isReverse) this._nextDirection = dir;
    }

    applyDirection(): void {
        this._direction = this._nextDirection;
    }

    moveHead(newHead: Position): void {
        this._body.unshift(newHead);
        if (this._pendingGrowth) {
            this._pendingGrowth = false;
        } else {
            this._body.pop();
        }
    }

    teleportHead(to: Position): void {
        this._body[0] = {...to};
    }

    grow(): void {
        this._pendingGrowth = true;
    }

    collidesWithOwnBody(): boolean {
        const {head} = this;
        return this._body.slice(1).some(p => p.x === head.x && p.y === head.y);
    }
}
