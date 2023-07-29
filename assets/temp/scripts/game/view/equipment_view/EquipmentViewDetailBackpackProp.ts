import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import EquipmentViewBackpackProp from "./EquipmentViewBackpackProp";
import EquipmentViewDetailEquip from "./EquipmentViewDetailEquip";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentViewDetailBackpackProp`;

/**
 * 背包物品的详情
 */
@ccclass
export default class EquipmentViewDetailBackpackProp extends UIViewComponent {
    /**
     * 文本 - 名字
     */
    @property (cc.Label)
    txtName: cc.Label = null;
    /**
     * 富文本 - 信息介绍
     */
    @property (cc.Label)
    txtInfo: cc.Label = null;

    /**
     * 容器 - 样板
     */
    @property (cc.Node)
    containerTemp: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentViewDetailBackpackProp, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_backpack_prop_equipment_view_detail`,
            componentGetter: node => node.getComponent (EquipmentViewDetailBackpackProp),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentViewDetailBackpackProp, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            let rec = state.stateEquip.mapIdToBackpackPropRec.get (state.stateEquip.statusBackpackProp.idCurrRead);
                            let cfg = jiang.mgrCfg.cfgBackpackProp.select(CfgBackpackProp.idGetter, rec.idCfg)._list [0];
                            com.txtName.string = cfg.name;
                            com.txtInfo.string = cfg.txt_info;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentViewDetailBackpackProp, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerTemp;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let rec = state.stateEquip.mapIdToBackpackPropRec.get (state.stateEquip.statusBackpackProp.idCurrRead);
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
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    )
}