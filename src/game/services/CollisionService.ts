import {Position} from '../types';
import {GameConfig} from '../GameConfig';

export interface ICollisionService {
    isOutOfBounds(pos: Position): boolean;
    hitsCustomWall(pos: Position, walls: ReadonlyArray<Position>): boolean;
}

export class CollisionService implements ICollisionService {
    isOutOfBounds(pos: Position): boolean {
        return (
            pos.x < 0 ||
            pos.x >= GameConfig.GRID_SIZE ||
            pos.y < 0 ||
            pos.y >= GameConfig.GRID_SIZE
        );
    }

    hitsCustomWall(pos: Position, walls: ReadonlyArray<Position>): boolean {
        return walls.some(w => w.x === pos.x && w.y === pos.y);
    }
}
