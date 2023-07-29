import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";

const APP = `EquipmentViewBackpackPropArgs`;

/**
 * 背包界面 - 物品 - 参数
 */
export default class EquipmentViewBackpackPropArgs {
    private constructor () {}

    private static _t = new UtilObjPoolType<EquipmentViewBackpackPropArgs> ({
        instantiate: () => {
            return new EquipmentViewBackpackPropArgs ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, grey: boolean) {
        let val = UtilObjPool.Pop (EquipmentViewBackpackPropArgs._t, apply);
        val.grey = grey;
        return val;
    }

    /**
     * 置为灰色
     */
    public grey: boolean;
}