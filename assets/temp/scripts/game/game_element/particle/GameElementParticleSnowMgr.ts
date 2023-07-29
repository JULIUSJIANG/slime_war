import BCEventer from "../../../frame/basic/BCEventer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import MgrUI from "../../../frame/ui/MgrUI";
import gameCommon from "../../GameCommon";
import GameState from "../GameState";
import GameElementParticleRain from "./GameElementParticleRain";
import GameElementParticleSnow from "./GameElementParticleSnow";

const APP = `GameElementParticleSnowMgr`;

const MS_PER_FRAME = 1000 / 60;

/**
 * 降雨管理器
 */
export default class GameElementParticleSnowMgr {

    private constructor () {}

    private static _t = new UtilObjPoolType<GameElementParticleSnowMgr>({
        instantiate: () => {
            return new GameElementParticleSnowMgr();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, gameState: GameState) {
        let val = UtilObjPool.Pop(GameElementParticleSnowMgr._t, apply);
        val.relGameState = gameState;

        // 监听核心的时间推进
        gameState.evterSteped.On((ms) => {
            val.evterSteped.Call(ms);
        });
        val.evterSteped.On((ms) => {
            val.OnStepMS(ms);
        });

        return val;
    }

    /**
     * 事件派发-已更新
     */
    evterSteped: BCEventer<number> = BCEventer.Pop(APP);

    /**
     * 归属的核心
     */
    private relGameState: GameState;

    /**
     * 最小 x 值
     */
    private xMin: number;
    /**
     * 最大 x 值
     */
    private xMax: number;

    /**
     * 时间推进
     * @param ms 
     */
    private OnStepMS (
        ms: number
    ) 
    {
        let rainCountCutrrent = 0;
        rainCountCutrrent += ms * this.countPerMS;
        while (1 < rainCountCutrrent) {
            this.Drop();
            rainCountCutrrent--;
        };
        if (Math.random() < rainCountCutrrent) {
            this.Drop();
        };
    }

    /**
     * 速度 x
     */
    speedX: number;
    /**
     * 速度 y
     */
    speedY: number;
    /**
     * 每毫秒数量
     */
    countPerMS: number;

    /**
     * 发生一次降雨
     */
    private Drop () {
        // 玩家速度
        let playerSpeedX = this.relGameState.player.commonBehaviour.b2GetSpeedX() / 1000 / jiang.mgrUI._sizePerPixel;
        // 坠落高度
        let dropY = (gameCommon.GROUND_Y - MgrUI.FAT_HEIGHT) / gameCommon.SCENE_SCALE;
        // 坠落水平偏移
        let dropX = dropY / this.speedY * (this.speedX - playerSpeedX);
    
        // x 最小值
        this.xMin = this.relGameState.player.commonFootPos.x + gameCommon.CAMERA_OFFSET_X / gameCommon.SCENE_SCALE;
        this.xMin = Math.min(this.xMin, this.xMin - dropX);
    
        // x 最大值
        this.xMax = this.relGameState.player.commonFootPos.x + (gameCommon.CAMERA_OFFSET_X + jiang.mgrUI._containerUI.width) / gameCommon.SCENE_SCALE;
        this.xMax = Math.max(this.xMax, this.xMax - dropX);

        // 降落的位置 x
        let x = this.xMin + (this.xMax - this.xMin) * Math.random();
        // 降落的位置 y
        let y = MgrUI.FAT_WIDTH;

        let rain = GameElementParticleSnow.Pop(
            APP,

            this,

            x,
            y,
            
            this.speedX,
            this.speedY
        );
        this.relGameState.AddEle(rain);
    }

    /**
     * 预热
     */
    WarmUp () {
        // 坠落高度
        let dropY = (gameCommon.GROUND_Y - MgrUI.FAT_HEIGHT) / gameCommon.SCENE_SCALE;
        // 坠落耗时
        let flowMS = dropY / this.speedY;
        // 自我进行时间推进
        while (MS_PER_FRAME < flowMS) {
            flowMS -= MS_PER_FRAME;
            this.evterSteped.Call(MS_PER_FRAME);
        };
    }
}