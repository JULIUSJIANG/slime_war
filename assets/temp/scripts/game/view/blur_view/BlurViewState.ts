import IndexLayer from "../../../IndexLayer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import BlurViewStateIdxData from "./BlurViewStateIdxData";

const APP = `BlurViewState`;

/**
 * 模糊界面状态
 */
class BlurViewState extends ViewState {
    /**
     * 总界面
     */
    static inst: BlurViewState;

    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false
        );
        BlurViewState.inst = this;
    }

    private static _t = new UtilObjPoolType<BlurViewState>({
        instantiate: () => {
            return new BlurViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop (BlurViewState._t, apply);
    }

    /**
     * 索引到渲染纹理的映射
     */
    mapIdxToRT: Map <number, BlurViewStateIdxData> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 是否持续渲染
     */
    isRendering = false;

    OnInit(): void {
        for (let i = 1; i <= BlurViewState.SCREEN_SHOOT_COUNT; i++) {
            let len = (1 - 0.5 ** i) / (1 - 0.5) * jiang.mgrUI._containerUI.width * BlurViewState.SCALE;
            let width = jiang.mgrUI._containerUI.width * BlurViewState.SCALE * 0.5 ** (i - 1);
            let height = jiang.mgrUI._containerUI.height * BlurViewState.SCALE * 0.5 ** (i - 1);
            let x = len - width;
            let scale = BlurViewState.SCALE * 0.5 ** (i - 1);
            let rtScreen = new cc.RenderTexture();
            rtScreen.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
            rtScreen.initWithSize (
                width, 
                height, 
                cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8
            );
            rtScreen.setPremultiplyAlpha (false);
            let data: BlurViewStateIdxData = {
                idx: i,
                width: width,
                height: height,
                posX: x,
                scale: scale,
                rt: rtScreen
            };
            this.mapIdxToRT.set (i, data);
        };
    }
}

namespace BlurViewState {
    /**
     * 基础缩放
     */
    export const SCALE = 0.1;
    /**
     * 生成的小图数量
     */
    export const SCREEN_SHOOT_COUNT = 5;
}

export default BlurViewState;