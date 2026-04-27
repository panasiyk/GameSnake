import {GameModeName} from '../types';
import {GameConfig} from '../GameConfig';

export class ClassicMode {
    constructor() {
        this.name = GameModeName.CLASSIC;
    }

    getInitialTickRate() {
        return GameConfig.INITIAL_TICK_RATE;
    }

    calculateNextHead(head, direction) {
        return {x: head.x + direction.x, y: head.y + direction.y};
    }

    isBoundaryLethal() {
        return true;
    }

    isBodyCollisionLethal() {
        return true;
    }

    getFoodCount() {
        return 1;
    }

    onFoodEaten(_foodIndex, _context) {
    }
}
