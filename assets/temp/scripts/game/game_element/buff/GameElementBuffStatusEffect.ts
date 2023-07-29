import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameElement from "../GameElement";
import GameElementBuffStatus from "./GameElementBuffStatus";


const APP = `GameElementBuffStatusEff`;

const ANIM_NAME = `prefab_buff_anim_in`;

/**
 * 状态 - 正在起作用
 */
class GameElementBuffStatusEffect extends GameElementBuffStatus {
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementBuffStatusEffect>({
        instantiate: () => {
            return new GameElementBuffStatusEffect();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(GameElementBuffStatusEffect._t, apply);
        return val;
    }

    OnEnter(): void {
        // 在 buff 管理器注册自我
        this._relBuff._mgrBuff._map.set(this._relBuff._cfg.id, this._relBuff);
    }

    OnStep(ms: number): void {
        // 对于每层，有时间限制
        if (0 < this._relBuff._cfg.layer_keep_ms) {
            // 冷却起来
            this._relBuff.ms -= ms;
            // 没有剩余时间
            if (this._relBuff.ms < 0) {
                this._relBuff.ms = 0;
            };
            if (this._relBuff.ms == 0) {
                // buff 自动消亡
                this._relBuff.EnterStatus(this._relBuff._statusUnload);
            };
        };
    }

    OnExit(): void {
        // 移除 buff 管理器上的注册
        this._relBuff._mgrBuff._map.delete(this._relBuff._cfg.id);
    }

    ActGetAnimName(): string {
        return ANIM_NAME;
    }
}

export default GameElementBuffStatusEffect;