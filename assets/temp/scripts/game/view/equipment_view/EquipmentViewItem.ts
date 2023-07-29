import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import IndexViewState from "../index_view/IndexViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import EquipmentViewEquip from "./EquipmentViewEquip";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentViewItem`;

/**
 * 装备界面 - 具体装备
 */
@ccclass
export default class EquipmentViewItem extends UIViewComponent {
    /**
     * 按钮 - 选择
     */
    @property(ComponentNodeEventer)
    btnSelect: ComponentNodeEventer = null;

    /**
     * 容器 - 装备
     */
    @property(cc.Node)
    containerEquipment: cc.Node = null;

    /**
     * 文本 - 等级
     */
    @property (cc.Label)
    txtLv: cc.Label = null;

    /**
     * 节点 - 已装备
     */
    @property (cc.Node)
    nodeEquip: cc.Node = null;
    /**
     * 文本 - 装备
     */
    @property (cc.Label)
    txtEquip: cc.Label = null;

    /**
     * 节点 - 新
     */
    @property (cc.Node)
    nodeFresh: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentViewItem, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_equipment_view`,
            componentGetter: node => node.getComponent(EquipmentViewItem),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentViewItem, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            state.stateEquip.layout.SetElePos (com.node, props);
                            let rec: indexDataStorageItem.EquipmentRecord = state.stateEquip.mapIdToEquipRec.get (props);
                            // 当前等级
                            let powerCurrent = gameMath.equip.ParseCountToPower (rec.count);
                            let powerCurrentLevel = gameMath.ParsePowerToLev (powerCurrent);
                            // 下一等级
                            let levNext = powerCurrentLevel + 1;
                            let cfg = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, rec.idCfg)._list [0];
                            if (state.stateEquip.statusEquipment != state.stateEquip.currStatus || state.stateEquip.statusEquipment.idCurrRead != rec.idCfg) {
                                com.btnSelect.evterTouchEnd.On(() => {
                                    VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                    rec.isRead = true;
                                    indexDataStorageItem.listEquipment.media.onSet ();
                                    state.stateEquip.currStatus.OnEquipment (rec.idCfg);
                                    jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
                                    jiang.mgrUI.ModuleRefresh (IndexDataModule.RED_DOT);
                                });
                            };
                            com.txtLv.string = `${powerCurrentLevel}级`;
                            com.nodeFresh.active = !rec.isRead;
                            com.nodeEquip.active = state.stateEquip.mapEquipedIdToNum.has (rec.idCfg);
                            if (com.nodeEquip.active) {
                                com.txtEquip.string = `E${state.stateEquip.mapEquipedIdToNum.get (rec.idCfg) + 1}`;
                            };
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentViewItem, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipment;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let rec: indexDataStorageItem.EquipmentRecord = state.stateEquip.mapIdToEquipRec.get (props);
                            listNode.push(
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
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.opacityInForPrefab200
        }
    );
}