import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameElement from "../GameElement";
import GameElementBuffStatus from "./GameElementBuffStatus";


const APP = `GameElementBuffStatusUnload`;

const ANIM_NAME = `prefab_buff_anim_out`;

/**
 * 状态 - 正在卸载
 */
class GameElementBuffStatusUnload extends GameElementBuffStatus {
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementBuffStatusUnload>({
        instantiate: () => {
            return new GameElementBuffStatusUnload();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(GameElementBuffStatusUnload._t, apply);
        return val;
    }

    private _wait = 1000;

    /**
     * 时间步进
     * @param ms 
     */
    OnStep(ms: number): void {
        this._wait -= ms;
        if (this._wait <= 0) {
            this._relBuff.EnterStatus(this._relBuff._statusDestory);
        };
    }

    ActGetAnimName(): string {
        return ANIM_NAME;
    }
}

export default GameElementBuffStatusUnload;