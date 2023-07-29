import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
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
import EquipmentLvUpSumViewState from "./EquipmentLvUpSumViewState";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentLvUpSumViewItem`;

/**
 * 批量的装备升级界面 - 单个装备
 */
@ccclass
export default class EquipmentLvUpSumViewItem extends UIViewComponent {
    /**
     * 文本 - 等级
     */
    @property (cc.Label)
    txtLv: cc.Label = null;
    /**
     * 用于放置具体物品的容器
     */
    @property (cc.Node)
    container: cc.Node = null;
    /**
     * 按钮 - 详情
     */
    @property (ComponentNodeEventer)
    btnDetail: ComponentNodeEventer = null;

    static nodeType = UINodeType.Pop <EquipmentLvUpSumViewItem, EquipmentLvUpSumViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lv_up_sum_view_item`,
            componentGetter: node => node.getComponent (EquipmentLvUpSumViewItem),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <EquipmentLvUpSumViewItem, EquipmentLvUpSumViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.LV_UP_SUM
                        ],
                        propsFilter: (com, state, props) => {
                            let rec = state.mapIdCfgToRecord.get (props);
                            let lv = gameMath.ParsePowerToLev (gameMath.equip.ParseCountToPower (rec.count));
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
                                        rec.count
                                    )
                                );
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <EquipmentLvUpSumViewItem, EquipmentLvUpSumViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.container;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let rec = state.mapIdCfgToRecord.get (props);
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI (
                                    rec.idCfg
                                )
                                    .CreateNode (
                                        state,
                                        null,
                                        null
                                    )
                            )
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