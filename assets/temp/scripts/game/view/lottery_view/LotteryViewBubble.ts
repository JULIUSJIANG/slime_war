import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import CfgLottery from "../../../frame/config/src/CfgLottery";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import IndexViewState from "../index_view/IndexViewState";


const {ccclass, property} = cc._decorator;

const APP = `LotteryViewBubble`;

/**
 * 位置半径
 */
const POS_RADIUS = 200;

/**
 * 乐透界面 - 气泡
 */
@ccclass
export default class LotteryViewBubble extends UIViewComponent {
    /**
     * 容器 - 物品
     */
    @property (cc.Node)
    containerProp: cc.Node = null;

    static nodeType = UINodeType.Pop <LotteryViewBubble, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lottery_view_bubble`,
            componentGetter: node => node.getComponent (LotteryViewBubble),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<LotteryViewBubble, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_LOTTO
                        ],
                        propsFilter: (com, state, props) => {
                            let data = state.stateLottery.listBubbleData [props];
                            com.node.x = Math.cos (data.angle) * data.rate * POS_RADIUS;
                            com.node.y = Math.sin (data.angle) * data.rate * POS_RADIUS;
                            let rateOpacity = 1.0 - Math.abs (data.rate - 0.5) / 0.5;
                            rateOpacity = Math.pow (rateOpacity, 0.5);
                            com.node.opacity = 255 * rateOpacity;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<LotteryViewBubble, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerProp;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let data = state.stateLottery.listBubbleData [props];
                            let cfgLottery = jiang.mgrCfg.cfgLottery.select (CfgLottery.idGetter, data.idLottery)._list [0];
                            let rs = GameCfgBodyCacheDropRS.mapCodeToRS.get (cfgLottery.item_type);
                            rs.onBubleDisplay (state, listNode, cfgLottery.item_id);
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.none
        }
    );
}