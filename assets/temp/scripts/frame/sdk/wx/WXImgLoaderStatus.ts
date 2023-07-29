import WXImgLoader from "./WXImgLoader";

const APP = `WXImgLoaderStatus`;

/**
 * 微信图片加载器 - 状态
 */
export default abstract class WXImgLoaderStatus {

    /**
     * 归属的状态机
     */
    relMachine: WXImgLoader;

    constructor (relMachine: WXImgLoader) {
        this.relMachine = relMachine;
    }

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
     * 把内容填充进去
     * @param spr 
     */
    OnFill (spr: cc.Sprite) {

    }
}