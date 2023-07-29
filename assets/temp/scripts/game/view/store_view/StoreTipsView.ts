import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import StoreTipsViewState from "./StoreTipsViewState";

const {ccclass, property} = cc._decorator;

const APP = `StoreTipsView`;

/**
 * 商店规则界面
 */
@ccclass
export default class StoreTipsView extends UIViewComponent {

    static nodeType = UINodeType.Pop <StoreTipsView, StoreTipsViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/store_view_tips`,
            componentGetter: node => node.getComponent (StoreTipsView),
            listModuleStyle: [],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.scaleInForTemp200
        }
    )
}