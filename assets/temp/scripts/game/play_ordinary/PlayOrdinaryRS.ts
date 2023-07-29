import indexDataStorageItem from "../../IndexStorageItem";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgChapter from "../../frame/config/src/CfgChapter";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import CfgLevel from "../../frame/config/src/CfgLevel";
import CfgScene from "../../frame/config/src/CfgScene";
import jiang from "../../frame/global/Jiang";
import CfgCacheChapter from "../cfg_cache/CfgCacheChapter";
import CfgCacheChapterLevel from "../cfg_cache/CfgCacheChapterLevel";
import DefineAltar from "../game_element/body/DefineAltar";
import PlayOrdinaryEnemyCall from "./PlayOrdinaryEnemyCall";

const APP = `PlayOrdinaryRS`;

/**
 * 主关卡流程策略
 */
class PlayOrdinaryRS {
    /**
     * 获取主题 id
     */
    getterSceneId: (lev: number) => number;
    /**
     * 获取召唤单位的列表
     */
    getterListEnemyCall: (lev: number) => Array <PlayOrdinaryEnemyCall>;
    /**
     * 标题获取器
     */
    getterTitle: (lev: number) => string
    /**
     * 怪物强度
     */
    getterMonsterPower: (lev: number, idCfg: number) => number;
    /**
     * 是 boss 关
     */
    getterIsBossLevel: (lev: number) => boolean;
    /**
     * 获取掉落缩放
     */
    getterDropScale: (lev: number) => number;

    constructor (
        args: {
            getterThemeId: (lev: number) => number,
            getterListEnemyCall: (lev: number) => Array <PlayOrdinaryEnemyCall>,
            getterTitle: (lev: number) => string,
            getterMonsterPower: (lev: number, idCfg: number) => number,
            getterIsBossLevel: (lev: number) => boolean,
            getterDropScale: (lev: number) => number
        }
    ) 
    {
        this.getterSceneId = args.getterThemeId;
        this.getterListEnemyCall = args.getterListEnemyCall;
        this.getterTitle = args.getterTitle;
        this.getterMonsterPower = args.getterMonsterPower;
        this.getterIsBossLevel = args.getterIsBossLevel;
        this.getterDropScale = args.getterDropScale;
    }
}

