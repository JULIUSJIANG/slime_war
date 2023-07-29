import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import ScreenShotViewState from "../screen_shot_view/ScreenShotViewState";
import BlurViewState from "./BlurViewState";


const {ccclass, property} = cc._decorator;

const APP = `BlurViewScreenShot`;

const MAT_PROPERTY_TEXTURE_BOARD = `textureScreenshot`;

/**
 * 每个模糊单元
 */
@ccclass
export default class BlurViewScreenShot extends UIViewComponent {
    /**
     * 图片 - 截图内容的展示
     */
    @property (cc.Sprite)
    sprScreenShot: cc.Sprite = null;

    /**
     * 相机 - 截图
     */
    @property (cc.Camera)
    cameraScreenshot: cc.Camera = null;

    static nodeType: UINodeType<BlurViewScreenShot, BlurViewState, number> = UINodeType.Pop (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/blur_view_screenshot`,
            componentGetter: node => node.getComponent (BlurViewScreenShot),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <BlurViewScreenShot, BlurViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.BLUR
                        ],
                        propsFilter: (com, state, props) => {


                            let data = state.mapIdxToRT.get (props);
                            com.node.x = data.posX;
                            com.sprScreenShot.node.width = data.width;
                            com.sprScreenShot.node.height = data.height;
                            com.sprScreenShot.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_BOARD, ScreenShotViewState.inst.rtScreen);

                            com.cameraScreenshot.targetTexture = data.rt;

                            // 对比原图，当前缩放的尺寸
                            let scale = BlurViewState.SCALE * 0.5 ** (props - 1);
                            // 缩小相机范围，使得贴图充满相机
                            com.cameraScreenshot.node.x = data.width / 2;
                            com.cameraScreenshot.node.y = data.height / 2;
                            com.cameraScreenshot.zoomRatio = 1 / scale;

                            com.cameraScreenshot.node.active = state.isRendering;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    )
}