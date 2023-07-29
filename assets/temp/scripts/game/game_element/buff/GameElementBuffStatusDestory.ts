import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameElement from "../GameElement";
import GameElementBuffStatus from "./GameElementBuffStatus";

const APP = `GameElementBuffStatusDestory`;

const ANIM_NAME = `prefab_buff_anim_out`;

/**
 * 状态 - 已销毁
 */
class GameElementBuffStatusDestory extends GameElementBuffStatus {
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementBuffStatusDestory>({
        instantiate: () => {
            return new GameElementBuffStatusDestory();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(GameElementBuffStatusDestory._t, apply);
        return val;
    }

    OnEnter(): void {
        this._relBuff.evterUnload.Call();
    }

    ActGetAnimName(): string {
        return ANIM_NAME;
    }
}

export default GameElementBuffStatusDestory;