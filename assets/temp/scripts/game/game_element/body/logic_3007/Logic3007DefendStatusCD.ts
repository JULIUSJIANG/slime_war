import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import GameDisplayTxt from "../../../display/GameDisplayTxt";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementTxt from "../../common/GameElementTxt";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3007 from "./Logic3007";
import Logic3007DefendStatus from "./Logic3007DefendStatus";

const APP = `Logic3007DefendStatusCD`;

/**
 * 防御状态机 - CD
 */
export default class Logic3007DefendStatusCD extends Logic3007DefendStatus {
    
    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3007DefendStatusCD>({
        instantiate: () => {
            return new Logic3007DefendStatusCD();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3007) {
        let val = UtilObjPool.Pop (Logic3007DefendStatusCD._t, apply);
        val.relMachine = machine;
        return val;
    }

    cd: number = 0;

    public OnEnter(): void {
        this.relMachine.relBody.commonCD.currStatus.OnTryCall ();
        this.cd = this.relMachine.args.defendCD;
    }

    public OnTimeStep(ms: number): void {
        this.cd -= ms;
        // 冷却完毕的话，回到防御状态
        if (this.cd <= 0) {
            this.relMachine.HMEnterStatus (this.relMachine.hmStatusOrdinary);
            return;
        };
    }

    public OnDmg(ctx: GameElementBodyCtxDmg): void {
        this.relMachine.amCurrStatus.OnDmg(ctx);
        GameElementTxt.PopForTips (
            APP,
            `格挡`,
            ctx.posX,
            ctx.posY,
            this.relMachine.relBody
        );
        VoiceOggViewState.inst.VoiceSet (this.relMachine.args.hurtedOgg);
    }
}