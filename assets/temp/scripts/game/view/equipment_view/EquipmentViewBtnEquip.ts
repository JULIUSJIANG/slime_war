import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import TipsViewState from "../tips_view/TipsViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import EquipmentView from "./EquipmentView";
import EquipmentViewEquip from "./EquipmentViewEquip";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentViewBtnEquip`;

/**
 * 装备界面 - 装备按钮
 */
@ccclass
export default class EquipmentViewBtnEquip extends UIViewComponent {
    /**
     * 按钮 - 卸载
     */
    @property (ComponentNodeEventer)
    btnUnEquip: ComponentNodeEventer = null;

    /**
     * 按钮 - 装备
     */
    @property (ComponentNodeEventer)
    btnEquip: ComponentNodeEventer = null;

    /**
     * 文本 - 栏位
     */
    @property ([cc.Label])
    txtNum: Array<cc.Label> = [];

    /**
     * 容器 - 当前装备
     */
    @property (cc.Node)
    containerCurrentEquip: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentViewBtnEquip, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_backpack_prop_equipment_view_detail_app`,
            componentGetter: node => node.getComponent (EquipmentViewBtnEquip),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentViewBtnEquip, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            // 已装备的列表
                            let listCurrEquiped = jiang.mgrData.Get (indexDataStorageItem.listCurrentEquiped);

                            // 正在阅读的装备
                            let readEquip = state.stateEquip.statusEquipment.idCurrRead;
                            // 正在阅读的装备 - 槽位
                            let readEquipIdx = state.stateEquip.mapEquipedIdToNum.get (readEquip);

                            // 当前槽位装备
                            let currEquip = listCurrEquiped[props];
                            // 当前槽位装备 - 槽位
                            let currEquipIdx = props;

                            // 该装备所在栏位为当前栏位，那么可以卸载
                            com.btnUnEquip.node.active = readEquipIdx == props;
                            com.btnUnEquip.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnUnEquip.evterTouchEnd.On (() => {
                                // 有效装备唯一，不可卸载
                                if (listCurrEquiped.map ((val) => val != 0).length == 1) {
                                    TipsViewState.inst.Tip (`不可卸载唯一装备！`);
                                    return;
                                };
                                listCurrEquiped[readEquipIdx] = 0;
                                indexDataStorageItem.listCurrentEquiped.media.onSet ();
                                jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
                            });
                            // 该装备所在栏位不为当前栏位，那么可以装备
                            com.btnEquip.node.active = readEquipIdx != props;
                            com.btnEquip.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnEquip.evterTouchEnd.On (() => {
                                // 阅读装备没有装配在任何位置，那么直接占领该位置
                                if (readEquipIdx == null) {
                                    listCurrEquiped [currEquipIdx] = readEquip;
                                }
                                // 否则，2 个位置的数据对调
                                else {
                                    listCurrEquiped [readEquipIdx] = currEquip;
                                    listCurrEquiped [currEquipIdx]  = readEquip;
                                };
                                indexDataStorageItem.listCurrentEquiped.media.onSet ();
                                // 刷新画面
                                jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
                            });
                            for (let i = 0; i < com.txtNum.length; i++) {
                                com.txtNum [i].string = `${props + 1}`;
                            };
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentViewBtnEquip, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCOm) => {
                            return tCOm.containerCurrentEquip;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let listCurrEquip = jiang.mgrData.Get (indexDataStorageItem.listCurrentEquiped);
                            let currEquiped = listCurrEquip [props];
                            // 该位置尚未装配
                            if (currEquiped == null || currEquiped == 0) {
                                return;
                            };
                            // 否则提示该栏位装备内容
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconPlayView (
                                    currEquiped
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
    );
}