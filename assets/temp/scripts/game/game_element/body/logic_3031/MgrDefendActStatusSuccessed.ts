import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../../GameCommon";
import EquipmentView from "../../../view/equipment_view/EquipmentView";
import GameCtxB2BodyFixtureConcat from "../../GameCtxB2BodyFixtureConcat";
import GameElementEff from "../../common/GameElementEff";
import EquipmentInstRS from "../../equipment/EquipmentInstRS";
import GameElementBody from "../GameElementBody";
import GameElementBodyCtxDmg from "../GameElementBodyCtxDmg";
import GameElementBodyCtxDmgType from "../GameElementBodyCtxDmgType";
import GameSizeMarkRS from "../GameSizeMarkRS";
import MgrDefendAct from "./MgrDefendAct";
import MgrDefendActStatus from "./MgrDefendActStatus";
import MgrDefendCDStatus from "./MgrDefendCDStatus";

const APP = `MgrDefendActStatusSuccessed`;

/**
 * 防御执行 - 状态 - 格挡成功
 */
export default class MgrDefendActStatusSuccessed extends MgrDefendActStatus {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType <MgrDefendActStatusSuccessed> ({
        instantiate: () => {
            return new MgrDefendActStatusSuccessed ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, machine: MgrDefendAct) {
        let val = UtilObjPool.Pop (MgrDefendActStatusSuccessed._t, apply);
        val.relMachine = machine;
        return val;
    }

    /**
     * 总累计时间
     */
    _totalMS: number = 0;
    
    /**
     * 应用 id - 时间缩放
     */
    _appIdTimeScale: number;

    OnEnter(): void {
        this.ClearDmgRecord ();
        this._totalMS = 0;
        this._appIdTimeScale = this.relMachine.relMBPlayer.relBody.relState.ApplyTimeScale (gameCommon.TIME_SCALE_WHILE_DEFEND_SUCCESSED);
        this.relMachine.relMBPlayer.animKeepShield.currStatus.OnFadeIn ();
    }

    OnExit(): void {
        this.relMachine.relMBPlayer.relBody.relState.CancelTimeScale (this._appIdTimeScale);
        this.relMachine.relMBPlayer.animKeepShield.currStatus.OnFadeOut ();
    }

    OnStep(ms: number): void {
        for (let i = 0; i < this.relMachine.relMBPlayer.relBody.listConcatedBodyEnemy.length; i++) {
            let concat = this.relMachine.relMBPlayer.relBody.listConcatedBodyEnemy [i];
            if (!this.CheckDmgAble (concat)) {
                continue;
            };
            if (!this.relMachine.CheckConcatValid (concat)) {
                continue;
            };
            this.relMachine.RecordConcatValid (concat);
            GameSizeMarkRS.PlayEffHitByConcat (
                APP,
                concat,
                this.relMachine.relMBPlayer.relBody.relState,
                // (concat.relFixture.relBody.relEle as GameElementBody).commonCache.colorMain,
                this.relMachine.relMBPlayer.relBody.commonCache.colorMain,
                (concat.relFixture.relBody.relEle as GameElementBody).commonArgsCfg.size_mark
            );
            this.CauseDmg (concat, GameElementBodyCtxDmg.Pop(
                APP,
                {
                    dmg: EquipmentInstRS.GetSingleDmgByPower (gameCommon.STANDARD_EQUIP, this.relMachine.relMBPlayer.playerMgrEquipment.equipInst.power),
                    posX: concat.position.x,
                    posY: concat.position.y,

                    repel: EquipmentInstRS.GetSingleRepel (gameCommon.STANDARD_EQUIP),
                    norX: concat.normal.x,
                    norY: concat.normal.y,

                    type: GameElementBodyCtxDmgType.shield
                }
            ));
        };

        this._totalMS += ms;
        if (gameCommon.DEFEND_SUCCESS_KEEP <= this._totalMS) {
            this.relMachine.Enter(this.relMachine.statusOrdinary);
        };

        if (this.relMachine.relMBPlayer.playerMgrDefendCD.currStatus == this.relMachine.relMBPlayer.playerMgrDefendCD.statusTimeCount) {
            this.relMachine.relMBPlayer.playerMgrDefendCD.currStatus.OnStep (ms / gameCommon.DEFEND_SUCCESS_KEEP * gameCommon.CD_DEFEND / gameCommon.SHIELD_READY_IN_DEFEND_SUCCESS);
        };
    }

    OnDefend(): void {
        this.relMachine.Enter (this.relMachine.statusIng);
    }

    /**
     * 已伤害的目标记录
     */
    private _setDmgedTargetId = UtilObjPool.Pop (UtilObjPool.typeSet, APP);
    /**
     * 清除伤害记录
     */
    ClearDmgRecord () {
        this._setDmgedTargetId.clear ();
    }
    
    /**
     * 检查是否能够伤害
     * @param ele 
     * @returns 
     */
    CheckDmgAble (concat: GameCtxB2BodyFixtureConcat) {
        if (!concat.CheckValid ()) {
            return false;
        };
        let ele = concat.relFixture.relBody.relEle as GameElementBody;
        if (this._setDmgedTargetId.has (ele.id)) {
            return false;
        };
        if (ele.commonCaller && this._setDmgedTargetId.has (ele.commonCaller.id)) {
            return false;
        };
        return true;
    }

    /**
     * 进行伤害
     * @param ele 
     * @param ctx 
     * @returns 
     */
    CauseDmg (concat: GameCtxB2BodyFixtureConcat, ctx: GameElementBodyCtxDmg) {
        if (!this.CheckDmgAble (concat)) {
            return;
        };
        let ele = concat.relFixture.relBody.relEle as GameElementBody;
        this._setDmgedTargetId.add (ele.id);
        ele.commonEvterDmg.Call (ctx);
    }
}