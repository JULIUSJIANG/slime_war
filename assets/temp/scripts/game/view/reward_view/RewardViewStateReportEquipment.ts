import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";

const APP = `RewardViewStateReportEquipment`;

/**
 * 奖励报告中的装备信息
 */
export default class RewardViewStateReportEquipment {

    private constructor () {};

    private static _t = new UtilObjPoolType <RewardViewStateReportEquipment>({
        instantiate: () => {
            return new RewardViewStateReportEquipment ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (RewardViewStateReportEquipment._t, apply);
        return val;
    }

    /**
     * 配表 id
     */
    idCfg: number;
    /**
     * 等级 - 前
     */
    lvBefore: number;
    /**
     * 等级 - 后
     */
    lvAfter: number;
}