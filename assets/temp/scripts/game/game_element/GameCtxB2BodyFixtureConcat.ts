import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import GameCtxB2BodyFixture from "./GameCtxB2BodyFixture";

const APP = `GameCtxHitted`;

/**
 * 碰撞检测上下文
 */
export default class GameCtxB2BodyFixtureConcat {

    private constructor () {}

    private static _t = new UtilObjPoolType<GameCtxB2BodyFixtureConcat>({
        instantiate: () => {
            return new GameCtxB2BodyFixtureConcat();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            t.fixtureSelf = null;
            t.relFixture = null;
            t.position.x = 0;
            t.position.y = 0;
            t.normal.x = 0;
            t.normal.y = 0;
        },
        tag: APP
    });

    static Pop (
        apply: string,
        fixtureSelf: GameCtxB2BodyFixture,
        fixtureOther: GameCtxB2BodyFixture,

        posX: number,
        posY: number,

        norX: number,
        norY: number
    )
    {
        let val = UtilObjPool.Pop(GameCtxB2BodyFixtureConcat._t, apply);
        val.fixtureSelf = fixtureSelf;
        val.relFixture = fixtureOther;
        val.position.x = posX;
        val.position.y = posY;
        val.normal.x = norX;
        val.normal.y = norY;
        return val;
    }

    /**
     * 形状 - 自身
     */
    fixtureSelf: GameCtxB2BodyFixture;
    /**
     * 形状 - 另一方
     */
    relFixture: GameCtxB2BodyFixture;
    /**
     * 碰撞位置
     */
    position: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 碰撞方向
     */
    normal: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);

    /**
     * 是否合法
     * @returns 
     */
    CheckValid () {
        return this.fixtureSelf
            && this.fixtureSelf.relBody
            && this.fixtureSelf.relBody.relEle

            && this.relFixture
            && this.relFixture.relBody
            && this.relFixture.relBody.relEle
    }
}