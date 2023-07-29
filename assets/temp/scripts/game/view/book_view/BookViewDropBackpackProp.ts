import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import jiang from "../../../frame/global/Jiang";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import ViewState from "../../../frame/ui/ViewState";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import EquipmentViewBackpackProp from "../equipment_view/EquipmentViewBackpackProp";
import BackpackPropPreviewViewState from "../backpack_prop_preview_view/BackpackPropPreviewViewState";
import BackpackPropPreviewView from "../backpack_prop_preview_view/BackpackPropPreviewView";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import gameCommon from "../../GameCommon";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `BookViewDropBackpackProp`;

/**
 * 图鉴界面 - 样式 - 掉落 - 背包物品
 */
@ccclass
export default class BookViewDropBackpackProp extends UIViewComponent {
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
     * 索引 1: 装备的数量
     * 索引 2: 概率万分比
     */
    static nodeType = UINodeType.Pop<BookViewDropBackpackProp, ViewState, Array<number>> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/item_backpack_prop_book_view_drop`,
            componentGetter: node => node.getComponent(BookViewDropBackpackProp),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<BookViewDropBackpackProp, ViewState, Array<number>>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHALLENGE
                        ],
                        propsFilter: (com, state, props) => {
                            let propsIdCfgBackpackProp = props [0];
                            let propsCount = props [1];
                            let propsRate = props [2];
                            com.txtCount.string = `${Math.floor (propsCount)}`;
                            if (propsRate == 100) {
                                com.txtRate.string = `掉落`;
                            }
                            else {
                                com.txtRate.string = `${propsRate}% 掉落`;
                            };
                            com.btnWatchDrop.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnWatchDrop.evterTouchEnd.On(() => {
                                jiang.mgrUI.Open(
                                    BackpackPropPreviewView.nodeType,
                                    BackpackPropPreviewViewState.Pop(
                                        APP,
                                        propsIdCfgBackpackProp,
                                        propsCount
                                    )
                                );
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<BookViewDropBackpackProp, ViewState, Array<number>> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerDrop;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let propsIdCfgBackpackProp = props [0];
                            listNode.push (
                                EquipmentViewBackpackProp.GetNodeTypeForUI (
                                    propsIdCfgBackpackProp
                                )
                                    .CreateNode(
                                        state,
                                        propsIdCfgBackpackProp,
                                        propsIdCfgBackpackProp
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