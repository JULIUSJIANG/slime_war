import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GEEI_2007 from "./GEEI_2007";
import GEEI_2007_status from "./GEEI_2007_status";


const APP = `GEEI_2007_status_a_start`;

/**
 * 前摇
 */
export default class GEEI_2007_status_a_start extends GEEI_2007_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2007_status_a_start>({
        instantiate: () => {
            return new GEEI_2007_status_a_start ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2007) {
        let val = UtilObjPool.Pop (GEEI_2007_status_a_start._t, apply);
        val.rel = rel;
        return val;
    }

    msWait: number;
    
    OnEnter(): void {
        this.msWait = this.rel.args.cAtkStartMS;
        this.MSCheck ();
    }

    OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        this.MSCheck ();
    }

    MSCheck () {
        if (this.msWait == 0) {
            this.rel.EnterStatus (this.rel.statusAtkBIng);
        };
    }

    OnAnim() {
        return this.rel.args.cAtkStartAnim;
    }

    OnMSKeep(): number {
        return this.rel.args.cAtkStartMS;
    }
}