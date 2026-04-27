import {GameConfig} from '../GameConfig';

export class ScoreService {
    constructor() {
        this._score = 0;
        this._bestScore = parseInt(
            localStorage.getItem(GameConfig.SCORE_STORAGE_KEY) ?? '0',
            10,
        );
    }

    get score() {
        return this._score;
    }

    get bestScore() {
        return this._bestScore;
    }

    reset() {
        this._score = 0;
    }

    increment() {
        this._score++;
        if (this._score > this._bestScore) {
            this._bestScore = this._score;
            localStorage.setItem(GameConfig.SCORE_STORAGE_KEY, String(this._bestScore));
        }
    }
}
