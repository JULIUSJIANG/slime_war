import { b2Body, b2BodyDef, b2FixtureDef } from "../../../box2d_ts/Box2D";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import GameCtxB2BodyFixture from "./GameCtxB2BodyFixture";
import GameCtxB2BodyFixtureTypeRS from "./GameCtxB2BodyFixtureTypeRS";
import GameElement from "./GameElement";

const APP = `GameCtxB2Body`;

/**
 * body 的上下文
 */
class GameCtxB2Body<T extends GameElement> {

    private constructor () {}

    private static _t = new UtilObjPoolType<GameCtxB2Body<any>>({
        instantiate: () => {
            return new GameCtxB2Body();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.relEle = null;
            t.b2Body = null;
            t.listFixtureCtx.length = 0;
        },
        tag: APP
    });

    static SYN_REC = Symbol(`GameCtxB2Body`);

    static Pop (apply: string, ele: GameElement, bd: b2BodyDef) {
        let val = UtilObjPool.Pop(GameCtxB2Body._t, apply);
        val.relEle = ele;
        val.b2Body = val.relEle.relState.b2w.CreateBody(bd);
        // 绑定对应的物理对象
        val.b2Body[GameCtxB2Body.SYN_REC] = val;
        return val;
    }

    /**
     * 溯源到的实例
     */
    relEle: T;

    /**
     * 物体
     */
    b2Body: b2Body;

    /**
     * 
     */
    listFixtureCtx: Array<GameCtxB2BodyFixture> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 构造特性
     * @param apply 
     * @param fd 
     * @returns 
     */
    FixtureCreate (apply: string, fd: b2FixtureDef, type: GameCtxB2BodyFixtureTypeRS) {
        fd.filter.categoryBits = type.b2filter.categoryBits;
        fd.filter.maskBits = type.b2filter.maskBits;
        fd.filter.groupIndex = type.b2filter.groupIndex;
        let fixture = GameCtxB2BodyFixture.Pop(
            apply,
            this,
            fd,
            type
        );
        this.listFixtureCtx.push(fixture);
        return fixture;
    }
}

export default GameCtxB2Body;