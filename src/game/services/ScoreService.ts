import {GameConfig} from '../GameConfig';

export interface IScoreService {
    readonly score: number;
    readonly bestScore: number;
    reset(): void;
    increment(): void;
}

export class ScoreService implements IScoreService {
    private _score = 0;
    private _bestScore: number;

    constructor() {
        this._bestScore = parseInt(
            localStorage.getItem(GameConfig.SCORE_STORAGE_KEY) ?? '0',
            10,
        );
    }

    get score(): number {
        return this._score;
    }

    get bestScore(): number {
        return this._bestScore;
    }

    reset(): void {
        this._score = 0;
    }

    increment(): void {
        this._score++;
        if (this._score > this._bestScore) {
            this._bestScore = this._score;
            localStorage.setItem(GameConfig.SCORE_STORAGE_KEY, String(this._bestScore));
        }
    }
}
