import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";

const APP = `EquipmentViewNodeSelect`;

const {ccclass, property} = cc._decorator;

/**
 * 装备界面的选择节点
 */
@ccclass
export default class EquipmentViewNodeSelect extends UIViewComponent {

    static nodeType = UINodeType.Pop <EquipmentViewNodeSelect, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/equipment_view_node_select`,
            componentGetter: node => node.getComponent (EquipmentViewNodeSelect),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentViewNodeSelect, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            let selectedIdx = state.stateEquip.currStatus.OnIdxGlobal ();
                            let ele = state.stateEquip.listShouldDisplayAll [selectedIdx];
                            state.stateEquip.layout.SetElePos (com.node, ele.idCfg);
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    )
}