import BCType from "../../../frame/basic/BCType";
import jiang from "../../../frame/global/Jiang";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import IndexViewState from "../index_view/IndexViewState";
import ChallengeSelectViewChapter from "./ChallengeSelectViewChapter";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import ChallengeSelectViewState from "./ChallengeSelectViewState";
import UIRoot from "../../../frame/ui/UIRoot";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import ChallengeSelectViewBgLeft from "./ChallengeSelectViewBgLeft";
import ChallengeSelectViewBgRight from "./ChallengeSelectViewBgRight";
import ChallengeSelectViewStateRS from "./ChallengeSelectViewStateRS";
import ChallengeSelectViewBook from "./ChallengeSelectViewBook";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import gameCommon from "../../GameCommon";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `ChallengeSelectView`;

/**
 * 挑战选择界面
 */
@ccclass
export default class ChallengeSelectView extends UIViewComponent {
    /**
     * 关卡 - 激活
     */
    @property (cc.Node)
    levelNodeActive: cc.Node = null;
    /**
     * 关卡 - 按钮 - 选择
     */
    @property (ComponentNodeEventer)
    levelBtnSelect: ComponentNodeEventer = null;
    /**
     * 关卡 - 滚动
     */
    @property(ComponentNodeEventer)
    levelScroll: ComponentNodeEventer = null;
    /**
     * 关卡 - 容器
     */
    @property(cc.Node)
    levelContainer: cc.Node = null;

    /**
     * 图鉴 - 激活
     */
    @property (cc.Node)
    bookNodeActive: cc.Node = null;
    /**
     * 图鉴 - 按钮 - 选择
     */
    @property (ComponentNodeEventer)
    bookBtnSelect: ComponentNodeEventer = null;
    /**
     * 图鉴 - 滚动视图
     */
    @property (ComponentNodeEventer)
    bookScroll: ComponentNodeEventer = null;
    /**
     * 图鉴 - 容器
     */
    @property (cc.Node)
    bookContainer: cc.Node = null;

    /**
     * 章节 - 滚动
     */
    @property(ComponentNodeEventer)
    chapterScroll: ComponentNodeEventer = null;
    /**
     * 章节 - 容器
     */
    @property(cc.Node)
    chapterContainer: cc.Node = null;

    /**
     * 容器 - 左背景
     */
    @property(cc.Node)
    containerBgLeft: cc.Node = null;

    /**
     * 容器 - 右背景
     */
    @property(cc.Node)
    containerBgRight: cc.Node = null;

    /**
     * 节点 - 标题
     */
    @property (cc.Node)
    nodeTitle: cc.Node = null;
    /**
     * 节点 - 周期
     */
    @property (cc.Node)
    nodeCycle: cc.Node = null;
    /**
     * 容器 - 周期
     */
    @property (cc.Node)
    containerCycle: cc.Node = null;

