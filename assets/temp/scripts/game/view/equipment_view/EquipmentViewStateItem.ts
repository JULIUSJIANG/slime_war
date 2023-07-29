import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";

const APP = `EquipmentViewStateItem`;

/**
 * 装备界面的物品
 */
export default class EquipmentViewStateItem {
    /**
     * 用于解析的策略
     */
    rs: GameCfgBodyCacheDropRS<any>;
    /**
     * 配表 id
     */
    idCfg: number;

    private constructor () {

    }

    private static _t = new UtilObjPoolType<EquipmentViewStateItem>({
        instantiate: () => {
            return new EquipmentViewStateItem ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rs: GameCfgBodyCacheDropRS<any>, idCfg: number) {
        let val = UtilObjPool.Pop (EquipmentViewStateItem._t, apply);
        val.rs = rs;
        val.idCfg = idCfg;
        return val;
    }
}