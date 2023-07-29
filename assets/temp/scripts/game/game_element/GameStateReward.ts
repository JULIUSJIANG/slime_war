import GameCfgBodyCacheDropRS from "./body/GameCfgBodyCacheDropRS";

/**
 * 奖励信息
 */
export default interface GameStateReward {
    /**
     * 类型，也代表策略
     */
    rs: GameCfgBodyCacheDropRS<any>;
    /**
     * 附带的参数
     */
    props: Array<number>;
}