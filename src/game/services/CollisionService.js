import {GameConfig} from '../GameConfig';

export class CollisionService {
    isOutOfBounds(pos) {
        return (
            pos.x < 0 ||
            pos.x >= GameConfig.GRID_SIZE ||
            pos.y < 0 ||
            pos.y >= GameConfig.GRID_SIZE
        );
    }

    hitsCustomWall(pos, walls) {
        return walls.some(w => w.x === pos.x && w.y === pos.y);
    }
}
