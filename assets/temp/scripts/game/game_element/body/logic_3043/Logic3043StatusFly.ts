import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import GameElementEff from "../../common/GameElementEff";
import GameElementBody from "../GameElementBody";
import GameSizeMarkRS from "../GameSizeMarkRS";
import Logic3043 from "./Logic3043";
import Logic3043Status from "./Logic3043Status";

const APP = `Logic3043StatusFly`;

/**
 * 3037 的状态 - 飞翔
 */
export default class Logic3043StatusFly extends Logic3043Status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3043StatusFly>({
        instantiate: () => {
            return new Logic3043StatusFly();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relLogic: Logic3043) {
        let val = UtilObjPool.Pop (Logic3043StatusFly._t, apply);
        val.relMachine = relLogic;
        return val;
    }

    OnStep(ms: number): void {
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
        if (0 < this.relMachine.relBody.listConcatedBodyEnemyNoBullet.length) {
            this.relMachine.EnterStatus (this.relMachine.statusKeep);
        };
    }
}