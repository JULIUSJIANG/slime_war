import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import gameCommon from "../../../GameCommon";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import Logic3003 from "./Logic3003";
import Logic3003Status from "./Logic3003Status";

const APP = `Logic3003StatusOrdinary`;

/**
 * 状态机 - 状态 - 已受伤
 */
export default class Logic3003StatusOrdinary extends Logic3003Status{
    
    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<Logic3003StatusOrdinary>({
        instantiate: () => {
            return new Logic3003StatusOrdinary();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3003) {
        let val = UtilObjPool.Pop(Logic3003StatusOrdinary._t, apply);
        val.relMachine = machine;
        return val;
    }

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3003Status.ANIM_ORDINARY;
    }

    public OnTimeStep(passedMS: number): void {
        // 没触地
        if (!this.relMachine.relBody.IsConcatWithGround()) {
            return;
        };
        // 触地了
        for (let i = 0; i < this.relMachine.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relMachine.relBody.listConcatedBodyEnemy[i];
            // 寻敌成功
            if (concat.fixtureSelf == this.relMachine.fixArea) {
                this.relMachine.EnterStatus (this.relMachine.statusPower);
                this.relMachine.currStatus.OnTarget(concat.relFixture.relBody.relEle as GameElementBody);
                return;
            };
        };
        this.relMachine.EnterStatus (this.relMachine.statusMovePower);
    }
}