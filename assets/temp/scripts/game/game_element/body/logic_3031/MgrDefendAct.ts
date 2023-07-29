import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import MgrSdk from "../../../../frame/sdk/MgrSdk";
import GameCtxB2BodyFixtureConcat from "../../GameCtxB2BodyFixtureConcat";
import GameElementBody from "../GameElementBody";
import MBPlayer from "./MBPlayer";
import MgrDefendActStatus from "./MgrDefendActStatus";
import MgrDefendActStatusIng from "./MgrDefendActStatusIng";
import MgrDefendActStatusOrdinary from "./MgrDefendActStatusOrdinary";
import MgrDefendActStatusSuccessed from "./MgrDefendActStatusSuccessed";
import MgrDefendCDStatus from "./MgrDefendCDStatus";

const APP = `MgrDefendAct`;

/**
 * 管理 - 防御行为
 */
export default class MgrDefendAct {
    private constructor () {}

    private static _t = new UtilObjPoolType <MgrDefendAct> ({
        instantiate: () => {
            return new MgrDefendAct ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, npc: MBPlayer) {
        let val = UtilObjPool.Pop (MgrDefendAct._t, apply);

        // 缓存回调
        val._call = (ele, idx) => {
            if (!idx.isReleased) {
                return;
            };
            val._list.push (idx);
        };
        val.relMBPlayer = npc;
        val.statusOrdinary = MgrDefendActStatusOrdinary.Pop (APP, val);
        val.statusIng = MgrDefendActStatusIng.Pop (APP, val);
        val.statusSuccessed = MgrDefendActStatusSuccessed.Pop (APP, val);

        val.Enter (val.statusOrdinary);
        return val;
    }

    /**
     * 归属的玩家
     */
    relMBPlayer: MBPlayer;

    /**
     * 状态 - 常态
     */
    statusOrdinary: MgrDefendActStatusOrdinary;
    /**
     * 状态 - 格挡中
     */
    statusIng: MgrDefendActStatusIng;
    /**
     * 状态 - 格挡成功
     */
    statusSuccessed: MgrDefendActStatusSuccessed;

    /**
     * 当前状态
     */
    currStatus: MgrDefendActStatus;

    /**
     * 进入某个状态
     */
    Enter (status: MgrDefendActStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }

    /**
     * 集合
     */
    private _list: Array <GameElementBody> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    /**
     * 回调
     */
    private _call: (value: number, key: GameElementBody, map: Map <GameElementBody, number>) => void;
    /**
     * 时间推进
     * @param ms 
     */
    OnStep (ms: number) {
        // 清除过期内容
        this._list.length = 0;
        this._mapBodyToActionId.forEach (this._call);
        for (let i = 0; i < this._list.length; i++) {
            let idx = this._list [i];
            this._mapBodyToActionId.delete (idx);
        };
        this.currStatus.OnStep (ms);
    }
    /**
     * 物体到行为 id 的映射
     */
    private _mapBodyToActionId: Map <GameElementBody, number> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);
    /**
     * 检查接触合理性
     * @param concat 
     * @returns 
     */
    CheckConcatValid (concat: GameCtxB2BodyFixtureConcat) {
        if (!concat.CheckValid()) {
            return false;
        };
        let eleBody = concat.relFixture.relBody.relEle as GameElementBody;
        let actionIdReced = this._mapBodyToActionId.get (eleBody);
        let actionIdCurrent = eleBody.commonActionId;
        if (actionIdReced == actionIdCurrent) {
            return false;
        };
        
        return true;
    }
    /**
     * 
     * @param concat 
     */
    RecordConcatValid (concat: GameCtxB2BodyFixtureConcat) {
        let eleBody = concat.relFixture.relBody.relEle as GameElementBody;
        let actionIdCurrent = eleBody.commonActionId;
        this._mapBodyToActionId.set (eleBody, actionIdCurrent);
    }
}