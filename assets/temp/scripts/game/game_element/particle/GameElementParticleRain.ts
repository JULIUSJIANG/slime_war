import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import GameDisplayPart from "../../display/GameDisplayPart";
import gameCommon from "../../GameCommon";
import GameElementPart from "../common/GameElementPart";
import GameElementParticle from "./GameElementParticle";
import GameElementParticleRainMgr from "./GameElementParticleRainMgr";

const APP = `GameElementParticleRain`;

// 颜色 - 雨滴
const COLOR_RAIN = new cc.Color(159, 231, 255);

// 粒子速度
const PARTICLE_SPEED = 640 / 1000 / 8;

// 最大留存
const MAX_MS = 200;

/**
 * 粒子 - 雪
 */
export default class GameElementParticleRain extends GameElementParticle {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementParticleRain>({
        instantiate: () => {
            return new GameElementParticleRain();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,

        relMgr: GameElementParticleRainMgr,

        initPosX: number,
        initPosY: number,

        initSpeedX: number,
        initSpeedY: number
    )
    {
        let val = UtilObjPool.Pop(GameElementParticleRain._t, apply);

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
                val.relState.AddEle(GameElementPart.Pop(
                    apply,

                    val.currPos.x,
                    gameCommon.GROUND_Y,

                    PARTICLE_SPEED,
                    PARTICLE_SPEED,

                    COLOR_RAIN,
                    GameDisplayPart.nodeType202,
                    MAX_MS,
                    0
                ));
                val.relState.AddEle(GameElementPart.Pop(
                    apply,

                    val.currPos.x,
                    gameCommon.GROUND_Y,

                    -PARTICLE_SPEED,
                    PARTICLE_SPEED,

                    COLOR_RAIN,
                    GameDisplayPart.nodeType202,
                    MAX_MS,
                    0
                ));
                val.relState.RemEle(val);
            });
        });

        val.evterRem.On(() => {
            val.rrRelMgr.evterSteped.Off( val.rrListenerStep );
        });
        return val;
    }

    /**
     * 销毁记录 - 降雨管理器
     */
    private rrRelMgr: GameElementParticleRainMgr;

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