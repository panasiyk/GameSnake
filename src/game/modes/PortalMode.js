import {GameModeName} from '../constants';
import {GameConfig} from '../GameConfig';

export class PortalMode {
    constructor() {
        this.name = GameModeName.PORTAL;
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
        return 2;
    }

    onFoodEaten(foodIndex, context) {
        const otherIndex = foodIndex === 0 ? 1 : 0;
        const destination = context.foods[otherIndex];
        if (destination) context.teleportSnakeHead(destination);
    }
}
