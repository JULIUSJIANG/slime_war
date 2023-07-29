import GraphicsDrawer from "../../../../frame/extend/graphics_drawer/GraphicsDrawer";
import GEEI_2004 from "./GEEI_2004";

const APP = `GEEI_2004_status`;

/**
 * 状态的基础模板
 */
export default abstract class GEEI_2004_status {
    /**
     * 归属的主体
     */
    rel: GEEI_2004;

    /**
     * 事件派发 - 进入状态
     */
    OnEnter () {

    }

    /**
     * 事件派发 - 离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发 - 时间推动
     * @param ms 
     */
    OnStep (ms: number) {

    }

    /**
     * 事件派发 - 绘制
     * @param drawer 
     */
    OnDraw (drawer: GraphicsDrawer) {

    }

    /**
     * 事件派发 - 开火
     */
    OnFireStart () {

    }

    /**
     * 事件派发 - 开火中
     */
    OnFiring () {

    }

    /**
     * 事件派发 - 关火
     */
    OnFireEnd () {

    }

    /**
     * 事件派发 - 放入背包
     */
    OnBackpack () {

    }

    /**
     * 事件派发 - 拿出到手上
     */
    OnHand () {

    }

    /**
     * 获取冷却
     * @returns 
     */
    OnCd () {
        return 1;
    }

    /**
     * 事件派发 - 动画
     */
    abstract OnAnim (): string;    
    
    /**
     * 留存在该状态的时间
     */
    abstract OnMSKeep (): number;
}