import { b2Contact, b2Shape } from "../../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import jiang from "../../../../frame/global/Jiang";
import GameElementBody from "../GameElementBody";
import Logic3003 from "./Logic3003";
import Logic3003Status from "./Logic3003Status";

const APP = `Logic3003StatusMoveJump`;

export default class Logic3003StatusMoveJump extends Logic3003Status {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<Logic3003StatusMoveJump>({
        instantiate: () => {
            return new Logic3003StatusMoveJump();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: Logic3003) {
        let val = UtilObjPool.Pop(Logic3003StatusMoveJump._t, apply);
        val.relMachine = machine;
        return val;
    }

    public OnEnter(): void {
        this.relMachine.relBody.commonAnim = Logic3003Status.ANIM_JUMPED;
        let vec = UtilObjPool.Pop (UtilObjPool.typeB2Vec2, APP);
        vec.x = -this.relMachine.args.moveSpeed * jiang.mgrUI._sizePerPixel * 1000;
        vec.y = - this.relMachine.relBody.relState.b2Gravity * this.relMachine.args.atkTime / 1000 / 2 * Logic3003.GRAVITY_SCALE / 2;
        this.relMachine.relBody.commonBody.b2Body.SetLinearVelocity (
            vec
        );
    }

    public OnTimeStep(passedMS: number): void {
        // 触地即弹
        if (this.relMachine.relBody.IsConcatWithGround()) {
            this.relMachine.EnterStatus (this.relMachine.statusOrdinary);
        };
    }
}