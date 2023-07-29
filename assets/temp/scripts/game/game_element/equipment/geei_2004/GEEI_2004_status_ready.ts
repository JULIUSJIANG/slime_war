import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import GEEI_2004 from "./GEEI_2004";
import GEEI_2004_status from "./GEEI_2004_status";


const APP = `GEEI_2004_status_ready`;

/**
 * 就绪
 */
export default class GEEI_2004_status_ready extends GEEI_2004_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2004_status_ready>({
        instantiate: () => {
            return new GEEI_2004_status_ready ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2004) {
        let val = UtilObjPool.Pop (GEEI_2004_status_ready._t, apply);
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

    OnMSKeep() {
        return gameCommon.STANDARD_ANIM_MS;
    }
}