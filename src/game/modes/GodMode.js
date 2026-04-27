import {GameModeName} from '../constants';
import {GameConfig} from '../GameConfig';

export class GodMode {
    constructor() {
        this.name = GameModeName.GOD_MODE;
    }

    getInitialTickRate() {
        return GameConfig.INITIAL_TICK_RATE;
    }

    calculateNextHead(head, direction) {
        const wrap = (v) =>
            ((v % GameConfig.GRID_SIZE) + GameConfig.GRID_SIZE) % GameConfig.GRID_SIZE;
        return {x: wrap(head.x + direction.x), y: wrap(head.y + direction.y)};
    }

    isBoundaryLethal() {
        return false;
    }

    isBodyCollisionLethal() {
        return false;
    }

    getFoodCount() {
        return 1;
    }

    onFoodEaten(_foodIndex, _context) {
    }
}
