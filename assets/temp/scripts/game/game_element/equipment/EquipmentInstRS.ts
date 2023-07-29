import GamePlayViewState from "../../view/game_play/GamePlayViewState";
import EquipmentInst from "./EquipmentInst";
import GameElementBody from "../body/GameElementBody";
import UINode from "../../../frame/ui/UINode";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import MgrEquipment from "../body/logic_3031/MgrEquipment";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import CfgCacheEquipment from "../../cfg_cache/CfgCacheEquipment";
import gameMath from "../../GameMath";

const APP = `EquipmentInstRS`;

/**
 * 装备的注册信息
 */
class EquipmentInstRS<T> {

    private constructor () {}

    private static _t = new UtilObjPoolType<EquipmentInstRS<any>>({
        instantiate: () => {
            return new EquipmentInstRS();
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
            cfgToArgs: (cfg: CfgEquipmentProps) => T,
            instCreator: (apply: string, t: T) => EquipmentInst,
            instDisplay: (state: GamePlayViewState, npc: GameElementBody, instList: Array<UINode>) => void,
            getPropsSpacing: (cfg: CfgEquipmentProps, args: T) => number,
            getPropsCost: (cfg: CfgEquipmentProps, args: T) => number,
            getPropsDmg: (cfg: CfgEquipmentProps, args: T, lev: number) => number,

            aditionalBody: (cfg: CfgEquipmentProps, t: T) => Array<number>,
            aditionalEff: (cfg: CfgEquipmentProps, t: T) => Array<number>,
            aditionalVoice: (cfg: CfgEquipmentProps, t: T) => Array<number>
        }
    ) 
    {
        let val = UtilObjPool.Pop(EquipmentInstRS._t, apply);
        val.id = args.logicCode;
        val.cfgToArgs = args.cfgToArgs;
        val.instCreator = args.instCreator;
        val.instDisplay = args.instDisplay;
        val.getPropsSpacing = args.getPropsSpacing;
        val.getPropsCost = args.getPropsCost;
        val.getPropsDmg = args.getPropsDmg;
        val.aditionalBody = args.aditionalBody;
        val.aditionalEff = args.aditionalEff;
        val.aditionalVoice = args.aditionalVoice;
        EquipmentInstRS.instMap.set(args.logicCode, val);
        return val;
    }

    /**
     * 标识
     */
    id: number;

    /**
     * 把配置转为参数
     */
    cfgToArgs: (cfg: CfgEquipmentProps) => T;

    /**
     * 实例构造器
     */
    instCreator: (apply: string, t: T) => EquipmentInst;

    /**
     * 实例展示器
     */
    instDisplay: (state: GamePlayViewState, npc: GameElementBody, instList: Array<UINode>) => void;

    /**
     * 周期间隔获取器
     */
    getPropsSpacing: (cfg: CfgEquipmentProps, args: T) => number;
    /**
     * 周期消耗获取器
     */
    getPropsCost: (cfg: CfgEquipmentProps, args: T) => number;
    /**
     * 周期伤害获取器
     */
    getPropsDmg: (cfg: CfgEquipmentProps, args: T, lev: number) => number;


    /**
     * 附加的 body
     */
    aditionalBody: (cfg: CfgEquipmentProps, t: T) => Array<number>;
    /**
     * 附加的特效
     */
    aditionalEff: (cfg: CfgEquipmentProps, t: T) => Array<number>;
    /**
     * 附加的音效
     */
    aditionalVoice: (cfg: CfgEquipmentProps, t: T) => Array<number>;
}

namespace EquipmentInstRS {
    /**
     * 实例缓存
     */
    export const instMap: Map<number, EquipmentInstRS<any>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 获取显示的间隔
     * @param idCfgEquip 
     * @returns 
     */
    export function GetDisplaySpacing (idCfgEquip: number) {
        let cfgEquip = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idCfgEquip)._list[0];
        let rs = EquipmentInstRS.instMap.get (cfgEquip.logic);
        return (rs.getPropsSpacing (cfgEquip, CfgCacheEquipment.GetCache(cfgEquip).args) / 1000).toFixed (2);
    }

    /**
     * 获取显示的间隔
     * @param idCfgEquip 
     * @returns 
     */
    export function GetDisplayCost (idCfgEquip: number) {
        let cfgEquip = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idCfgEquip)._list[0];
        let rs = EquipmentInstRS.instMap.get (cfgEquip.logic);
        return Math.ceil (rs.getPropsCost (cfgEquip, CfgCacheEquipment.GetCache(cfgEquip).args));
    }

    /**
     * 获取显示的伤害
     * @param idCfgEquip 
     * @returns 
     */
    export function GetDisplayDmgByPower (idCfgEquip: number, power: number) {
        let cfgEquip = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idCfgEquip)._list[0];
        let rs = EquipmentInstRS.instMap.get (cfgEquip.logic);
        return Math.floor (rs.getPropsDmg (cfgEquip, CfgCacheEquipment.GetCache(cfgEquip).args, power));
    }

    /**
     * 获取单个伤害
     * @param idCfgEquip 
     * @param power 
     * @returns 
     */
    export function GetSingleDmgByPower (idCfgEquip: number, power: number) {
        let cfgEquip = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idCfgEquip)._list[0];
        let cfgEquipArmo = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, cfgEquip.arrow)._list[0];
        return cfgEquipArmo.props_influence_count * power;
    }

    /**
     * 获取单个击退量
     * @param idCfgEquip 
     * @param levEquip 
     * @returns 
     */
    export function GetSingleRepel (idCfgEquip: number) {
        let cfgEquip = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idCfgEquip)._list[0];
        let cfgEquipArmo = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, cfgEquip.arrow)._list[0];
        return cfgEquipArmo.props_repel;
    }
}

export default EquipmentInstRS;