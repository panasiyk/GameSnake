const INITIAL_BODY = [
    {x: 5, y: 10},
    {x: 4, y: 10},
    {x: 3, y: 10},
];

const INITIAL_DIRECTION = {x: 1, y: 0};

export class Snake {
    constructor() {
        this._body = [...INITIAL_BODY];
        this._direction = {...INITIAL_DIRECTION};
        this._nextDirection = {...INITIAL_DIRECTION};
        this._pendingGrowth = false;
    }

    get body() {
        return this._body;
    }

    get head() {
        return this._body[0];
    }

    get direction() {
        return this._direction;
    }

    reset() {
        this._body = [...INITIAL_BODY];
        this._direction = {...INITIAL_DIRECTION};
        this._nextDirection = {...INITIAL_DIRECTION};
        this._pendingGrowth = false;
    }

    setDirection(dir) {
        const isReverse = dir.x === -this._direction.x && dir.y === -this._direction.y;
        if (!isReverse) this._nextDirection = dir;
    }

    applyDirection() {
        this._direction = this._nextDirection;
    }

    moveHead(newHead) {
        this._body.unshift(newHead);
        if (this._pendingGrowth) {
            this._pendingGrowth = false;
        } else {
            this._body.pop();
        }
    }

    teleportHead(to) {
        this._body[0] = {...to};
    }

    grow() {
        this._pendingGrowth = true;
    }

    collidesWithOwnBody() {
        const {head} = this;
        return this._body.slice(1).some(p => p.x === head.x && p.y === head.y);
    }
}
