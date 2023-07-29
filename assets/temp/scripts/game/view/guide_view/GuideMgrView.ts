import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import GuideMgr from "./GuideMgr";

const {ccclass, property} = cc._decorator;

const APP = `GuideMgrView`;

const MAT_PROPERTY_CTX_WIDTH = `ctxWidth`;
const MAT_PROPERTY_CTX_HEIGHT = `ctxHeight`;

/**
 * 引导界面
 */
@ccclass
export default class GUideMgrView extends UIViewComponent {
    /**
     * 相机 - 引导
     */
    @property (cc.Camera)
    cameraGuide: cc.Camera = null;

    /**
     * 节点 - 遮罩
     */
    @property (cc.Node)
    nodeMask: cc.Node = null;

    /**
     * 文本 - 提示信息
     */
    @property (cc.Label)
    txtTips: cc.Label = null;

    protected update(dt: number): void {
        this.txtTips.getMaterial (0).setProperty (MAT_PROPERTY_CTX_WIDTH, this.txtTips.node.width);
        this.txtTips.getMaterial (0).setProperty (MAT_PROPERTY_CTX_HEIGHT, this.txtTips.node.height);
    }

    static nodeType: UINodeType <GUideMgrView, GuideMgr, number> = UINodeType.Pop (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/guide_mgr_view`,
            componentGetter: node => node.getComponent (GUideMgrView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <GUideMgrView, GuideMgr, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.GUIDE
                        ],
                        propsFilter: (com, state, props) => {
                            com.cameraGuide.node.active = state.currStatus.OnMaskDisplay ();
                            com.nodeMask.active = state.currStatus.OnMaskDisplay ();
                            if (state.guideTipsTxt == null) {
                                com.txtTips.node.active = false;
                            }
                            else {
                                com.txtTips.node.active = true;
                                com.txtTips.string = state.guideTipsTxt;
                                com.txtTips.node.x = state.guideTipsPosX;
                            };
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