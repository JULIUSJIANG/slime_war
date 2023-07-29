import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import EquipmentInstRS from "../../game_element/equipment/EquipmentInstRS";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import EquipmentLvUpViewState from "./EquipmentLvUpViewState";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentLvUpView`;

/**
 * 装备升级界面
 */
@ccclass
export default class EquipmentLvUpView extends UIViewComponent {
    /**
     * 容器 - 左物品
     */
    @property (cc.Node)
    containerLeft: cc.Node = null;

    /**
     * 容器 - 右物品
     */
    @property (cc.Node)
    containerRight: cc.Node = null;

    /**
     * 文本 - 等级 - 左
     */
    @property (cc.Label)
    txtLvLeft: cc.Label = null;

    /**
     * 文本 - 等级 - 右
     */
    @property (cc.Label)
    txtLvRight: cc.Label = null;

    /**
     * 文本 - 伤害 - 左
     */
    @property (cc.Label)
    txtDmgLeft: cc.Label = null;

    /**
     * 文本 - 伤害 - 右
     */
    @property (cc.Label)
    txtDmgRight: cc.Label = null;

    static nodeType = UINodeType.Pop<EquipmentLvUpView, EquipmentLvUpViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_lv_up`,
            componentGetter: node => node.getComponent (EquipmentLvUpView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentLvUpView, EquipmentLvUpViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.LV_UP
                        ],
                        propsFilter: (com, state, props) => {
                            com.txtLvLeft.string = `${state.lvPassed}级`;
                            com.txtLvRight.string = `${state.lvCurrent}级`;
                            com.txtDmgLeft.string = `${EquipmentInstRS.GetDisplayDmgByPower (state.idCfg, gameMath.ParseLevToPower (state.lvPassed))}`;
                            com.txtDmgRight.string = `${EquipmentInstRS.GetDisplayDmgByPower (state.idCfg, gameMath.ParseLevToPower (state.lvCurrent))}`;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentLvUpView, EquipmentLvUpViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerLeft;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI(
                                    state.idCfg
                                )
                                    .CreateNode (
                                        state,
                                        null,
                                        state.idCfg
                                    )
                            );
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<EquipmentLvUpView, EquipmentLvUpViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerRight;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI(
                                    state.idCfg
                                )
                                    .CreateNode (
                                        state,
                                        null,
                                        state.idCfg
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