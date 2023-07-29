import { b2Body, b2Fixture, b2FixtureDef } from "../../../box2d_ts/Box2D";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import GameCtxB2Body from "./GameCtxB2Body";
import GameCtxB2BodyFixtureConcat from "./GameCtxB2BodyFixtureConcat";
import GameCtxB2BodyFixtureTypeRS from "./GameCtxB2BodyFixtureTypeRS";
import GameElement from "./GameElement";

const APP = `GameCtxB2Shape`;

let ID = 0;

/**
 * 形状的上下文
 */
class GameCtxB2BodyFixture {

    private constructor () {}

    private static _t = new UtilObjPoolType<GameCtxB2BodyFixture>({
        instantiate: () => {
            return new GameCtxB2BodyFixture();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.relBody = null;
            t.b2Fixture = null;
            t.type = null;
            t.listConcat.length = 0;
        },
        tag: APP
    });

    static SYM_REC = Symbol(`GameCtxB2BodyFixture`);

    static Pop (apply: string, body: GameCtxB2Body<GameElement>, fd: b2FixtureDef, type: GameCtxB2BodyFixtureTypeRS) {
        let val = UtilObjPool.Pop(GameCtxB2BodyFixture._t, apply);
        val.id = ++ID;
        val.relBody = body;
        val.b2Fixture = body.b2Body.CreateFixture(fd);
        val.b2Fixture[GameCtxB2BodyFixture.SYM_REC] = val;
        val.type = type;
        return val;
    }

    /**
     * 归属的物体
     */
    relBody: GameCtxB2Body<GameElement>;

    /**
     * 特性
     */
    b2Fixture: b2Fixture;

    /**
     * 类型
     */
    type: GameCtxB2BodyFixtureTypeRS;

    /**
     * 列表 - 当前碰撞了的内容
     */
    listConcat: Array<GameCtxB2BodyFixtureConcat> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 标识
     */
    id: number;
}

export default GameCtxB2BodyFixture;