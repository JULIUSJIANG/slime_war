import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgEff from "../../../frame/config/src/CfgEff";
import jiang from "../../../frame/global/Jiang";
import GameCtxB2BodyFixtureConcat from "../GameCtxB2BodyFixtureConcat";
import GameElement from "../GameElement";
import GameState from "../GameState";
import DefineEff from "../body/DefineEff";
import GameElementBody from "../body/GameElementBody";
import GameSizeMarkRS from "../body/GameSizeMarkRS";

const APP = `GameElementEff`;

/**
 * 元素-特效
 */
export default class GameElementEff extends GameElement {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<GameElementEff>({
        instantiate: () => {
            return new GameElementEff();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    /**
     * 坐标绑定
     */
    static PopForXYBind (
        apply: string,
        posX: number,
        posY: number,
        dirX: number,
        dirY: number,
        cfgId: number,
        tint: cc.Color,
        ele: GameElementBody
    )
    {
        let state = ele.relState;
        let idEle = ele.id;
        let eleMonster = state.GetEleById (idEle) as GameElementBody;
        let relX = posX - eleMonster.commonFootPos.x;
        let relY = posY - eleMonster.commonFootPos.y;

        let val = UtilObjPool.Pop(GameElementEff._t, apply);

        val.tint = tint;

        val.pos.x = posX;
        val.pos.y = posY;

        val.dir.x = dirX;
        val.dir.y = dirY;

        val.cfgId = cfgId;
        val.cfg = jiang.mgrCfg.cfgEff.select(CfgEff.idGetter, cfgId)._list[0];
    
        val.rotation = Math.atan2(dirY, dirX);
        val.rotation = val.rotation - Math.PI / 2;
        val.rotation = val.rotation / Math.PI * 180;
            
        /**
         * 时间步进的监听
         */
        let listenIdStep: number;

        val.evterAdded.On(() => {
            listenIdStep = val.relState.evterSteped.On((ms) => {
                if (state.GetEleById (idEle)) {
                    val.pos.x = eleMonster.commonFootPos.x + relX;
                    val.pos.y = eleMonster.commonFootPos.y + relY;
                };

                val.totalMS += ms;
                if (val.cfg.life < val.totalMS) {
                    val.relState.RemEle(val);
                };
            });
        });

        val.evterRem.On(() => {
            val.relState.evterSteped.Off( listenIdStep );
        });
        state.AddEle (val);
    }

    /**
     * 坐标固定
     * @param apply 
     * @param posX 
     * @param posY 
     * @param dirX 
     * @param dirY 
     * @param cfgId 
     * @param tint 
     * @returns 
     */
    static PopForXYStatic (
        apply: string,

        posX: number,
        posY: number,

        dirX: number,
        dirY: number,

        cfgId: number,
        tint: cc.Color
    ) 
    {
        let val = UtilObjPool.Pop(GameElementEff._t, apply);

        val.tint = tint;

        val.pos.x = posX;
        val.pos.y = posY;

        val.dir.x = dirX;
        val.dir.y = dirY;

        val.cfgId = cfgId;
        val.cfg = jiang.mgrCfg.cfgEff.select(CfgEff.idGetter, cfgId)._list[0];
    
        val.rotation = Math.atan2(dirY, dirX);
        val.rotation = val.rotation - Math.PI / 2;
        val.rotation = val.rotation / Math.PI * 180;
            
        /**
         * 时间步进的监听
         */
        let listenIdStep: number;

        val.evterAdded.On(() => {
            listenIdStep = val.relState.evterSteped.On((ms) => {
                val.totalMS += ms;
                if (val.cfg.life < val.totalMS) {
                    val.relState.RemEle(val);
                };
            });
        });

        val.evterRem.On(() => {
            val.relState.evterSteped.Off( listenIdStep );
        });
        return val;
    }

    /**
     * 着色
     */
    tint: cc.Color;
    /**
     * 初始化时候位置
     */
    pos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 方向
     */
    dir: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 配表 id
     */
    cfgId: number;
    /**
     * 实际配置
     */
    cfg: CfgEff;
    /**
     * 正确的旋转角
     */
    rotation: number;
    /**
     * 累计时间
     */
    totalMS: number = 0;
}