import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import UIRoot from "../../../../frame/ui/UIRoot";
import gameCommon from "../../../GameCommon";
import AnimKeep from "../../common/AnimKeep";
import GEEI_2005 from "./GEEI_2005";
import GEEI_2005_status from "./GEEI_2005_status";


const APP = `GEEI_2005_status_ready`;

/**
 * 就绪
 */
export default class GEEI_2005_status_ready extends GEEI_2005_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2005_status_ready>({
        instantiate: () => {
            return new GEEI_2005_status_ready ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2005) {
        let val = UtilObjPool.Pop (GEEI_2005_status_ready._t, apply);
        val.rel = rel;
        return val;
    }

    OnFiring(): void {
        // 能量足够，才能进入蓄力状态
        if (this.rel.OnAble()) {
            this.rel.EnterStatus (this.rel.statusKeep);
        };
    }

    OnAnim() {
        return this.rel.args.aReadyAnim;
    }

    OnMSKeep(): number {
        return gameCommon.STANDARD_ANIM_MS;
    }
}