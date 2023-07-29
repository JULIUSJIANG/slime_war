import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import LotteryTipsViewState from "./LotteryTipsViewState";

const {ccclass, property} = cc._decorator;

const APP = `StoreTipsView`;

/**
 * 炼金规则界面
 */
@ccclass
export default class LotteryTipsView extends UIViewComponent {

    static nodeType = UINodeType.Pop <LotteryTipsView, LotteryTipsViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lottery_view_tips`,
            componentGetter: node => node.getComponent (LotteryTipsView),
            listModuleStyle: [],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForTemp200
        }
    )
}