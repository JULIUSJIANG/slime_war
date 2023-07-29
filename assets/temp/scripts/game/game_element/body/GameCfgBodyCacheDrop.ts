import GameCfgBodyCacheDropRS from "./GameCfgBodyCacheDropRS";

/**
 * 物体缓存 - 掉落缓存
 */
export default interface GameCfgBodyCacheDrop {
    /**
     * 类型
     */
    type: number;
    /**
     * 参数
     */
    val: number;
    /**
     * 注册信息
     */
    rs: GameCfgBodyCacheDropRS<any>;
}