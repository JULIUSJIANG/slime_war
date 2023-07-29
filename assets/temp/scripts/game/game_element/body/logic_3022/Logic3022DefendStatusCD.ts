import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameDisplayTxt from "../../../display/GameDisplayTxt";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3022 from "./Logic3022";
import Logic3022DefendStatus from "./Logic3022DefendStatus";

const APP = `Logic3022DefendStatusCD`;

/**
 * 防御状态机 - CD
 */
export default class Logic3022DefendStatusCD extends Logic3022DefendStatus {
    
    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3022DefendStatusCD>({
        instantiate: () => {
            return new Logic3022DefendStatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3022) {
        let val = UtilObjPool.Pop (Logic3022DefendStatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * cd - 留存
     */
    cd: number = 0;

    /**
     * cd - 治疗
     */
    cdCure: number = 0;

    public OnEnter(): void {
        this.relMachine.animKeep.currStatus.OnFadeIn ();
        this.relMachine.relBody.commonCD.Enter (this.relMachine.relBody.commonCD.statusIng);
        this.cd = this.relMachine.args.cdCure;
        this.cdCure = 0;
    }

    public OnExit(): void {
        this.relMachine.animKeep.currStatus.OnFadeOut ();
    }

    public OnTimeStep(ms: number): void {
        this.cdCure -= ms;
        if (this.cdCure <= 0) {
            this.cdCure = this.relMachine.args.cdCircle;
            let countCure = this.relMachine.args.cureCount * this.relMachine.relBody.commonArgsPower;
            this.relMachine.relBody.commonHpCurrent += countCure;
            this.relMachine.relBody.commonHpCurrent = Math.min (this.relMachine.relBody.commonHpMax, this.relMachine.relBody.commonHpCurrent);
            GameElementTxt.PopForCure (
                APP,
                countCure,
                this.relMachine.relBody
            );
        };

        this.cd -= ms;
        // 冷却完毕的话，回到防御状态
        if (this.cd <= 0) {
            this.relMachine.HMEnterStatus (this.relMachine.hmStatusOrdinary);
            return;
        };
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.relBody.commonCD.Enter (this.relMachine.relBody.commonCD.statusIng);
        this.cd = this.relMachine.args.cdCure;
    }
}