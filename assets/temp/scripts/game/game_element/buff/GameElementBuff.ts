import BCEventer from "../../../frame/basic/BCEventer";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import CfgBuffProps from "../../../frame/config/src/CfgBuffProps";
import jiang from "../../../frame/global/Jiang";
import GameElementEff from "../common/GameElementEff";
import GameElement from "../GameElement";
import { GameElementBuffBehaviour } from "./GameElementBuffBehaviour";
import GameElementBuffRS from "./GameElementBuffRS";
import GameElementBuffStatus from "./GameElementBuffStatus";
import GameElementBuffStatusDestory from "./GameElementBuffStatusDestory";
import GameElementBuffStatusEffect from "./GameElementBuffStatusEffect";
import GameElementBuffStatusUnload from "./GameElementBuffStatusUnload";
import GameElementMgrBuff from "./GameElementMgrBuff";

const APP = `GameElementBuff`;

/**
 * buff
 */
class GameElementBuff extends GameElement {

    private constructor () {
        super();
    }

    private static _t = new UtilObjPoolType<GameElementBuff>({
        instantiate: () => {
            return new GameElementBuff();
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    static Pop (apply: string, idCfg: number, relMgrBuff: GameElementMgrBuff) {
        let cfg = jiang.mgrCfg.cfgBuffProps.select(CfgBuffProps.idGetter, idCfg)._list[0];
        let val = UtilObjPool.Pop(GameElementBuff._t, apply);

        let rs = GameElementBuffRS.instMap.get(cfg.logic);
        if (rs == null) {
            val.behaviour = GameElementBuffBehaviour.Pop(apply);
        }
        else {
            val.behaviour = rs.instantiate();
        };
        val.behaviour.Init(val, cfg[GameElementBuffRS.SYM_REC]);

        val.ms = cfg.layer_keep_ms;
        val._cfg = cfg;
        val._mgrBuff = relMgrBuff;

        val._statusEffect = GameElementBuffStatusEffect.Pop (apply);
        val._statusEffect.Init(val);
        val._statusUnload = GameElementBuffStatusUnload.Pop (apply);
        val._statusUnload.Init(val);
        val._statusDestory = GameElementBuffStatusDestory.Pop (apply);
        val._statusDestory.Init(val);

        // 默认状态为生效
        val.EnterStatus(val._statusEffect);

        // 监听时间
        let stepListenId = relMgrBuff.eleMonster.relState.evterSteped.On((ms) => {
            val.StepMS(ms);
        });
        // 记录元素
        val._mgrBuff.eleMonster.relState.AddEle(val);
        // 取消时间监听
        val.evterUnload.On(() => {
            relMgrBuff.eleMonster.relState.evterSteped.Off(stepListenId);
            // 移除元素
            val._mgrBuff.eleMonster.relState.RemEle(val);
        });

        // 补全一次层数变化通知
        val.behaviour.OnLayerIncrease();
        val.StepMS(0);
        return val;
    }

    /**
     * 当前剩余时间
     */
    ms: number;

    /**
     * 当前层数
     */
    _layer = 1;

    /**
     * 配置信息
     */
    _cfg: CfgBuffProps = null;

    /**
     * 归属的 buff 管理器
     */
    _mgrBuff: GameElementMgrBuff = null;

    /**
     * 当前状态
     */
    _currStatus: GameElementBuffStatus = null;

    /**
     * 状态 - 正在起效
     */
    _statusEffect: GameElementBuffStatusEffect;
    /**
     * 状态 - 正在卸载
     */
    _statusUnload: GameElementBuffStatusUnload;
    /**
     * 状态 - 销毁
     */
    _statusDestory: GameElementBuffStatusDestory;

    /**
     * 事件派发 - 销毁
     */
    evterUnload: BCEventer<void> = BCEventer.Pop(APP);

    /**
     * 实际策略
     */
    behaviour: GameElementBuffBehaviour<any>;

    /**
     * buff 的位置 x
     */
    buffX: number;

    /**
     * buff 的位置 y
     */
    buffY: number;

    /**
     * 进入状态
     */
    EnterStatus (status: GameElementBuffStatus) {
        let rec = this._currStatus;
        this._currStatus = status;
        if (rec) {
            rec.OnExit();
        };
        this._currStatus.OnEnter();
    }

    /**
     * 提升层数
     */
    InCreaseLayer () {
        this._layer++;
        this.ms = this._cfg.layer_keep_ms;
        this.behaviour.OnLayerIncrease();
    }

    /**
     * 时间步进
     * @param ms 
     */
    StepMS (ms: number) {
        this.buffX = this._mgrBuff.eleMonster.commonHeadPos.x;
        this.buffY = this._mgrBuff.eleMonster.commonHeadPos.y + 20;
        this._currStatus.OnStep(ms);
    }
}

export default GameElementBuff;