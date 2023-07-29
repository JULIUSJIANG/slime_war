import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIRoot from "../../../frame/ui/UIRoot";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import EquipmentViewItem from "./EquipmentViewItem";
import EquipmentViewItemBackpackProp from "./EquipmentViewItemBackpackProp";
import EquipmentViewNodeSelect from "./EquipmentViewNodeSelect";
import EquipmentViewState from "./EquipmentViewState";

const {ccclass, property} = cc._decorator;

const APP = `EquipmentView`;

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
export default class EquipmentView extends UIViewComponent {
    /**
     * 容器 - 格子
     */
    @property (cc.Node)
    containerGrid: cc.Node = null;

    /**
     * 容器 - 细节
     */
    @property (cc.Node)
    containerDetail: cc.Node = null;

    /**
     * 滚动视图
     */
    @property (ComponentNodeEventer)
    scroll: ComponentNodeEventer = null;

    /**
     * 容器 - 选择节点
     */
    @property (cc.Node)
    containerNodeSelect: cc.Node = null;

    /**
     * 节点 - 平铺的背景
     */
    @property (cc.Node)
    nodeBgTiled: cc.Node = null;

    static nodeType = UINodeType.Pop<EquipmentView, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/equipment_view`,
            componentGetter: node => node.getComponent(EquipmentView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<EquipmentView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_EQUIP
                        ],
                        propsFilter: (com, state, props) => {
                            com.scroll.scroll.content.width = state.stateEquip.layout.containerWidth;
                            com.scroll.scroll.content.height = state.stateEquip.layout.containerHeight;
                            com.scroll.scroll.enabled = state.stateEquip.scrollEnable;
                            com.scroll.scroll.content.y = state.stateEquip.layout.containerHeight - state.stateEquip.scrollY - EquipmentViewState.VIEW_HEIGHT;
                            com.scroll.evterScrolling.On (() => {
                                state.stateEquip.scrollY = state.stateEquip.layout.containerHeight - com.scroll.scroll.content.y - EquipmentViewState.VIEW_HEIGHT;
                                state.stateEquip.UpdateActive ();
                                UIRoot.inst.update (0);
                            });
                            com.nodeBgTiled.width = state.stateEquip.layout.containerWidth;
                            com.nodeBgTiled.height = Math.max (state.stateEquip.layout.containerHeight, EquipmentViewState.PADDING * 2.0 + 5 * (EquipmentViewState.ITEM_HEIGHT + EquipmentViewState.SPACING) - EquipmentViewState.SPACING);
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop<EquipmentView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHILDREN_ABLE
                        ],
                        propsFilter: (com, state, props) => {
                            return;
                            com.containerDetail.active =
                            com.containerGrid.active =
                            com.containerNodeSelect.active = state.stateEquip.childrenAble;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<EquipmentView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerDetail;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            state.stateEquip.currStatus.OnChildren (state, listNode);
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<EquipmentView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerGrid;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.stateEquip.childrenAble) {
                                return;
                            };
                            let layout = state.stateEquip.layout;
                            for (let i = layout._recVerEnd; layout._recHorStart <= i; i--) {
                                let listCollection = layout.listRow [i];
                                for (let j = layout._recHorStart; j <= layout._recHorEnd; j++) {
                                    let ele = listCollection.listEle [j];
                                    if (ele == null) {
                                        continue;
                                    };
                                    let rec = state.stateEquip.mapIdToRec.get (ele.id);
                                    rec.rs.onEquipmentViewDisplay (state, listNode, rec.idCfg);
                                };
                            };
                            // for (let i = layout._recHorStart; i <= layout._recHorEnd; i++) {
                            //     let listCollection = layout.listColumn [i];
                            //     for (let j = layout._recVerStart; j <= layout._recVerEnd; j++) {
                            //         let ele = listCollection.listEle [j];
                            //         if (ele == null) {
                            //             continue;
                            //         };
                            //         let rec = state.stateEquip.mapIdToRec.get (ele.id);
                            //         rec.rs.onEquipmentViewDisplay (state, listNode, rec.idCfg);
                            //     };
                            // };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<EquipmentView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerNodeSelect;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.stateEquip.childrenAble) {
                                return;
                            };
                            listNode.push (
                                EquipmentViewNodeSelect.nodeType.CreateNode (
                                    state,
                                    0,
                                    0
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