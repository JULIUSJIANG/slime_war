import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GEEI_2005 from "./GEEI_2005";
import GEEI_2005_status from "./GEEI_2005_status";


const APP = `GEEI_2005_status_keep`;

/**
 * 蓄力
 */
export default class GEEI_2005_status_keep extends GEEI_2005_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2005_status_keep>({
        instantiate: () => {
            return new GEEI_2005_status_keep ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2005) {
        let val = UtilObjPool.Pop (GEEI_2005_status_keep._t, apply);
        val.rel = rel;
        return val;
    }

    msWait: number;

    OnEnter(): void {
        this.msWait = this.rel.args.bKeepMS;
        this.MSCheck ();
    }

    OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        this.MSCheck ();
    }

    OnFireEnd(): void {
        this.rel.EnterStatus (this.rel.statusReady);
    }

    MSCheck () {
        if (this.msWait == 0) {
            this.rel.EnterStatus (this.rel.statusAtkAStart);
        };
    }

    OnAnim() {
        return this.rel.args.bKeepAnim;
    }

    OnMSKeep(): number {
        return this.rel.args.bKeepMS;
    }
}