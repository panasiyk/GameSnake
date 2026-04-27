import {GameModeName} from '../types';
import {ClassicMode} from './ClassicMode';
import {GodMode} from './GodMode';
import {WallsMode} from './WallsMode';
import {PortalMode} from './PortalMode';
import {SpeedMode} from './SpeedMode';

export class GameModeFactory {
    static _registry = new Map([
        [GameModeName.CLASSIC, ClassicMode],
        [GameModeName.GOD_MODE, GodMode],
        [GameModeName.WALLS, WallsMode],
        [GameModeName.PORTAL, PortalMode],
        [GameModeName.SPEED, SpeedMode],
    ]);

    static register(name, ctor) {
        this._registry.set(name, ctor);
    }

    static create(name) {
        const Ctor = this._registry.get(name);
        if (!Ctor) throw new Error(`Unknown game mode: ${name}`);
        return new Ctor();
    }

    static getAll() {
        return Array.from(this._registry.keys());
    }
}
