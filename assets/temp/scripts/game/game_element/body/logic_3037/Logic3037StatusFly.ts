import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import GameElementEff from "../../common/GameElementEff";
import GameElementBody from "../GameElementBody";
import GameSizeMarkRS from "../GameSizeMarkRS";
import Logic3037 from "./Logic3037";
import Logic3037Status from "./Logic3037Status";

const APP = `Logic3037StatusFly`;

/**
 * 3037 的状态 - 飞翔
 */
export default class Logic3037StatusFly extends Logic3037Status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3037StatusFly>({
        instantiate: () => {
            return new Logic3037StatusFly();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relLogic: Logic3037) {
        let val = UtilObjPool.Pop (Logic3037StatusFly._t, apply);
        val.relMachine = relLogic;
        return val;
    }

    OnStep(ms: number): void {
        // 触地即亡
        if (
            0 < this.relMachine.relBody.listConcatedGround.length 
            && this.relMachine.relBody.commonBody.b2Body.GetLinearVelocity().y <= 0 
            && this.relMachine.relBody.commonCenterPos.y < gameCommon.GROUND_Y
        ) 
        {
            GameSizeMarkRS.PlayEffHitByBodyForHitGround (
                APP,
                this.relMachine.relBody
            );
            this.relMachine.relBody.relState.RemEle(this.relMachine.relBody);
            return;
        };
        if (0 < this.relMachine.relBody.listConcatedBodyEnemy.length) {
            this.relMachine.hookTarget = this.relMachine.relBody.listConcatedBodyEnemy [0].relFixture.relBody.relEle as GameElementBody;
            this.relMachine.EnterStatus (this.relMachine.statusHook);
        };
    }
}