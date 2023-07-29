import IndexLayer from "../../../IndexLayer";
import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import SecondsStatus from "./SecondsStatus";
import SecondsStatus1 from "./SecondsStatus1";
import SecondsStatus2 from "./SecondsStatus2";
import SecondsStatus3 from "./SecondsStatus3";


const APP = `SecondsViewState`;

class SecondsViewState extends ViewState {

    private constructor ()
    {
        super (
            IndexLayer.GAME,
            ViewState.BG_TYPE.MASK,
            true
        );
    }

    private static _t = new UtilObjPoolType <SecondsViewState> ({
        instantiate: () => {
            return new SecondsViewState ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop (SecondsViewState._t, apply);
        val.status1 = new SecondsStatus1 (val);
        val.status2 = new SecondsStatus2 (val);
        val.status3 = new SecondsStatus3 (val);
        val.Enter (val.status2);
        return val;
    }

    /**
     * 帧刷新的监听
     */
    private _listenIdUpdate: number;

    OnInit(): void {
        this._listenIdUpdate = jiang.mgrEvter.evterUpdate.On ((ms) => {
            this.currStatus.OnStep (ms);
            jiang.mgrUI.ModuleRefresh (IndexDataModule.SECONDS);
        });
    }

    OnDestory(): void {
        jiang.mgrEvter.evterUpdate.Off (this._listenIdUpdate);
    }

    /**
     * 状态 1
     */
    status1: SecondsStatus1;
    /**
     * 状态 2
     */
    status2: SecondsStatus2;
    /**
     * 状态 3
     */
    status3: SecondsStatus3;

    /**
     * 当前状态
     */
    currStatus: SecondsStatus;

    /**
     * 进入某个状态
     * @param status 
     */
    Enter (status: SecondsStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}

export default SecondsViewState;