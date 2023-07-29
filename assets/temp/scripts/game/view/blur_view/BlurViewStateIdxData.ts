import UIViewComponent from "../../../frame/ui/UIViewComponent";

const {ccclass, property} = cc._decorator;

const APP = `BlurViewStateIdxData`;

/**
 * 索引数据
 */
export default interface BlurViewStateIdxData {
    /**
     * 索引
     */
    idx: number;
    /**
     * 宽
     */
    width: number;
    /**
     * 高
     */
    height: number;
    /**
     * x
     */
    posX: number;
    /**
     * 缩放
     */
    scale: number;
    /**
     * 渲染纹理
     */
    rt: cc.RenderTexture;
}