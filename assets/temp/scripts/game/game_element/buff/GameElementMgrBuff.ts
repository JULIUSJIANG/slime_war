import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameElementBody from "../body/GameElementBody";
import GameElementBuff from "./GameElementBuff";

const APP = `GameElementMgrBuff`;

/**
 * buff 管理器
 */
class GameElementMgrBuff {

    /**
     * 归属的怪物
     */
    eleMonster: GameElementBody;

    private constructor () {
        
    }

    private static _t = new UtilObjPoolType<GameElementMgrBuff>({
        instantiate: () => {
            return new GameElementMgrBuff();
        },
        onPop:  (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, eleMonster: GameElementBody) {
        let val = UtilObjPool.Pop(GameElementMgrBuff._t, apply);
        val.eleMonster = eleMonster;
        return val;
    }

    /**
     * 当前的 buff 记录
     */
    _map: Map<number, GameElementBuff> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 添加 buff
     * @param idCfg 
     */
    AddBuff (idCfg: number) {
        if (this._isBuffCleared) {
            return;
        };
        // 还没有记录的话，构造记录
        if (!this._map.has(idCfg)) {
            GameElementBuff.Pop(APP, idCfg, this);
        }
        // 否则层数提升即可
        else {
            let val = this._map.get(idCfg);
            val.InCreaseLayer();
        };
    }

    /**
     * 是否清除过 buff
     */
    _isBuffCleared: boolean;

    /**
     * 清除上面的 buff
     */
    Clear () {
        // 从此拒绝所有新 buff
        this._isBuffCleared = true;

        // buff 列表的克隆体
        let listBuff = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
        this._map.forEach((val, idx) => {
            listBuff.push(val);
        });
        // 销毁全部的 buff
        for (let i = 0; i < listBuff.length; i++) {
            let buf = listBuff[i];
            buf.EnterStatus(buf._statusUnload);
        };
    }
}

export default GameElementMgrBuff;