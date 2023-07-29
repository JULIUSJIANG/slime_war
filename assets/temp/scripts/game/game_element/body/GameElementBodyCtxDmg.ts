import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import GameElementBodyCtxDmgType from "./GameElementBodyCtxDmgType";

const APP = `GameElementBodyCtxDmg`;

/**
 * 伤害的上下文
 */
export default class GameElementBodyCtxDmg {
    /**
     * 伤害值
     */
    dmg: number;
    /**
     * x 坐标
     */
    posX: number;
    /**
     * y 坐标
     */
    posY: number;
    
    /**
     * 击退
     */
    repel: number;
    /**
     * 法线 x
     */
    norX: number;
    /**
     * 法线 y
     */
    norY: number;

    /**
     * 伤害类型
     */
    type: GameElementBodyCtxDmgType;

    private constructor () {}

    private static _t = new UtilObjPoolType<GameElementBodyCtxDmg>({
        instantiate: () => {
            return new GameElementBodyCtxDmg();
        },
        onPop: (t) => {
        },
        onPush: (t) => {
        },
        tag: `DmgCtx`
    });

    static Pop (
        apply: string,
        args: {
            dmg: number,
            posX: number,
            posY: number,
            repel: number,
            norX: number,
            norY: number,
            type: GameElementBodyCtxDmgType
        }
    )
    {
        let val = UtilObjPool.Pop(GameElementBodyCtxDmg._t, apply);
        val.dmg = args.dmg;
        val.posX = args.posX;
        val.posY = args.posY;
        val.repel = args.repel * jiang.mgrUI._sizePerPixel;
        val.norX = args.norX;
        val.norY = args.norY;
        val.type = args.type;
        return val;
    }
}