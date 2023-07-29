import indexDataStorageItem from "../../IndexStorageItem";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgChapter from "../../frame/config/src/CfgChapter";
import CfgLevel from "../../frame/config/src/CfgLevel";
import jiang from "../../frame/global/Jiang";
import CfgCacheChapterLevel from "./CfgCacheChapterLevel";

const APP = `CfgCacheChapter`;

/**
 * 配置缓存 - 章节
 */
interface CfgCacheChapter {
    /**
     * 配表 id
     */
    idCfg: number;
    /**
     * 怪物列表
     */
    listMonsterSortByIdCfg: Array<number>;
    /**
     * 最小关卡
     */
    levelMin: number;
    /**
     * 最大关卡
     */
    levelMax: number;
    /**
     * 强度合计
     */
    powerSum: number;
    /**
     * 标准强度
     */
    powerStandard: number;
}

namespace CfgCacheChapter {
    /**
     * 存取缓存数据的键
     */
    const SYM = Symbol (`CfgCacheTheme`);

    /**
     * 设置缓存
     * @param cfgChapter 
     * @param cache 
     */
    export function SetCache (cfgChapter: CfgChapter, cache: CfgCacheChapter) {
        cfgChapter [SYM] = cache;
    }

    /**
     * 获取缓存
     * @param cfgChapter 
     * @returns 
     */
    export function GetCache (cfgChapter: CfgChapter) {
        if (cfgChapter == null) {
            return null;
        };
        return cfgChapter [SYM] as CfgCacheChapter;
    }

    /**
     * 获取当前正在挑战的章节
     * @returns 
     */
    export function GetChallengeChapter () {
        let challengeChapter = 1;
        for (let i = 0; i < jiang.mgrCfg.cfgChapter._list.length; i++) {
            let cfg = jiang.mgrCfg.cfgChapter._list [i];
            let rec = CfgCacheChapter.GetCache (cfg);
            if (rec.levelMin <= jiang.mgrData.Get(indexDataStorageItem.challengeLev)) {
                challengeChapter = rec.idCfg;
            };
        };
        return challengeChapter;
    }
}

export default CfgCacheChapter;