namespace PlayOrdinaryRS {
    /**
     * 关卡表中的关卡
     */
    export const ordinary = new PlayOrdinaryRS ({
        getterThemeId: (lev) => {
            let cfgLev = jiang.mgrCfg.cfgLevel.select (CfgLevel.idGetter, lev)._list [0];
            return cfgLev.theme;
        },
        getterListEnemyCall: (lev) => {
            let cfgLev = jiang.mgrCfg.cfgLevel.select (CfgLevel.idGetter, lev)._list [0];
            let listEnemyCall = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            listEnemyCall.push (PlayOrdinaryEnemyCall.Pop(
                APP,
                cfgLev.part_0_triger_ms,
                cfgLev.part_0_monster_delay,
                cfgLev.part_0_monster_id,
                cfgLev.part_0_monster_x
            ));
            listEnemyCall.push (PlayOrdinaryEnemyCall.Pop(
                APP,
                cfgLev.part_1_triger_ms,
                cfgLev.part_1_monster_delay,
                cfgLev.part_1_monster_id,
                cfgLev.part_1_monster_x
            ));
            listEnemyCall.push (PlayOrdinaryEnemyCall.Pop(
                APP,
                cfgLev.part_2_triger_ms,
                cfgLev.part_2_monster_delay,
                cfgLev.part_2_monster_id,
                cfgLev.part_2_monster_x
            ));
            return listEnemyCall;
        },
        getterTitle: (lev) => {
            let cfgLev = jiang.mgrCfg.cfgLevel.select (CfgLevel.idGetter, lev)._list [0];
            let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, cfgLev.relChapter)._list [0];
            let cfgChapterCache = CfgCacheChapter.GetCache (cfgChapter);
            let cfgScene = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, cfgLev.theme)._list [0];
            return `${cfgScene.name} ${cfgLev.idx} / ${(cfgChapterCache.levelMax - cfgChapterCache.levelMin + 1)}`;
        },
        getterMonsterPower: (lev: number, idCfg: number) => {
            let cfg = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfg)._list [0];
            return cfg.power;
        },
        getterIsBossLevel: (lev) => {
            let cache = CfgCacheChapterLevel.idToCacheMap.get (lev);
            return cache.isBossLevel;
        },
        getterDropScale: (lev) => {
            let cfgLev = jiang.mgrCfg.cfgLevel.select (CfgLevel.idGetter, lev)._list [0];
            let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, cfgLev.relChapter)._list [0];
            let cfgChapterCache = CfgCacheChapter.GetCache (cfgChapter);
            // 简单来讲，就是总强度达不到章节总强度的话，要按照比率补回来
            return cfgChapterCache.powerStandard / cfgChapterCache.powerSum;
        }
    });

    /**
     * 标准延时
     */
    const DELAY_STANDARD = 2000;
    /**
     * 随机延时
     */
    const DELAY_RANDOM = 600;
    /**
     * 祭坛挑战
     */
    export const altar = new PlayOrdinaryRS ({
        getterThemeId: (lev) => {
            return 0;
        },
        getterListEnemyCall: (lev) => {
            // 还没给该关卡生成随机怪物
            if (jiang.mgrData.Get (indexDataStorageItem.altarInitLev) != lev) {
                // 否则新建
                let listMonsterDelay: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                let listMonsterId: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                let listMonsterX: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                for (let i = 0; i < DefineAltar.LIST_MONSTER_ADDITION.length; i++) {
                    let collMonster = DefineAltar.LIST_MONSTER_ADDITION [i];
                    let monsterIdRan = collMonster [Math.floor (Math.random () * collMonster.length)];
                    listMonsterId.splice (Math.floor (Math.random () * (listMonsterId.length + 1)), 0, monsterIdRan);
                };
                for (let i = 0; i < listMonsterId.length; i++) {
                    listMonsterDelay.push (i * DELAY_STANDARD + (Math.random () - 0.5) * 2 * DELAY_RANDOM );
                    listMonsterX.push (0, 0);
                };
                let listEnemyCall = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                listEnemyCall.push (PlayOrdinaryEnemyCall.Pop (
                    APP,
                    0,
                    listMonsterDelay,
                    listMonsterId,
                    listMonsterX
                ));
                // 把组合保存下来
                jiang.mgrData.Set (indexDataStorageItem.altarInitLev, lev);
                jiang.mgrData.Set (indexDataStorageItem.altarInitListBody, listEnemyCall);
                indexDataStorageItem.altarInitListBody.media.onSet ();
            };
            // 返回副本
            return JSON.parse (JSON.stringify (jiang.mgrData.Get (indexDataStorageItem.altarInitListBody)));
        },
        getterTitle: (lev) => {
            let cfgTheme = jiang.mgrCfg.cfgScene.select (CfgScene.idGetter, altar.getterSceneId (lev))._list [0];
            return `${cfgTheme.name} ${lev - jiang.mgrCfg.cfgLevel._list.length}`;
        },
        getterMonsterPower: (lev: number, idCfg: number) => {
            let idx = lev - jiang.mgrCfg.cfgLevel._list.length - 1;
            let cfg = jiang.mgrCfg.cfgCommon._list [0];
            return cfg.inc_for_chapter ** jiang.mgrCfg.cfgChapter._list.length * cfg.inc_for_level ** idx;
        },
        getterIsBossLevel: (lev) => {
            return false;
        },
        getterDropScale: (lev) => {
            return 1;
        }
    });

    /**
     * 获取策略
     * @param lev 
     * @returns 
     */
    export function GetRS (lev: number): PlayOrdinaryRS {
        let cfgLev = jiang.mgrCfg.cfgLevel.select (CfgLevel.idGetter, lev)._list [0];
        if (cfgLev == null) {
            return altar;
        };
        return ordinary;
    }
}

export default PlayOrdinaryRS;