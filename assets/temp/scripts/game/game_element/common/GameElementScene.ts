import { b2Body, b2BodyDef, b2EdgeShape, b2Shape } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import MgrUI from "../../../frame/ui/MgrUI";
import gameCommon from "../../GameCommon";
import GameCtxB2Body from "../GameCtxB2Body";
import GameCtxB2BodyFixtureTypeRS from "../GameCtxB2BodyFixtureTypeRS";
import GameElement from "../GameElement";

const APP = `GameElementScene`;

/**
 * 元素-场景地基
 */
class GameElementScene extends GameElement  {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementScene>({
        instantiate: () => {
            return new GameElementScene();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 墙
     */
    wall: GameCtxB2Body <any>;

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(GameElementScene._t, apply);
        val.evterAdded.On(() => {
            // 生成物理模型
            let mainBd = UtilObjPool.Pop(UtilObjPool.typeBodyDef, APP);
            let bottomGround = val.BodyCreate(
                APP,
                mainBd
            );

            let bottomShape = UtilObjPool.Pop(UtilObjPool.typePolygonShape, APP);
            let bottomWidth = gameCommon.BORDER_PIXEL * jiang.mgrUI._sizePerPixel;
            let bottomCenter = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
            bottomCenter.x = -bottomWidth + MgrUI.TALL_HEIGHT * 2 * jiang.mgrUI._sizePerPixel;
            bottomCenter.y = 0;
            bottomShape.SetAsBox (bottomWidth, gameCommon.GROUND_Y * jiang.mgrUI._sizePerPixel, bottomCenter, 0);
            let bottomFd = UtilObjPool.Pop(UtilObjPool.typeFixtureDef, APP);
            bottomFd.shape = bottomShape;
            bottomGround.FixtureCreate(APP, bottomFd, GameCtxB2BodyFixtureTypeRS.BODY);
        });
        return val;
    }

    GetPhysicsTag() {
        return GameElementScene;
    }
}

export default GameElementScene;