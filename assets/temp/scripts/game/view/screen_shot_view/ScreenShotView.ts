import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import ScreenShotViewState from "./ScreenShotViewState";

const {ccclass, property} = cc._decorator;

const APP = `ScreenShotView`;

/**
 * 截图界面
 */
@ccclass
export default class ScreenShotView extends UIViewComponent {
    /**
     * 相机
     */
    @property (cc.Camera)
    camera: cc.Camera = null;

    static nodeType: UINodeType <ScreenShotView, ScreenShotViewState, number> = UINodeType.Pop (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/screen_shot_view`,
            componentGetter: node => node.getComponent (ScreenShotView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <ScreenShotView, ScreenShotViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.SCREEN_SHOT
                        ],
                        propsFilter: (com, state, props) => {
                            // 不断把画面内容输送给 rt
                            com.camera.targetTexture = state.rtScreen;
                            com.camera.node.active = state.isRendering;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}