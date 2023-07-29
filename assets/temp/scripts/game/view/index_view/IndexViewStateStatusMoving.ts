import IndexDataModule from "../../../IndexDataModule";
import IndexView from "../../../IndexView";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import MgrUI from "../../../frame/ui/MgrUI";
import IndexViewRS from "./IndexViewRS";
import IndexViewState from "./IndexViewState";
import IndexViewStateStatus from "./IndexViewStateStatus";

const APP = `IndexViewStateStatusMoving`;

/**
 * 每分页切换耗时
 */
const TOGGLE_MS_PER_PAGE = 100;

/**
 * 根界面游标状态管理 - 游标移动中
 */
export default class IndexViewStateStatusMoving extends IndexViewStateStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<IndexViewStateStatusMoving>({
        instantiate: () => {
            return new IndexViewStateStatusMoving ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: IndexViewState) {
        let val = UtilObjPool.Pop (IndexViewStateStatusMoving._t, apply);
        val.relMachine= machine;
        return val;
    }

    /**
     * 目标策略
     */
    public currRS: IndexViewRS = IndexViewRS.fightQuick;
    /**
     * 目标策略 - 索引
     */
    public currRSIdx: number;
    /**
     * 目标策略 - 索引 - y 坐标
     */
    public currRSIdxYTag: number;
    /**
     * 目标策略 - 索引 - y 坐标 - 页面
     */
    public currRSIdxYPage: number;

    /**
     * 时间 - 要等待的总的
     */
    private _msTotal: number;
    /**
     * 时间 - 累计的
     */
    private _msCount: number;

    public OnEnter(): void {
        this.currRSIdx = IndexViewRS.listInst.indexOf (this.currRS);
        this.currRSIdxYTag = IndexView.GetNodeBtnSelectedPos (this.currRSIdx);
        this.currRSIdxYPage = this.currRSIdx * MgrUI.FAT_WIDTH;
        this._msTotal = Math.abs (this.currRSIdx - this.relMachine.statusIdle.currRSIdx) * TOGGLE_MS_PER_PAGE;
        this._msCount = 0;
        this.OnStep (0);
        this.relMachine.statusIdle.currRS.onExit (this.relMachine);
        this.currRS.onEnter (this.relMachine);
    }

    /**
     * 当前游标的 y 坐标
     */
    private currRSIdxYTagCurrent: number;
    /**
     * 当前页面的 y 坐标
     */
    private currRSIdxYPageCurrent: number;

    public OnStep(ms: number): void {
        jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_MAIN);
        this._msCount += ms;
        this._msCount = Math.min (this._msCount, this._msTotal);
        let rate = this._msCount / this._msTotal;
        this.currRSIdxYTagCurrent = rate * this.currRSIdxYTag + (1 - rate) * this.relMachine.statusIdle.currRSIdxYTag;
        this.currRSIdxYPageCurrent = rate * this.currRSIdxYPage + (1 - rate) * this.relMachine.statusIdle.currRSIdxYPage;

        if (rate == 1) {
            jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_CHILDREN_ABLE);
            let rec = this.relMachine.statusIdle.currRS;
            this.relMachine.statusIdle.currRS = this.currRS;
            this.relMachine.EnterStatus (this.relMachine.statusIdle);
            rec.onUnMatch (this.relMachine);
            this.currRS.onMatch (this.relMachine);
        };
    }

    public OnGetTagY(): number {
        return this.currRSIdxYTagCurrent;
    }

    public OnGetPageY(): number {
        return this.currRSIdxYPageCurrent;
    }
}