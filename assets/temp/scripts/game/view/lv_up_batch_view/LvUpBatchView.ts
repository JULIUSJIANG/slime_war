import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import utilMath from "../../../frame/basic/UtilMath";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import DefineVoice from "../../game_element/body/DefineVoice";
import LotteryTipsView from "../lottery_view/LotteryTipsView";
import LotteryTipsViewState from "../lottery_view/LotteryTipsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import LvUpBatchViewItem from "./LvUpBatchViewItem";
import LvUpBatchViewState from "./LvUpBatchViewState";

const {ccclass, property} = cc._decorator;

const APP = `LvUpBatchView`;

/**
 * 批量强化界面
 */
@ccclass
export default class LvUpBatchView extends UIViewComponent {
    /**
     * 主容器
     */
    @property (cc.Node)
    container: cc.Node = null;

    /**
     * 按钮 - 强化
     */
    @property (ComponentNodeEventer)
    btnStrengthen: ComponentNodeEventer = null;
    /**
     * 文本 - 当前金币拥有量
     */
    @property (cc.Label)
    txtCurrent: cc.Label = null;
    /**
     * 文本 - 当前金币消耗量 - 且可用
     */
    @property (cc.Label)
    txtCostEnable: cc.Label = null;
    /**
     * 文本 - 当前金币消耗量 - 且不可用
     */
    @property (cc.Label)
    txtCostDisable: cc.Label = null;

    /**
     * 按钮 - 问答
     */
    @property (ComponentNodeEventer)
    btnQa: ComponentNodeEventer = null;

    /**
     * 强化节点
     */
    @property (cc.Node)
    nodeStrengthen: cc.Node = null;

    static nodeType = UINodeType.Pop <LvUpBatchView, LvUpBatchViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lv_up_batch_view`,
            componentGetter: node => node.getComponent (LvUpBatchView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <LvUpBatchView, LvUpBatchViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_LOTTO
                        ],
                        propsFilter: (com, state, props) => {
                            com.container.width = state.containerWidth;
                            com.container.height = state.containerHeight;

                            com.txtCurrent.string = `${utilMath.ParseNumToKMBTAABB (state.recCoin.count, Math.floor)}`;
                            com.txtCostEnable.string = `${utilMath.ParseNumToKMBTAABB (state.countCost, Math.ceil)}`;
                            com.txtCostEnable.node.active = state.countCost <= state.recCoin.count;
                            com.txtCostDisable.string = `${utilMath.ParseNumToKMBTAABB (state.countCost, Math.ceil)}`;
                            com.txtCostDisable.node.active = state.recCoin.count < state.countCost;
                            com.btnStrengthen.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (DefineVoice.VOICE_MONEY);
                            });
                            com.btnStrengthen.evterTouchEnd.On (() => {
                                let moneyAble = state.countCost <= state.recCoin.count;
                                state.GetActionAble ()
                                    .then ((resp) => {
                                        if (!resp) {
                                            return;
                                        };
                                        // 通过观看视频的话，组件不用淡出了
                                        if (!moneyAble) {
                                            state.touchMachine.Enter (state.touchMachine.status2FlashIn);
                                            return;
                                        };
                                        state.touchMachine.Enter (state.touchMachine.status6TipsOut);
                                    })
                            });
                            com.btnQa.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.btnQa.evterTouchEnd.On (() => {
                                jiang.mgrUI.Open (
                                    LotteryTipsView.nodeType,
                                    LotteryTipsViewState.Pop (APP)
                                );
                            });
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop <LvUpBatchView, LvUpBatchViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.LV_UP_BATCH_OPACITY
                        ],
                        propsFilter: (com, state, props) => {
                            com.nodeStrengthen.opacity = state.touchMachine.currStatus.GetNodeStrengthenOpacity () * 255;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <LvUpBatchView, LvUpBatchViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.container;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let listEquip = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
                            for (let i = 0; i < listEquip.length; i++) {
                                let listEquipI = listEquip [i];
                                listNode.push (LvUpBatchViewItem.nodeType.CreateNode (
                                    state,
                                    listEquipI.idCfg,
                                    listEquipI.idCfg
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForTemp200
        }
    )
}