import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../GameCommon";
import GamePlayView from "./GamePlayView";
import GamePlayViewState from "./GamePlayViewState";
import GamePlayViewStateMgrTraceRecord from "./GamePlayViewStateMgrTraceRecord";

const APP = `GamePlayViewStateMgrTrace`;

/**
 * 轨迹管理器
 */
export default class GamePlayViewStateMgrTrace {

    private constructor () {

    }

    private static _t = new UtilObjPoolType<GamePlayViewStateMgrTrace>({
        instantiate: () => {
            return new GamePlayViewStateMgrTrace();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,

        relState: GamePlayViewState
    )
    {
        let val = UtilObjPool.Pop(GamePlayViewStateMgrTrace._t, apply);
        val.relState = relState;
        return val;
    }

    /**
     * 发生时间推进
     * @param ms 
     */
    OnStep (ms: number) {
        if (this.relView == null) {
            return;
        };
        this._cdTrace -= ms;
        // 全部时间增长
        for (let i = 0; i < this.listRecord.length; i++) {
            let rec = this.listRecord[i];
            rec.existedTime += ms;
        };
        // 把过期的剔除
        while (0 < this.listRecord.length) {
            // 总是取首个
            let rec = this.listRecord[0];
            rec.existedTime += ms;
            // 首个的时间未到达，后续的都不会到达
            if (rec.existedTime < gameCommon.TRACE_KEEP) {
                break;
            };
            // 从列表中移除
            this.mapIdToRecord.delete(rec.id);
            this.listRecord.splice(0, 1);
            UtilObjPool.Push(rec);
        };
        // 时间合适的，加进来
        if (this._cdTrace <= 0) {
            this._cdTrace = gameCommon.CD_TRACE;

            let rec = GamePlayViewStateMgrTraceRecord.Pop(
                APP,

                ++this._idGen,
                this.relView.GetCameraX(),
                this.relView.GetCameraY()
            );
            // 存进列表
            this.listRecord.push(rec);
            this.mapIdToRecord.set(rec.id, rec);

            // 每次构造出来，都取新的截屏
            this.relView.ScreenShoot(rec.sprf.getTexture() as cc.RenderTexture);
        };
    }

    /**
     * 发生销毁的时候
     */
    OnDestory () {
        // 直接全回收
        while (0 < this.listRecord.length) {
            // 总是取首个
            let rec = this.listRecord[0];
            this.mapIdToRecord.delete(rec.id);
            this.listRecord.splice(0, 1);
            UtilObjPool.Push(rec);
        };
    }

    /**
     * 标识生成器
     */
    private _idGen = 0;

    /**
     * 归属的界面状态
     */
    relState: GamePlayViewState;

    /**
     * 归属的界面
     */
    relView: GamePlayView;

    /**
     * 生成轨迹的冷却
     */
    private _cdTrace = gameCommon.CD_TRACE;

    /**
     * 列表形式的轨迹记录
     */
    listRecord: Array<GamePlayViewStateMgrTraceRecord> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * id 到具体记录的映射
     */
    mapIdToRecord: Map<number, GamePlayViewStateMgrTraceRecord> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
}