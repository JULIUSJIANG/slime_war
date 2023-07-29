import Layout from "../../../frame/basic/layout/Layout";
import LayoutAlignmentHorCenter from "../../../frame/basic/layout/LayoutAlignmentHorCenter";
import LayoutAlignmentVerMiddle from "../../../frame/basic/layout/LayoutAlignmentVerMiddle";
import LayoutConstraintColumn from "../../../frame/basic/layout/LayoutConstraintColumn";
import LayoutStartAxisVer from "../../../frame/basic/layout/LayoutStartAxisVer";
import LayoutStartCornerHorLeft from "../../../frame/basic/layout/LayoutStartCornerHorLeft";
import LayoutStartCornerVerUpper from "../../../frame/basic/layout/LayoutStartCornerVerUpper";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import jiang from "../../../frame/global/Jiang";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import CfgCacheChapter from "../../cfg_cache/CfgCacheChapter";
import ScrollStop from "../../game_element/common/ScrollStop";
import ChallengeSelectViewStateRS from "./ChallengeSelectViewStateRS";

const APP = `ChallengeSelectViewState`;

class ChallengeSelectViewState {
    /**
     * 垂直滚动
     */
    scrollEnable = false;

    /**
     * 生成子节点许可
     */
    childrenAble: boolean = false;

    /**
     * 章节 - 排版
     */
    chapterLayout: Layout;
    /**
     * 章节 - y 坐标
     */
    chapterScrollViewY: number;

    /**
     * 图鉴 - 排版
     */
    bookLayout: Layout;
    /**
     * 图鉴 - y 坐标
     */
    bookScrollViewY: number;

    /**
     * 当前的策略
     */
    rsCurrent: ChallengeSelectViewStateRS = ChallengeSelectViewStateRS.book;

    /**
     * 滚动停止器
     */
    scrollStop: ScrollStop;

    /**
     * 当前挑战的章节
     */
    challengeChapter: number;

    private constructor () {
        this.challengeChapter = CfgCacheChapter.GetChallengeChapter ();
        this.scrollStop = ScrollStop.Pop (APP, IndexDataModule.INDEXVIEW_CHALLENGE);
        this.chapterLayout = Layout.Pop(
            APP,

            {
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,

                spacingColumn: ChallengeSelectViewState.CHAPTER_SPACING,
                spacingRow: ChallengeSelectViewState.CHAPTER_SPACING,

                defSizeWidth: 0,
                defSizeHeight: 0,

                startCornerHor: LayoutStartCornerHorLeft.inst,
                startCornerVer: LayoutStartCornerVerUpper.inst,

                startAxis: LayoutStartAxisVer.inst,

                constraint: LayoutConstraintColumn.one,

                alignmentHor: LayoutAlignmentHorCenter.inst,
                alignmentVer: LayoutAlignmentVerMiddle.inst
            }
        );
        for (let i = 0; i < jiang.mgrCfg.cfgChapter._list.length; i++) {
            let cfg = jiang.mgrCfg.cfgChapter._list [i];
            this.chapterLayout.Create(
                ChallengeSelectViewState.CHAPTER_ITEM_WIDTH,
                ChallengeSelectViewState.CHAPTER_ITEM_HEIGHT,

                cfg.id
            );
        };
        this.chapterLayout.UpdatePos();

        this.bookLayout = Layout.Pop (
            APP,

            {
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,

                spacingColumn: ChallengeSelectViewState.BOOK_SPACING,
                spacingRow: ChallengeSelectViewState.BOOK_SPACING,

                defSizeWidth: 0,
                defSizeHeight: 0,

                startCornerHor: LayoutStartCornerHorLeft.inst,
                startCornerVer: LayoutStartCornerVerUpper.inst,

                startAxis: LayoutStartAxisVer.inst,

                constraint: LayoutConstraintColumn.one,

                alignmentHor: LayoutAlignmentHorCenter.inst,
                alignmentVer: LayoutAlignmentVerMiddle.inst
            }
        );

        this.SelectChapter(jiang.mgrData.Get(indexDataStorageItem.selectedChapter));
    }

