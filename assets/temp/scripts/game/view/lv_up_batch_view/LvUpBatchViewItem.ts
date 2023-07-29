import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import EquipmentPreviewView from "../equipment_preview_view/EquipmentPreviewView";
import EquipmentPreviewViewState from "../equipment_preview_view/EquipmentPreviewViewState";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import LvUpBatchViewState from "./LvUpBatchViewState";

const {ccclass, property} = cc._decorator;

const APP = `LvUpBatchViewItem`;

/**
 * 批量升级界面 - 单元
 */
@ccclass
export default class LvUpBatchViewItem extends UIViewComponent {

    /**
     * 文本 - 当前等级
     */
    @property (cc.Label)
    txtLv: cc.Label = null;
    /**
     * 容器 - 武器实例
     */
    @property (cc.Node)
    container: cc.Node = null;
    /**
     * 按钮 - 详情
     */
    @property (ComponentNodeEventer)
    btnDetail: ComponentNodeEventer = null;

    /**
     * 节点 - 准星提示
     */
    @property (cc.Node)
    nodeGold: cc.Node = null;
    /**
     * 节点 - 升级专用
     */
    @property (cc.Node)
    nodeLvUp: cc.Node = null;
    /**
     * 节点 - 闪烁专用
     */
    @property (cc.Node)
    nodeFlash: cc.Node = null;

    static nodeType = UINodeType.Pop <LvUpBatchViewItem, LvUpBatchViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lv_up_batch_view_item`,
            componentGetter: node => node.getComponent (LvUpBatchViewItem),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <LvUpBatchViewItem, LvUpBatchViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_LOTTO
                        ],
                        propsFilter: (com, state, props) => {
                            let record = state.mapIdCfgToRecord.get (props);
                            let rec = state.mapIdCfgToRecord.get (props).data;
                            let lv = gameMath.ParsePowerToLev (gameMath.equip.ParseCountToPower (record.tempCount));
                            com.txtLv.string = `${lv}级`;
                            // 点击打开详情
                            com.btnDetail.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnDetail.evterTouchEnd.On(() => {
                                jiang.mgrUI.Open(
                                    EquipmentPreviewView.nodeType,
                                    EquipmentPreviewViewState.Pop(
                                        APP,
                                        rec.idCfg,
                                        record.tempCount
                                    )
                                );
                            });
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop <LvUpBatchViewItem, LvUpBatchViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.LV_UP_BATCH_OPACITY
                        ],
                        propsFilter: (com, state, props) => {
                            let record = state.mapIdCfgToRecord.get (props);
                            // 3 个状态提示，都为 0
                            if (!record.isLvUped) {
                                com.nodeGold.opacity = 0;
                                com.nodeLvUp.opacity = 0;
                                com.nodeFlash.opacity = 0;
                            }
                            else {
                                com.nodeGold.opacity = state.touchMachine.currStatus.GetNodeLvUpOpacity () * 255;
                                com.nodeLvUp.opacity = state.touchMachine.currStatus.GetNodeLvUpOpacity () * 255;
                                com.nodeFlash.opacity = state.touchMachine.currStatus.GetNodeFlashOpacity () * 255;
                            };
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop <LvUpBatchViewItem, LvUpBatchViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.LV_UP_BATCH_POS
                        ],
                        propsFilter: (com, state, props) => {
                            let record = state.mapIdCfgToRecord.get (props);

                            let tempIdxVer = Math.floor (record.tempIdx / state.countHor);
                            let tempIdxHor = record.tempIdx - tempIdxVer * state.countHor;
                            let tempX = tempIdxHor * (LvUpBatchViewState.ITEM_WIDTH + LvUpBatchViewState.SPACING_HOR);
                            let tempY = tempIdxVer * (LvUpBatchViewState.ITEM_HEIGHT + LvUpBatchViewState.SPACING_VER);

                            let lastIdxVer = Math.floor (record.idx / state.countHor);
                            let lastIdxHor = record.idx - lastIdxVer * state.countHor;
                            let lastX = lastIdxHor * (LvUpBatchViewState.ITEM_WIDTH + LvUpBatchViewState.SPACING_HOR);
                            let lastY = lastIdxVer * (LvUpBatchViewState.ITEM_HEIGHT + LvUpBatchViewState.SPACING_VER);

                            let rate = state.touchMachine.currStatus.GetSortRate ();
                            let x = (1 - rate) * tempX + rate * lastX;
                            let y = (1 - rate) * tempY + rate * lastY;
                            com.node.x = x - state.containerWidth / 2 + LvUpBatchViewState.ITEM_WIDTH / 2;
                            com.node.y = state.containerHeight / 2 - y - LvUpBatchViewState.ITEM_HEIGHT / 2;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <LvUpBatchViewItem, LvUpBatchViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.container;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let rec = state.mapIdCfgToRecord.get (props).data;
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI (
                                    rec.idCfg
                                )
                                    .CreateNode (
                                        state,
                                        null,
                                        null
                                    )
                            );
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