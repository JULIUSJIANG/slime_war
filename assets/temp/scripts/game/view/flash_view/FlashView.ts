import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import FlashViewState from "./FlashViewState";

const {ccclass, property} = cc._decorator;

const APP = `FlashView`;

/**
 * 闪屏换场界面
 */
@ccclass
export default class FlashView extends UIViewComponent {
    /**
     * 节点 - 全屏漂白
     */
    @property (cc.Node)
    nodePureWhite: cc.Node = null;

    static nodeType = UINodeType.Pop<FlashView, FlashViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/flash_view`,
            componentGetter: node => node.getComponent (FlashView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <FlashView, FlashViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.FLASH
                        ],
                        propsFilter: (com, state, props) => {
                            com.nodePureWhite.opacity = state.animFlash.Get255 ();
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