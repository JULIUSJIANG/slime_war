import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GEEI_2005 from "./GEEI_2005";
import GEEI_2005_status from "./GEEI_2005_status";


const APP = `GEEI_2005_status_cd`;

/**
 * 冷却
 */
export default class GEEI_2005_status_cd extends GEEI_2005_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2005_status_cd>({
        instantiate: () => {
            return new GEEI_2005_status_cd ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2005) {
        let val = UtilObjPool.Pop (GEEI_2005_status_cd._t, apply);
        val.rel = rel;
        return val;
    }

    msWait: number;

    OnEnter(): void {
        this.msWait = this.rel.args.fCDMS;
        this.MSCheck ();
    }

    OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        this.MSCheck ();
    }

    MSCheck () {
        if (this.msWait == 0) {
            this.rel.EnterStatus (this.rel.statusReady);
        };
    }

    OnAnim() {
        return this.rel.args.fCDMSAnim;
    }

    OnMSKeep(): number {
        return this.rel.args.fCDMS;
    }

    OnCd(): number {
        if (this.rel.args.fCDMS < 1000) {
            return 1;
        };
        return 1 - this.msWait / this.rel.args.fCDMS;
    }    
}