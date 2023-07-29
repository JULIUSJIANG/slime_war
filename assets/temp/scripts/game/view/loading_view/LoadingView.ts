import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import LoadingViewState from "./LoadingViewState";

const {ccclass, property} = cc._decorator;

const APP = `LoadingView`;

/**
 * 加载界面
 */
@ccclass
export default class LoadingView extends UIViewComponent {
    static nodeType = UINodeType.Pop<LoadingView, LoadingViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/loading_view`,
            componentGetter: node => node.getComponent (LoadingView),
            listModuleStyle: [],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForTemp200
        }
    )
}