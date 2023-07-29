import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import CfgStore from "../../../frame/config/src/CfgStore";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIRoot from "../../../frame/ui/UIRoot";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import IndexViewState from "../index_view/IndexViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import StoreTipsView from "./StoreTipsView";
import StoreTipsViewState from "./StoreTipsViewState";
import StoreViewState from "./StoreViewState";

const {ccclass, property} = cc._decorator;

const APP = `StoreView`;

/**
 * 商店界面 - 样式
 */
@ccclass
export default class StoreView extends UIViewComponent {
    /**
     * 滚动视图
     */
    @property (ComponentNodeEventer)
    scroll: ComponentNodeEventer = null;

    /**
     * 容器 - 物品
     */
    @property (cc.Node)
    containerItem: cc.Node = null;

    /**
     * 按钮 - 规则
     */
    @property (ComponentNodeEventer)
    btnRegular: ComponentNodeEventer = null;

    /**
     * 背景- 平铺
     */
    @property (cc.Node)
    bgTiled: cc.Node = null;

    static nodeType = UINodeType.Pop <StoreView, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/store_view`,
            componentGetter: node => node.getComponent (StoreView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<StoreView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_STORE
                        ],
                        propsFilter: (com, state, props) => {
                            if (state.stateStore.recCoin == null) {
                                return;
                            };
                            com.scroll.scroll.content.width = state.stateStore.layout.containerWidth;
                            com.scroll.scroll.content.height = state.stateStore.layout.containerHeight;
                            com.scroll.scroll.enabled = state.stateStore.scrollEnable;
                            com.scroll.scroll.content.y = state.stateStore.layout.containerHeight - state.stateStore.scrollY - StoreViewState.VIEW_HEIGHT;
                            com.scroll.evterScrolling.On(() => {
                                state.stateStore.scrollY = state.stateStore.layout.containerHeight - com.scroll.scroll.content.y - StoreViewState.VIEW_HEIGHT;
                                state.stateStore.UpdateActive ();
                                UIRoot.inst.update(0);
                            });
                            com.btnRegular.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.btnRegular.evterTouchEnd.On (() => {
                                jiang.mgrUI.Open (
                                    StoreTipsView.nodeType,
                                    StoreTipsViewState.Pop (APP)
                                );
                            });
                            com.bgTiled.width = state.stateStore.layout.containerWidth;
                            com.bgTiled.height = Math.max (state.stateStore.layout.containerHeight, 3 * (StoreViewState.ITEM_HEIGHT + StoreViewState.SPACING_VER) - StoreViewState.SPACING_VER);
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop<StoreView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHILDREN_ABLE
                        ],
                        propsFilter: (com, state, props) => {
                            return;
                            com.containerItem.active = state.stateStore.childrenAble;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<StoreView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerItem;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.stateStore.childrenAble) {
                                return;
                            };
                            let layout = state.stateStore.layout;
                            for (let i = layout._recHorStart; i <= layout._recHorEnd; i++) {
                                let listCollection = layout.listColumn [i];
                                for (let j = layout._recVerStart; j <= layout._recVerEnd; j++) {
                                    let ele = listCollection.listEle[j];
                                    if (ele == null) {
                                        continue;
                                    };
                                    let cfg = jiang.mgrCfg.cfgStore.select (CfgStore.idGetter, ele.id)._list [0];
                                    let rs = GameCfgBodyCacheDropRS.mapCodeToRS.get (cfg.item_type);
                                    rs.onStoreDisplay (state, listNode, ele.id);
                                };
                            };
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