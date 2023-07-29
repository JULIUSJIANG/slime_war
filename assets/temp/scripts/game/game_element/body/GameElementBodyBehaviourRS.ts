import GameElementBody from "./GameElementBody";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import GamePlayViewState from "../../view/game_play/GamePlayViewState";
import UINode from "../../../frame/ui/UINode";
import jiang from "../../../frame/global/Jiang";
import CfgCacheGameElement from "../../cfg_cache/CfgCacheGameElement";

const APP = `GameElementBodyBehaviourRS`;

/**
 * 怪物表现的注册信息
 */
class GameElementBodyBehaviourRS<T> {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<GameElementBodyBehaviourRS<any>>({
        instantiate: () => {
            return new GameElementBodyBehaviourRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T> (
        apply: string,
        args: {
            logicCode: number,
            cfgToArgs: (cfg: CfgGameElement) => T,
            init: (monster: GameElementBody, t: T) => void,
            instDisplay: (state: GamePlayViewState, eleMonster: GameElementBody, instList: Array<UINode>) => void,
            boardDisplay: (state: GamePlayViewState, props: Array<number>, boardList: Array<UINode>) => void,
            atkGetter: (cfg: CfgGameElement, t: T) => number,
            hpGetter: (cfg: CfgGameElement, t: T) => number,
            sizeGetter: (t: T) => number,

            aditionalBody: (cfg: CfgGameElement, t: T) => Array<number>,
            aditionalEff: (cfg: CfgGameElement, t: T) => Array<number>,
            aditionalVoice: (cfg: CfgGameElement, t: T) => Array<number>
        }
    ) 
    {
        let val = UtilObjPool.Pop(GameElementBodyBehaviourRS._t, apply);
        val.logicCode = args.logicCode;
        val.cfgToArgs = args.cfgToArgs
        val.init = args.init;
        val.instDisplay = args.instDisplay;
        val.boardDisplay = args.boardDisplay;
        val.atkGetter = args.atkGetter;
        val.hpGetter = args.hpGetter;
        val.sizeGetter = args.sizeGetter;
        val.aditionalBody = args.aditionalBody;
        val.aditionalEff = args.aditionalEff;
        val.aditionalVoice = args.aditionalVoice;
        GameElementBodyBehaviourRS.instMap.set(val.logicCode, val);
        return val;
    }

    /**
     * 逻辑代号
     */
    logicCode: number;
    
    /**
     * 转换器
     */
    cfgToArgs: (cfg: CfgGameElement) => T;

    /**
     * 初始化
     */
    init: (monster: GameElementBody, t: T) => void;

    /**
     * 实例展示器
     */
    instDisplay: (state: GamePlayViewState, eleMonster: GameElementBody, instList: Array<UINode>) => void;

     /**
      * 面板展示器
      */
    boardDisplay: (state: GamePlayViewState, props: Array<number>, boardList: Array<UINode>) => void;

    /**
     * 攻击获取器
     */
    atkGetter: (cfg: CfgGameElement, t: T) => number;
    /**
     * 生命获取器
     */
    hpGetter: (cfg: CfgGameElement, t: T) => number;
    /**
     * 尺寸获取器
     */
    sizeGetter: (t: T) => number;

    /**
     * 附加的 body
     */
    aditionalBody: (cfg: CfgGameElement, t: T) => Array<number>;
    /**
     * 附加的特效
     */
    aditionalEff: (cfg: CfgGameElement, t: T) => Array<number>;
    /**
     * 附加的音效
     */
    aditionalVoice: (cfg: CfgGameElement, t: T) => Array<number>;
}

namespace GameElementBodyBehaviourRS {
    /**
     * 实例映射
     */
    export const instMap: Map<number, GameElementBodyBehaviourRS<any>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 获取资源路径
     * @param cfgId 
     * @returns 
     */
    export function GetAtk (cfgId: number) {
        let cfg = jiang.mgrCfg.cfgGameElement.select(CfgGameElement.idGetter, cfgId)._list[0];
        if (cfg == null) {
            return null;
        };
        let rs = GameElementBodyBehaviourRS.instMap.get(cfg.logic);
        if (rs == null) {
            return null;
        };
        return rs.atkGetter(cfg, CfgCacheGameElement.GetCache(cfg).logicArgs);
    }

    /**
     * 获取资源路径
     * @param cfgId 
     * @returns 
     */
    export function GetHp (cfgId: number) {
        let cfg = jiang.mgrCfg.cfgGameElement.select(CfgGameElement.idGetter, cfgId)._list[0];
        if (cfg == null) {
            return null;
        };
        let rs = GameElementBodyBehaviourRS.instMap.get(cfg.logic);
        if (rs == null) {
            return null;
        };
        return rs.hpGetter(cfg, CfgCacheGameElement.GetCache(cfg).logicArgs);
    }

    /**
     * 获取尺寸
     * @param cfgId 
     * @returns 
     */
    export function GetSize (cfgId: number) {
        let cfg = jiang.mgrCfg.cfgGameElement.select(CfgGameElement.idGetter, cfgId)._list[0];
        if (cfg == null) {
            return null;
        };
        let rs = GameElementBodyBehaviourRS.instMap.get(cfg.logic);
        if (rs == null) {
            return null;
        };
        return rs.sizeGetter(CfgCacheGameElement.GetCache(cfg).logicArgs);
    }
}

export default GameElementBodyBehaviourRS;