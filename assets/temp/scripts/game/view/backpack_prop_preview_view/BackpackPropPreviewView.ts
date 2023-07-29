import BCType from "../../../frame/basic/BCType";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import gameCommon from "../../GameCommon";
import EquipmentView from "../equipment_view/EquipmentView";
import EquipmentViewBackpackProp from "../equipment_view/EquipmentViewBackpackProp";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import BackpackPropPreviewViewState from "./BackpackPropPreviewViewState";

const {ccclass, property} = cc._decorator;

const APP = `BackpackPropPreviewView`;

/**
 * 尺寸
 */
const SIZE = 50;

/**
 * 间距
 */
const SPACE = 10;

/**
 * 每行元素个数
 */
const COUNT_PER_LINE = 9;

/**
 * 最小行数
 */
const COUNT_MIN_LINE = 9;

/**
 * 装备界面 - 背包物品的预览
 */
@ccclass
export default class BackpackPropPreviewView extends UIViewComponent {
    /**
     * 文本 - 名字
     */
    @property (cc.Label)
    txtName: cc.Label = null;
    /**
     * 文本 - 信息
     */
    @property (cc.Label)
    txtInfo: cc.Label = null;
    /**
     * 容器 - 装备
     */
    @property (cc.Node)
    containerProp: cc.Node = null;

    static nodeType = UINodeType.Pop<BackpackPropPreviewView, BackpackPropPreviewViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_backpack_prop_reward_preview_view`,
            componentGetter: node => node.getComponent(BackpackPropPreviewView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<BackpackPropPreviewView, BackpackPropPreviewViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT
                        ],
                        propsFilter: (com, state, props) => {
                            let rec: indexDataStorageItem.EquipmentRecord;
                            for (let i = 0; i < jiang.mgrData.Get(indexDataStorageItem.listEquipment).length; i++) {
                                if (jiang.mgrData.Get(indexDataStorageItem.listEquipment)[i].idCfg != state.idCfg) {
                                    continue;
                                };
                                rec = jiang.mgrData.Get(indexDataStorageItem.listEquipment)[i];
                            };
                            let cfg = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, state.idCfg)._list [0];
                            com.txtName.string = `${cfg.name}`;
                            com.txtInfo.string = cfg.txt_info;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<BackpackPropPreviewView, BackpackPropPreviewViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerProp;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            listNode.push(
                                EquipmentViewBackpackProp.GetNodeTypeForUI (
                                    state.idCfg
                                )
                                    .CreateNode(
                                        state,
                                        state.idCfg,
                                        state.idCfg
                                    )
                            );
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.scaleInForTemp200
        }
    );
}