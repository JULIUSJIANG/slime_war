import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import utilMath from "../../../frame/basic/UtilMath";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import DefineVoice from "../../game_element/body/DefineVoice";
import LotteryTipsView from "../lottery_view/LotteryTipsView";
import LotteryTipsViewState from "../lottery_view/LotteryTipsViewState";
import LotteryViewState from "../lottery_view/LotteryViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import EquipmentLvUpSumViewItem from "./EquipmentLvUpSumViewItem";
import EquipmentLvUpSumViewState from "./EquipmentLvUpSumViewState";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentLvUpSumView`;

/**
 * 批量的装备升级界面
 */
@ccclass
export default class EquipmentLvUpSumView extends UIViewComponent {
    /**
     * 主容器
     */
    @property (cc.Node)
    container: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentLvUpSumView, EquipmentLvUpSumViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lv_up_sum_view`,
            componentGetter: node => node.getComponent (EquipmentLvUpSumView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <EquipmentLvUpSumView, EquipmentLvUpSumViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.LV_UP_SUM
                        ],
                        propsFilter: (com, state, props) => {
                            com.container.width = state.containerWidth;
                            com.container.height = state.containerHeight;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <EquipmentLvUpSumView, EquipmentLvUpSumViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.container;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.listIdCfg.length; i++) {
                                let idCfg = state.listIdCfg [i];
                                listNode.push (EquipmentLvUpSumViewItem.nodeType.CreateNode (
                                    state,
                                    idCfg,
                                    idCfg
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    )
}