    static nodeType = UINodeType.Pop<ChallengeSelectView, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/challenge_select_view`,
            componentGetter: node => node.getComponent(ChallengeSelectView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHALLENGE
                        ],
                        propsFilter: (com, state, props) => {
                            let scrollAble = state.stateChallenge.scrollStop.currStatus.OnScrollAble();

                            com.chapterScroll.scroll.content.width = state.stateChallenge.chapterLayout.containerWidth;
                            com.chapterScroll.scroll.content.height = state.stateChallenge.chapterLayout.containerHeight;
                            com.chapterScroll.scroll.enabled = scrollAble;
                            com.chapterScroll.scroll.content.y = state.stateChallenge.chapterLayout.containerHeight - state.stateChallenge.chapterScrollViewY - ChallengeSelectViewState.CHAPTER_VIEW_HEIGHT;
                            com.chapterScroll.evterScrolling.On(() => {
                                state.stateChallenge.chapterScrollViewY = state.stateChallenge.chapterLayout.containerHeight - com.chapterScroll.scroll.content.y - ChallengeSelectViewState.CHAPTER_VIEW_HEIGHT;
                                state.stateChallenge.UpdateActiveChapter();
                                UIRoot.inst.update(0);
                            });

                            com.bookScroll.scroll.content.width = state.stateChallenge.bookLayout.containerWidth;
                            com.bookScroll.scroll.content.height = state.stateChallenge.bookLayout.containerHeight;
                            com.bookScroll.scroll.enabled = scrollAble;
                            com.bookScroll.scroll.content.y = state.stateChallenge.bookLayout.containerHeight - state.stateChallenge.bookScrollViewY - ChallengeSelectViewState.BOOK_VIEW_HEIGHT;
                            com.bookScroll.evterScrolling.On(() => {
                                state.stateChallenge.bookScrollViewY = state.stateChallenge.bookLayout.containerHeight - com.bookScroll.scroll.content.y - ChallengeSelectViewState.BOOK_VIEW_HEIGHT;
                                state.stateChallenge.UpdateActiveBook ();
                                UIRoot.inst.update(0);
                            });
                            

                            for (let i = 0; i < ChallengeSelectViewStateRS.listRS.length; i++) {
                                let rs = ChallengeSelectViewStateRS.listRS [i];
                                let nodeActive = rs.nodeActiveGetter (com);
                                let btnSelect = rs.btnSelectGetter (com);
                                let scroll = rs.scrollGetter (com);
                                nodeActive.active = state.stateChallenge.rsCurrent == rs;
                                scroll.node.active = state.stateChallenge.rsCurrent == rs;
                                if (state.stateChallenge.rsCurrent != rs) {
                                    btnSelect.evterTouchStart.On (() => {
                                        VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                        state.stateChallenge.rsCurrent = rs;
                                        jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_CHALLENGE);
                                    });
                                };
                            };

                            com.nodeTitle.active = true;
                            com.nodeCycle.active = false;
                            state.stateChallenge.scrollStop.currStatus.OnApply ();
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHILDREN_ABLE
                        ],
                        propsFilter: (com, state, props) => {
                            return;
                            com.chapterContainer.active =
                            com.levelContainer.active = 
                            com.bookContainer.active =
                            com.containerBgLeft.active =
                            com.containerBgRight.active = state.stateChallenge.childrenAble;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.bookContainer;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.stateChallenge.childrenAble) {
                                return;
                            };
                            if (state.stateChallenge.rsCurrent != ChallengeSelectViewStateRS.book) {
                                return;
                            };
                            for (let i = state.stateChallenge.bookLayout._recHorEnd; state.stateChallenge.bookLayout._recHorStart <= i; i--) {
                                let listCollection = state.stateChallenge.bookLayout.listColumn[i];
                                for (let j = state.stateChallenge.bookLayout._recVerEnd; state.stateChallenge.bookLayout._recVerStart <= j; j--) {
                                    let ele = listCollection.listEle[j];
                                    if (ele == null) {
                                        continue;
                                    };
                                    listNode.push (ChallengeSelectViewBook.nodeType.CreateNode (
                                        state,
                                        ele.id,
                                        ele.id
                                    ));
                                };
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerCycle;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            return;
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.chapterContainer;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.stateChallenge.childrenAble) {
                                return;
                            };
                            let nodeType = ChallengeSelectViewChapter.nodeType;
                            for (let i = state.stateChallenge.chapterLayout._recHorEnd; state.stateChallenge.chapterLayout._recHorStart <= i; i--) {
                                let listCollection = state.stateChallenge.chapterLayout.listColumn[i];
                                for (let j = state.stateChallenge.chapterLayout._recVerEnd; state.stateChallenge.chapterLayout._recVerStart <= j; j--) {
                                    let ele = listCollection.listEle[j];
                                    listNode.push(nodeType.CreateNode(
                                        state,
                                        ele.id,
                                        ele.id
                                    ));
                                };
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.levelContainer;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            return;
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBgLeft;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (state.stateChallenge.chapterPrevious != null && state.stateChallenge.chapterPrevious != jiang.mgrData.Get (indexDataStorageItem.selectedChapter)) {
                                listNode.push(
                                    ChallengeSelectViewBgLeft.GetNodeTypeByIdCfg (state.stateChallenge.chapterPrevious)
                                        .CreateNode(
                                            state,
                                            state.stateChallenge.chapterPrevious,
                                            state.stateChallenge.chapterPrevious
                                        )
                                );
                            };

                            let idChapter = jiang.mgrData.Get (indexDataStorageItem.selectedChapter);
                            listNode.push(
                                ChallengeSelectViewBgLeft.GetNodeTypeByIdCfg (jiang.mgrData.Get (indexDataStorageItem.selectedChapter))
                                    .CreateNode(
                                        state,
                                        idChapter,
                                        idChapter
                                    )
                            );
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<ChallengeSelectView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBgRight;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (state.stateChallenge.chapterPrevious != null && state.stateChallenge.chapterPrevious != jiang.mgrData.Get (indexDataStorageItem.selectedChapter)) {
                                listNode.push(
                                    ChallengeSelectViewBgRight.GetNodeTypeByIdCfg (state.stateChallenge.chapterPrevious)
                                        .CreateNode(
                                            state,
                                            state.stateChallenge.chapterPrevious,
                                            state.stateChallenge.chapterPrevious
                                        )
                                );
                            };

                            let idChapter = jiang.mgrData.Get (indexDataStorageItem.selectedChapter);
                            listNode.push(
                                ChallengeSelectViewBgRight.GetNodeTypeByIdCfg (jiang.mgrData.Get (indexDataStorageItem.selectedChapter))
                                    .CreateNode(
                                        state,
                                        idChapter,
                                        idChapter
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