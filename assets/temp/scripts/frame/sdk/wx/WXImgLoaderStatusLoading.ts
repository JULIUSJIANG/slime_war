import UtilObjPool from "../../basic/UtilObjPool";
import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXImgLoaderStatus from "./WXImgLoaderStatus";

const APP = `WXImgLoaderStatusLoading`;

/**
 * 微信图片加载器 - 状态 - 加载中
 */
export default class WXImgLoaderStatusLoading extends WXImgLoaderStatus {
    /**
     * 待办集合
     */
    listSpr: Array <cc.Sprite> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    public OnEnter(): void {
        let image = MgrSdkCoreWX.wx.createImage();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            this.relMachine.sprf = new cc.SpriteFrame(texture);
            this.relMachine.EnterStatus (this.relMachine.statusLoaded);
            // 把待办事项全部处理一遍
            for (let i = 0; i < this.listSpr.length; i++) {
                let spr = this.listSpr [i];
                this.relMachine.currStatus.OnFill (spr);
            };
            this.listSpr.length = 0;
        };
        image.src = this.relMachine.url;
    }

    OnFill(spr: cc.Sprite): void {
        this.listSpr.push (spr);
    }
}