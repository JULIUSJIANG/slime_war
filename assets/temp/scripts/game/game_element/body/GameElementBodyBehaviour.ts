import { b2Contact, b2Shape } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import GameElement from "../GameElement";
import GameElementBody from "./GameElementBody";
import GameElementBodyCtxDmg from "./GameElementBodyCtxDmg";

const APP = `GameElementBodyBehaviour`;

/**
 * 表现
 */
export default abstract class GameElementBodyBehaviour {
    /**
     * 归属的单位
     */
    public relBody: GameElementBody;

    /**
     * 事件派发 - 初始化
     */
    public OnInit () {

    }

    /**
     * 事件派发 - 受伤
     * @param ctx 
     */
    public OnDmg (ctx: GameElementBodyCtxDmg) {

    }

    /**
     * 事件派发 - 接触 A
     * @param cont 
     */
    public OnConcatA (cont: b2Contact<b2Shape, b2Shape>) {

    }

    /**
     * 事件派发 - 接触 B
     * @param cont 
     */
    public OnConcatB (cont: b2Contact<b2Shape, b2Shape>) {

    }

    /**
     * 事件派发 - 时间推进
     * @param passedMS 
     */
    public OnTimeStep (passedMS: number) {

    }
    
    /**
     * 事件派发 - 销毁
     */
    public OnDestory () {

    }

    public b2GetSpeedX () {
        if (this.relBody.commonBody == null) {
            return 0;
        };
        return this.relBody.commonBody.b2Body.GetLinearVelocity().x;
    }
}