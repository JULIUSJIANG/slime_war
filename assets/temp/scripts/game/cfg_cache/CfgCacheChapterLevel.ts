/**
 * 配置缓存 - 关卡
 */
interface CfgCacheChapterLevel {
    /**
     * 配表 id
     */
    idLev: number;
    /**
     * 出现的怪物列表
     */
    listMonster: Array<number>,
    /**
     * 强度总和
     */
    powerSum: number;

    isBossLevel: boolean;
}

namespace CfgCacheChapterLevel {
    /**
     * 配置 id 到缓存内容的映射
     */
    export const idToCacheMap: Map<number, CfgCacheChapterLevel> = new Map();
}

export default CfgCacheChapterLevel;