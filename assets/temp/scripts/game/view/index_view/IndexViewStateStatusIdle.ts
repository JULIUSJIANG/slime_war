import IndexView from "../../../IndexView";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import MgrUI from "../../../frame/ui/MgrUI";
import IndexViewRS from "./IndexViewRS";
import IndexViewState from "./IndexViewState";
import IndexViewStateStatus from "./IndexViewStateStatus";

const APP = `IndexViewStateStatusIdle`;

/**
 * 根界面游标状态管理 - 游标待机中
 */
export default class IndexViewStateStatusIdle extends IndexViewStateStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<IndexViewStateStatusIdle>({
        instantiate: () => {
            return new IndexViewStateStatusIdle ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: IndexViewState) {
        let val = UtilObjPool.Pop (IndexViewStateStatusIdle._t, apply);
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
     * 目标策略 - 索引 - y 坐标 - 游标
     */
    public currRSIdxYTag: number;
    /**
     * 目标策略 - 索引 - y 坐标 - 页面
     */
    public currRSIdxYPage: number;

    public OnEnter(): void {
        this.currRSIdx = IndexViewRS.listInst.indexOf (this.currRS);
        this.currRSIdxYTag = IndexView.GetNodeBtnSelectedPos (this.currRSIdx);
        this.currRSIdxYPage = this.currRSIdx * MgrUI.FAT_WIDTH;
    }

    public OnToggle(rs: IndexViewRS): void {
        // 重复的切换，直接忽略
        if (rs == this.currRS) {
            return;
        };
        this.relMachine.statusMoving.currRS = rs;
        this.relMachine.EnterStatus (this.relMachine.statusMoving);
    }

    public OnGetTagY(): number {
        return this.currRSIdxYTag;
    }

    public OnGetPageY(): number {
        return this.currRSIdxYPage;
    }
}