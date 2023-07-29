import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../basic/UtilObjPool";
import jiang from "../../global/Jiang";
import WXImgLoaderStatus from "./WXImgLoaderStatus";

const APP = `WXImgLoaderStatusLoaded`;

/**
 * 微信图片加载器 - 状态 - 加载完成
 */
export default class WXImgLoaderStatusLoaded extends WXImgLoaderStatus {
    public OnFill(spr: cc.Sprite): void {
        spr.spriteFrame = this.relMachine.sprf;
    }
}