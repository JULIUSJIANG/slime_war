import IndexDataModule from "../../IndexDataModule";
import BlurViewState from "../../game/view/blur_view/BlurViewState";
import ScreenShotViewState from "../../game/view/screen_shot_view/ScreenShotViewState";
import BCType from "../basic/BCType";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import jiang from "../global/Jiang";
import UINodeInstEnterRS from "./UINodeInstEnterRS";
import UINodeInstHideRS from "./UINodeInstHideRS";
import UINodeType from "./UINodeType";
import UIViewComponent from "./UIViewComponent";

const {ccclass, property} = cc._decorator;

const APP = `UIMask`;

const MAT_PROPERTY_TEXTURE_BOARD = `textureScreenshot`;

/**
 * ui 的通用遮罩
 */
@ccclass
export default class UIMask extends UIViewComponent {
    /**
     * 背景 - 贴图
     */
    @property (cc.Sprite)
    sprBg: cc.Sprite = null;

    /**
     * 按钮 - 遮罩
     */
    @property(ComponentNodeEventer)
    btnMask: ComponentNodeEventer = null;

    /**
     * 捕获得应用 id
     */
    private _screenShotAppId: number;

    protected onEnable(): void {
        // this._screenShotAppId = ScreenShotViewState.inst.App ();
        // BlurViewState.inst.isRendering = true;
        // jiang.mgrUI.ModuleRefresh (IndexDataModule.BLUR);
    }

    protected onDisable(): void {
        // ScreenShotViewState.inst.Cancel (this._screenShotAppId);
        // BlurViewState.inst.isRendering = false;
        // jiang.mgrUI.ModuleRefresh (IndexDataModule.BLUR);
    }

    protected onLoad(): void {
        // for (let i = 1; i <= BlurViewState.SCREEN_SHOOT_COUNT; i++) {
        //     let data = BlurViewState.inst.mapIdxToRT.get (i);
        //     this.sprBg.getMaterial(0).setProperty(`${MAT_PROPERTY_TEXTURE_BOARD}${i}`, data.rt);
        // };
    }

    static nodeType = UINodeType.Pop<UIMask, number, number>(
        APP,
        {
            prefabPath: `UIMask`,
            componentGetter: node => node.getComponent(UIMask),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<UIMask, number, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT
                        ],
                        propsFilter: (com, state, props) => {
                            com.btnMask.evterTouchEnd.On(() => {
                                jiang.mgrUI._listViewDisplay[jiang.mgrUI._maskIdx].tState.OnMaskTouch();
                            });
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForTemp200
        }
    );
}