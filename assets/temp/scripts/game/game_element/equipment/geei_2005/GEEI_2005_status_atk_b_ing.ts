import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GEEI_2005 from "./GEEI_2005";
import GEEI_2005_status from "./GEEI_2005_status";


const APP = `GEEI_2005_status_b_ing`;

/**
 * 开火中
 */
export default class GEEI_2005_status_b_ing extends GEEI_2005_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2005_status_b_ing>({
        instantiate: () => {
            return new GEEI_2005_status_b_ing ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2005) {
        let val = UtilObjPool.Pop (GEEI_2005_status_b_ing._t, apply);
        val.rel = rel;
        return val;
    }

    atkTime: number;

    msWait: number;
    
    OnEnter(): void {
        this.rel.UpdateAim ();
        this.atkTime = this.rel.args.dAtkIngTimes;
        this.msWait = 0;
        this.MSCheck ();
    }

    OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        this.MSCheck ();
    }

    MSCheck () {
        if (this.msWait == 0) {
            // 每次等候结束，都该开火
            if (0 < this.atkTime) {
                this.atkTime--;
                this.rel.Fire ();
            };

            // 还有次数，进入冷却
            if (0 < this.atkTime) {
                this.msWait = this.rel.args.dAtkIngSpace;
            };
        };

        if (this.msWait == 0) {
            this.rel.EnterStatus (this.rel.statusAtkCEnd);
        };
    }

    OnAnim() {
        return this.rel.args.dAtkIngAnim;
    }

    OnMSKeep(): number {
        return (this.rel.args.dAtkIngTimes - 1) * this.rel.args.dAtkIngSpace;
    }
}