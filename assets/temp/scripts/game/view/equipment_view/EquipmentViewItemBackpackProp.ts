import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import utilMath from "../../../frame/basic/UtilMath";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import EquipmentViewBackpackProp from "./EquipmentViewBackpackProp";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentViewItemBackpackProp`;

/**
 * 装备界面 - 背包物品
 */
@ccclass
export default class EquipmentViewItemBackpackProp extends UIViewComponent {
    /**
     * 按钮 - 选择
     */
    @property (ComponentNodeEventer)
    btnSelect: ComponentNodeEventer = null;

    /**
     * 容器 - 背包物品
     */
    @property (cc.Node)
    containerBackpackProp: cc.Node = null;

    /**
     * 节点 - 数量
     */
    @property (cc.Node)
    nodeCount: cc.Node = null;

    /**
     * 文本 - 数量
     */
    @property (cc.Label)
    txtCount: cc.Label = null;

    /**
     * 节点 - 新
     */
    @property (cc.Node)
    nodeFresh: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentViewItemBackpackProp, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_backpack_prop_equipment_view`,
            componentGetter: node => node.getComponent(EquipmentViewItemBackpackProp),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentViewItemBackpackProp, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            state.stateEquip.layout.SetElePos (com.node, props);
                            let rec = state.stateEquip.mapIdToBackpackPropRec.get (props);
                            let cfg = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, rec.idCfg)._list [0];
                            if (state.stateEquip.statusBackpackProp != state.stateEquip.currStatus || state.stateEquip.statusBackpackProp.idCurrRead != rec.idCfg) {
                                com.btnSelect.evterTouchEnd.On(() => {
                                    VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                    rec.isRead = true;
                                    indexDataStorageItem.listBackpackProp.media.onSet ();
                                    state.stateEquip.currStatus.OnBackpackProp (rec.idCfg);
                                    jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
                                    jiang.mgrUI.ModuleRefresh (IndexDataModule.RED_DOT);
                                });
                            };
                            let count = Math.floor(rec.count);
                            com.nodeCount.active = count != 1;
                            if (com.nodeCount.active) {
                                com.txtCount.string = `${utilMath.ParseNumToKMBTAABB (count, Math.floor)}`;
                            };
                            com.nodeFresh.active = !rec.isRead;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentViewItemBackpackProp, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBackpackProp;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let rec = state.stateEquip.mapIdToBackpackPropRec.get (props);
                            listNode.push (
                                EquipmentViewBackpackProp.GetNodeTypeForUI (
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
    )
}