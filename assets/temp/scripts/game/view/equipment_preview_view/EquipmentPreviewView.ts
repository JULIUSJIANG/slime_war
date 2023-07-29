import BCType from "../../../frame/basic/BCType";
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
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import EquipmentPreviewViewState from "./EquipmentPreviewViewState";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentView`;

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
 * 装备界面
 */
@ccclass
export default class EquipmentPreviewView extends UIViewComponent {
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
    containerEquip: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentPreviewView, EquipmentPreviewViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_reward_preview_view`,
            componentGetter: node => node.getComponent(EquipmentPreviewView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentPreviewView, EquipmentPreviewViewState, number> (
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
                            let cfg = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, state.idCfg)._list [0];
                            com.txtName.string = `${cfg.name}`;
                            com.txtInfo.string = cfg.info;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentPreviewView, EquipmentPreviewViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquip;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            listNode.push(
                                EquipmentViewEquip.GetNodeTypeForIconUI(
                                    state.idCfg
                                )
                                    .CreateNode(
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
            enterRS: UINodeInstEnterRS.scaleInForTemp200
        }
    );
}