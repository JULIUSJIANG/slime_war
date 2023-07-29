import GameState from "../../game_element/GameState";

const APP = `GamePlayViewMachine`;

/**
 * 游戏界面的控制策略
 */
export default abstract class GamePlayViewMachine {
    /**
     * 游戏核心
     */
    abstract get gameState (): GameState;
    /**
     * 事件派发 - 暂停
     */
    abstract OnPause ();
    /**
     * 获取标题
     */
    abstract OnGetTitle (): string;
    /**
     * 获取主题 id
     */
    abstract OnGetSceneId (): number;
    /**
     * 时间推进
     * @param ms 
     */
    abstract OnStep (ms: number);
    /**
     * 是 boss 关卡
     */
    abstract IsBossLevel (): boolean;
}