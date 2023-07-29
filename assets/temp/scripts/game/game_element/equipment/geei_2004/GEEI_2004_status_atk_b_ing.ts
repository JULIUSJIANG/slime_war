import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GEEI_2004 from "./GEEI_2004";
import GEEI_2004_status from "./GEEI_2004_status";


const APP = `GEEI_2004_status_b_ing`;

/**
 * 开火中
 */
export default class GEEI_2004_status_b_ing extends GEEI_2004_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2004_status_b_ing>({
        instantiate: () => {
            return new GEEI_2004_status_b_ing ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2004) {
        let val = UtilObjPool.Pop (GEEI_2004_status_b_ing._t, apply);
        val.rel = rel;
        return val;
    }

    atkTime: number;

    msWait: number;
    
    OnEnter(): void {
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
            // 开火
            this.rel.Fire ();
            // 计算次数
            this.atkTime--;

            // 还有次数，进入冷却
            if (0 < this.atkTime) {
                this.msWait = this.rel.args.dAtkIngSpace;
                // 如果要求等待的时间为 0，这里直接产生循环
                if (this.msWait == 0) {
                    this.MSCheck ();
                };
            }
            // 否则回到冷却状态
            else {
                this.rel.EnterStatus (this.rel.statusAtkCEnd);
            };
        };
    }

    OnAnim() {
        return this.rel.args.dAtkIngAnim;
    }

    OnMSKeep() {
        return (this.rel.args.dAtkIngTimes - 1) * this.rel.args.dAtkIngSpace;
    }
}