    /**
     * 刷新激活性 - 章节
     */
    UpdateActiveChapter () {
        this.chapterLayout.UpdateActive(
            0,
            this.chapterScrollViewY,
            ChallengeSelectViewState.CHAPTER_VIEW_WIDTH,
            ChallengeSelectViewState.CHAPTER_VIEW_HEIGHT
        );
        jiang.mgrUI.ModuleRefresh (IndexDataModule.RELOAD);
    }

    /**
     * 刷新激活性 - 图鉴
     */
    UpdateActiveBook () {
        this.bookLayout.UpdateActive (
            0,
            this.bookScrollViewY,
            ChallengeSelectViewState.BOOK_VIEW_WIDTH,
            ChallengeSelectViewState.BOOK_VIEW_HEIGHT
        );
        jiang.mgrUI.ModuleRefresh (IndexDataModule.RELOAD);
    }

    private static _t = new UtilObjPoolType<ChallengeSelectViewState>({
        instantiate: () => {
            return new ChallengeSelectViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });
    
    static Pop (apply: string) {
        return UtilObjPool.Pop(ChallengeSelectViewState._t, apply);
    }

    /**
     * 先前的章节配表 id
     */
    chapterPrevious: number;

    /**
     * 选择小节
     * @param idChapter 
     */
    SelectChapter (idChapter: number) {
        this.chapterPrevious = jiang.mgrData.Get(indexDataStorageItem.selectedChapter);
        jiang.mgrData.Set(indexDataStorageItem.selectedChapter, idChapter);

        let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, idChapter)._list [0];
        let recChapter = CfgCacheChapter.GetCache (cfgChapter);

        this.bookLayout.Clear ();
        for (let i = 0; i < recChapter.listMonsterSortByIdCfg.length; i++) {
            this.bookLayout.Create (
                ChallengeSelectViewState.BOOK_VIEW_ITEM_WIDTH,
                ChallengeSelectViewState.BOOK_VIEW_ITEM_HEIGHT,

                recChapter.listMonsterSortByIdCfg[i]
            );
        };
        this.bookLayout.UpdatePos ();
        this.bookScrollViewY = this.bookLayout.containerHeight - ChallengeSelectViewState.BOOK_VIEW_HEIGHT;
        this.bookLayout.UpdateActive (
            0,
            this.bookScrollViewY,
            ChallengeSelectViewState.BOOK_VIEW_WIDTH,
            ChallengeSelectViewState.BOOK_VIEW_HEIGHT
        );
        this.scrollStop.currStatus.OnStop ();
        jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_CHALLENGE);
    }
}

namespace ChallengeSelectViewState {
    /**
     * 章节 - 视图 - 宽度
     */
    export const CHAPTER_VIEW_WIDTH = 290;
    /**
     * 章节 - 视图 - 高度
     */
    export const CHAPTER_VIEW_HEIGHT = 446.28;
    /**
     * 章节 - 间距
     */
    export const CHAPTER_SPACING = 10;
    /**
     * 章节 - 单元 - 宽度
     */
    export const CHAPTER_ITEM_WIDTH = 290;
    /**
     * 章节 - 单元 - 高度
     */
    export const CHAPTER_ITEM_HEIGHT = 70;

    /**
     * 关卡 - 视图 - 宽度
     */
    export const LEVEL_VIEW_WIDTH = 520;
    /**
     * 关卡 - 视图 - 高度
     */
    export const LEVEL_VIEW_HEIGHT = 446.28;
    /**
     * 关卡 - 间距
     */
    export const LEVEL_SPACING = 10;
    /**
     * 关卡 - 单元 - 宽度
     */
    export const LEVEL_ITEM_WIDTH = 255;
    /**
     * 关卡 - 单元 - 高度
     */
    export const LEVEL_ITEM_HEIGHT = 70;

    /**
     * 图鉴 - 宽
     */
    export const BOOK_VIEW_WIDTH = 520;
    /**
     * 图鉴 - 高
     */
    export const BOOK_VIEW_HEIGHT = 446.28;
    /**
     * 图鉴 - 间距
     */
    export const BOOK_SPACING = 10;
    /**
     * 图鉴 - 宽
     */
    export const BOOK_VIEW_ITEM_WIDTH = 520;
    /**
     * 图鉴 - 高
     */
    export const BOOK_VIEW_ITEM_HEIGHT = 184.24;
}

export default ChallengeSelectViewState;