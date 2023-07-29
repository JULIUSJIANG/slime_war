import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import jiang from "../../../frame/global/Jiang";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import EquipmentPreviewView from "../equipment_preview_view/EquipmentPreviewView";
import EquipmentPreviewViewState from "../equipment_preview_view/EquipmentPreviewViewState";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import ViewState from "../../../frame/ui/ViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import gameCommon from "../../GameCommon";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `BookViewDropEquipment`;

/**
 * 图鉴界面 - 样式 - 掉落 - 武器
 */
@ccclass
export default class BookViewDropEquipment extends UIViewComponent {
    /**
     * 容器 - 掉落物
     */
    @property(cc.Node)
    containerDrop: cc.Node = null;
    /**
     * 文本 - 掉落物名称
     */
    @property(cc.Label)
    txtCount: cc.Label = null;
    /**
     * 文本 - 概率
     */
    @property(cc.Label)
    txtRate: cc.Label = null;
    /**
     * 按钮 - 查看掉落物详情
     */
    @property (ComponentNodeEventer)
    btnWatchDrop: ComponentNodeEventer = null;

    /**
     * 索引 0: 装备的配表 id
     * 索引 1: 装备的等级
     * 索引 2: 装备的数量
     * 索引 3: 概率万分比
     */
    static nodeType = UINodeType.Pop<BookViewDropEquipment, ViewState, Array<number>> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_equipment_book_view_drop`,
            componentGetter: node => node.getComponent(BookViewDropEquipment),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<BookViewDropEquipment, ViewState, Array<number>>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHALLENGE
                        ],
                        propsFilter: (com, state, props) => {
                            let propsIdCfgEquipment = props [0];
                            let propsCount = props [1];
                            let propsRate = props [2];

                            com.txtCount.string = `${Math.floor (propsCount)}`;
                            com.txtRate.string = `${propsRate}% 掉落`;
                            com.btnWatchDrop.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnWatchDrop.evterTouchEnd.On(() => {
                                jiang.mgrUI.Open(
                                    EquipmentPreviewView.nodeType,
                                    EquipmentPreviewViewState.Pop(
                                        APP,
                                        propsIdCfgEquipment,
                                        propsCount
                                    )
                                );
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<BookViewDropEquipment, ViewState, Array<number>> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerDrop;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let propsIdCfgEquipment = props [0];
                            listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconUI(
                                    propsIdCfgEquipment
                                )
                                    .CreateNode(
                                        state,
                                        null,
                                        propsIdCfgEquipment
                                    )
                            );
                        }
                    }
                ),

            ],
            propsType: BCType.typeArray,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.none
        }
    )
}