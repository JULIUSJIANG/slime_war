import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import AnimKeep from "../../common/AnimKeep";
import GEEI_2007 from "./GEEI_2007";
import GEEI_2007_status from "./GEEI_2007_status";


const APP = `GEEI_2007_status_ready`;

/**
 * 就绪
 */
export default class GEEI_2007_status_ready extends GEEI_2007_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2007_status_ready>({
        instantiate: () => {
            return new GEEI_2007_status_ready ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2007) {
        let val = UtilObjPool.Pop (GEEI_2007_status_ready._t, apply);
        val.rel = rel;
        return val;
    }

    animKeep = AnimKeep.Pop (APP, 600, 600);

    OnEnter(): void {
        this.animKeep.currStatus.OnFadeIn();
    }

    OnExit(): void {
        this.animKeep.currStatus.OnFadeOut();
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