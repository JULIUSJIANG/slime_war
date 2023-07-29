import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import GameElementEff from "../common/GameElementEff";
import GameElementParticle from "./GameElementParticle";
import GameElementParticleSnowMgr from "./GameElementParticleSnowMgr";

const APP = `GameElementParticleSnow`;

/**
 * 粒子 - 雪
 */
export default class GameElementParticleSnow extends GameElementParticle {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementParticleSnow>({
        instantiate: () => {
            return new GameElementParticleSnow();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,

        relMgr: GameElementParticleSnowMgr,

        initPosX: number,
        initPosY: number,

        initSpeedX: number,
        initSpeedY: number
    )
    {
        let val = UtilObjPool.Pop(GameElementParticleSnow._t, apply);

        val.rrRelMgr = relMgr;
        val.currPos.x = initPosX;
        val.currPos.y = initPosY;
        val.rotation = Math.atan2(initSpeedY, initSpeedX) / Math.PI * 180;

        val.evterAdded.On(() => {
            val.rrListenerStep = val.rrRelMgr.evterSteped.On((ms) => {
                val.currPos.x += ms * initSpeedX;
                val.currPos.y += ms * initSpeedY;
                if (gameCommon.GROUND_Y < val.currPos.y) {
                    return;
                };
                val.relState.RemEle(val);
            });
        });

        val.evterRem.On(() => {
            val.rrRelMgr.evterSteped.Off( val.rrListenerStep );
            val.relState.AddEle (GameElementEff.PopForXYStatic (
                APP,
                val.currPos.x,
                val.currPos.y,
                0,
                1,
                10005,
                cc.Color.WHITE
            ));
        });
        return val;
    }

    /**
     * 销毁记录 - 降雪管理器
     */
    private rrRelMgr: GameElementParticleSnowMgr;

    /**
     * 销毁记录 - 时间监听
     */
    private rrListenerStep: number;

    /**
     * 释放占用的空间
     */
    override Release(): void {
        this.Clear();
        this.rrRelMgr = null;
        this.rrListenerStep = 0;

        this.currPos.x = 0;
        this.currPos.y = 0;

        UtilObjPool.Push(this);
    }

    /**
     * 当前位置
     */
    currPos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 旋转角
     */
    rotation: number;
}