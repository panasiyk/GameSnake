import {GameModeName} from '../constants';
import {GameConfig} from '../GameConfig';

export class SpeedMode {
    constructor() {
        this.name = GameModeName.SPEED;
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

    onFoodEaten(_foodIndex, context) {
        const faster = Math.max(GameConfig.MIN_TICK_RATE, context.currentTickRate * 0.9);
        context.setTickRate(faster);
    }
}
