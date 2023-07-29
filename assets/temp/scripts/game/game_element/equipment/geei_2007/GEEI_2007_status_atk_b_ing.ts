import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import GEEI_2007 from "./GEEI_2007";
import GEEI_2007_status from "./GEEI_2007_status";


const APP = `GEEI_2007_status_b_ing`;

/**
 * 开火中
 */
export default class GEEI_2007_status_b_ing extends GEEI_2007_status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GEEI_2007_status_b_ing>({
        instantiate: () => {
            return new GEEI_2007_status_b_ing ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, rel: GEEI_2007) {
        let val = UtilObjPool.Pop (GEEI_2007_status_b_ing._t, apply);
        val.rel = rel;
        return val;
    }

    msWait: number;
    
    OnEnter(): void {
        this.msWait = 0;
        this.MSCheck ();
    }

    OnStep(ms: number): void {
        this.msWait -= ms;
        this.msWait = Math.max (this.msWait, 0);
        this.MSCheck ();
    }

    MSCheck () {
        // 能量不够的话，回到冷却状态
        if (this.rel.relEquip.npc.mpCurrent < this.rel.cfgProps.props_cost) {
            this.rel.EnterStatus (this.rel.statusAtkCEnd);
        };
        // 冷却结束，开火
        if (this.msWait == 0) {
            // 每次等候结束，都该开火
            this.rel.Fire ();
            // 还有次数，进入冷却
            this.msWait = this.rel.args.dAtkIngSpace;
        };
    }

    OnFireEnd(): void {
        this.rel.EnterStatus (this.rel.statusAtkCEnd);
    }

    OnAnim() {
        return this.rel.args.dAtkIngAnim;
    }

    OnMSKeep(): number {
        return gameCommon.STANDARD_ANIM_MS;
    }
}