import BCType from "../../../frame/basic/BCType";
import utilMath from "../../../frame/basic/UtilMath";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import EquipmentInstRS from "../../game_element/equipment/EquipmentInstRS";
import gameCommon from "../../GameCommon";
import gameMath from "../../GameMath";
import IndexViewState from "../index_view/IndexViewState";
import EquipmentViewBtnEquip from "./EquipmentViewBtnEquip";
import EquipmentViewEquip from "./EquipmentViewEquip";
import EquipmentViewItem from "./EquipmentViewItem";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentViewDetailEquip`;

/**
 * 尺寸
 */
const SIZE = 100;

/**
 * 间距
 */
const SPACE = 10;

/**
 * 每行元素个数
 */
const COUNT_PER_LINE = 5;

/**
 * 最小行数
 */
const COUNT_MIN_LINE = 5;

/**
 * 装备界面
 */
@ccclass
export default class EquipmentViewDetailEquip extends UIViewComponent {
    /**
     * 文本 - 伤害
     */
    @property(cc.Label)
    txtPropsAtk: cc.Label = null;

    /**
     * 文本 - 耗能
     */
    @property(cc.Label)
    txtPropsCost: cc.Label = null;

    /**
     * 文本 - 冷却
     */
    @property(cc.Label)
    txtCd: cc.Label = null;

    /**
     * 文本 - 速度
     */
    @property(cc.Label)
    txtDmgNextLevel: cc.Label = null;

    /**
     * 文本 -当前等级
     */
    @property(cc.Label)
    txtLvCurrent: cc.Label = null;

    /**
     * 文本 - 下一等级
     */
    @property(cc.Label)
    txtLvNext: cc.Label = null;

    /**
     * 文本 - 拥有的
     */
    @property(cc.Label)
    txtCountOwned: cc.Label = null;

    /**
     * 文本 - 需要消耗的
     */
    @property(cc.Label)
    txtCountNeed: cc.Label = null;

    /**
     * 图片 - 进度
     */
    @property(cc.Sprite)
    sprProgress: cc.Sprite = null;

    /**
     * 文本 - 信息
     */
    @property(cc.Label)
    txtInfo: cc.Label = null;

    /**
     * 用于表示初始宽度的节点
     */
    @property(cc.Node)
    nodeInitWidth: cc.Node = null;

    /**
     * 文本 - 名字
     */
    @property(cc.Label)
    txtName: cc.Label = null;

    /**
     * 容器 - 装配按钮
     */
    @property (cc.Node)
    containerBtnEquip: cc.Node = null;

    /**
     * 容器 - 当前读取内容
     */
    @property (cc.Node)
    containerCurrRead: cc.Node = null;

    /**
     * 初始宽度
     */
    initWidth: number;

    protected override onLoad(): void {
        this.initWidth = this.nodeInitWidth.width;
    }

    static nodeType = UINodeType.Pop<EquipmentViewDetailEquip, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_equipment_view_detail`,
            componentGetter: node => node.getComponent(EquipmentViewDetailEquip),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentViewDetailEquip, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            // 记录
                            let rec: indexDataStorageItem.EquipmentRecord = state.stateEquip.mapIdToEquipRec.get (state.stateEquip.statusEquipment.idCurrRead);
                            // 当前等级
                            let powerCurrent = gameMath.equip.ParseCountToPower (rec.count);
                            let powerCurrentLev = gameMath.ParsePowerToLev(powerCurrent);
                            let powerCurrentLevPower = gameMath.ParseLevToPower (powerCurrentLev);
                            // 下一等级
                            let levNext = powerCurrentLev + 1;
                            let levNextPower = gameMath.ParseLevToPower (levNext);

                            let cfg = jiang.mgrCfg.cfgEquipmentProps.select(CfgEquipmentProps.idGetter, rec.idCfg)._list[0];
                            com.txtPropsAtk.string = `伤害: ${utilMath.ParseNumToKMBTAABB(EquipmentInstRS.GetDisplayDmgByPower (cfg.id, powerCurrentLevPower), Math.floor)}`;
                            com.txtPropsCost.string = `消耗: ${EquipmentInstRS.GetDisplayCost (cfg.id)}`;
                            com.txtCd.string = `间隔: ${EquipmentInstRS.GetDisplaySpacing (cfg.id)} s`;
                            com.txtDmgNextLevel.string = `${utilMath.ParseNumToKMBTAABB(EquipmentInstRS.GetDisplayDmgByPower (cfg.id, levNextPower), Math.floor)}`;

                            let levelCurrentCount = gameMath.equip.ParsePowerToCount (powerCurrentLevPower);
                            let levelNextPower = gameMath.ParseLevToPower (levNext);
                            let levelNextPowerCount = gameMath.equip.ParsePowerToCount (levelNextPower);
                            com.txtLvCurrent.node.active = true;
                            com.txtLvNext.node.active = true;
                            com.txtLvCurrent.string = `${powerCurrentLev}级`;
                            com.txtLvNext.string = `${levNext}级`;
                            com.txtCountOwned.string = `${utilMath.ParseNumToKMBTAABB(rec.count - levelCurrentCount, Math.floor)}`;
                            com.txtCountNeed.string = `${utilMath.ParseNumToKMBTAABB(levelNextPowerCount - levelCurrentCount, Math.ceil)}`;
                            com.sprProgress.node.width = Math.floor (rec.count - levelCurrentCount) / Math.ceil (levelNextPowerCount - levelCurrentCount) * com.initWidth;
                            com.txtInfo.string = `${cfg.info}`;
                            com.txtName.string = `${cfg.name}`;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentViewDetailEquip, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBtnEquip;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.stateEquip.equipAbleCount; i++) {
                                listNode.push (EquipmentViewBtnEquip.nodeType.CreateNode (
                                    state,
                                    i,
                                    i
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<EquipmentViewDetailEquip, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerCurrRead;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            // 记录
                            let rec: indexDataStorageItem.EquipmentRecord = state.stateEquip.mapIdToEquipRec.get (state.stateEquip.statusEquipment.idCurrRead);
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI (
                                    rec.idCfg
                                )
                                    .CreateNode (
                                        state,
                                        1,
                                        rec.idCfg
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
    );
}