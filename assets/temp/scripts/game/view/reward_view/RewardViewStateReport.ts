import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import RewardViewStateReportEquipment from "./RewardViewStateReportEquipment";

const APP = `RewardViewStateReport`;

/**
 * 奖励报告
 */
export default class RewardViewStateReport {

    private constructor () {};

    private static _t = new UtilObjPoolType <RewardViewStateReport>({
        instantiate: () => {
            return new RewardViewStateReport ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (RewardViewStateReport._t, apply);
        return val;
    }

    /**
     * 装备信息集合
     */
    listEquipmentInfo: Array<RewardViewStateReportEquipment> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
}