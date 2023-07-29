import utilMath from "../../../frame/basic/UtilMath";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import gameCommon from "../../GameCommon";
import VoiceOggViewState from "../../view/voice_ogg/VoiceOggViewState";
import GameElement from "../GameElement";
import GameCfgBodyCacheDrop from "../body/GameCfgBodyCacheDrop";


const APP = `GameElementReward`;

/**
 * 元素 - 奖励
 */
class GameElementReward extends GameElement {

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<GameElementReward>({
        instantiate: () => {
            return new GameElementReward();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,

        posX: number,
        posY: number,

        cache: GameCfgBodyCacheDrop,
        props: Array<number>,

        msIn: number,
        msFloat: number,
        msOut: number
    )
    {
        let val = UtilObjPool.Pop(GameElementReward._t, apply);
        val.msIn = msIn;
        val.msFloat = msFloat;
        val.msOut = msOut;

        val.posInit.x = posX;
        val.posInit.y = posY;
        val.cache = cache;
        val.props = props;

        val.statusIn = new GameElementReward.StatusIn(val);
        val.statusFloat = new GameElementReward.StatusFloat(val);
        val.statusOut = new GameElementReward.StatusOut(val);

        // 时间步进的监听
        let stepListen: number;
        val.evterAdded.On(() => {
            val.idAnimNeed = val.relState.counterAnimNeed.Apply();
            val.EnterStatus(val.statusIn);
            stepListen = val.relState.evterSteped.On((ms) => {
                val.currStatus.OnStep(ms);
            });
        });
        val.evterRem.On(() => {
            val.relState.evterSteped.Off(stepListen);
        });
        return val;
    }

    /**
     * 入场时间
     */
    msIn: number;
    /**
     * 漂浮时间
     */
    msFloat: number;
    /**
     * 退场时间
     */
    msOut: number;

    /**
     * 具体表现的策略
     */
    cache: GameCfgBodyCacheDrop;
    /**
     * 策略定制的参数
     */
    props: Array<number>;

    /**
     * 初始化的位置
     */
    posInit: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);

    /**
     * 当前状态
     */
    currStatus: GameElementReward.Status;

    /**
     * 状态 - 入场
     */
    statusIn: GameElementReward.StatusIn;

    /**
     * 状态 - 漂浮
     */
    statusFloat: GameElementReward.StatusFloat;

    /**
     * 状态 - 出场
     */
    statusOut: GameElementReward.StatusOut;

    /**
     * 标识 - 动画要求
     */
    idAnimNeed: number;

    EnterStatus (status: GameElementReward.Status) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec != null) {
            rec.OnExit();
        };
        this.currStatus.OnEnter();
    }
}

namespace GameElementReward {
    /**
     * 状态
     */
    export class Status {
        /**
         * 归属的状态机
         */
        relMachine: GameElementReward;

        /**
         * 进程
         */
        rate: number = 0;

        public constructor (relMachine: GameElementReward) {
            this.relMachine = relMachine;
        }

        /**
         * 事件派发 - 进入状态
         */
        public OnEnter () {

        }
        /**
         * 事件派发 - 离开状态
         */
        public OnExit () {

        }
        /**
         * 时间步进
         */
        public OnStep (ms: number) {

        }
    }

    /**
     * 状态 - 入场
     */
    export class StatusIn extends Status {
        /**
         * 累计毫秒
         */
        _msTotal: number = 0;

        /**
         * 随机 x
         */
        particleRandomX: number;
        /**
         * 随机 y
         */
        particleRandomY: number;

        public OnEnter(): void {
            this.particleRandomX = utilMath.RandomLowerToUpper ();
            this.particleRandomY = Math.random ();
        }

        public override OnStep(ms: number): void {
            this._msTotal += ms;
            this._msTotal = Math.min (this._msTotal, this.relMachine.msIn);
            this.rate = this._msTotal / this.relMachine.msIn;

            if (this._msTotal < this.relMachine.msIn) {
                return;
            };
            this.relMachine.EnterStatus(this.relMachine.statusFloat);
        }
    }

    /**
     * 状态 - 漂浮
     */
    export class StatusFloat extends Status {
        /**
         * 累计毫秒
         */
        _msTotal: number = 0;

        /**
         * 半径
         */
        equipInitRadius: number;
        /**
         * 角度
         */
        equipInitAngle: number;

        public override OnEnter(): void {
            let relX = this.relMachine.posInit.x - this.relMachine.relState.player.commonCenterPos.x;
            let relY = this.relMachine.posInit.y - this.relMachine.relState.player.commonCenterPos.y;
            this.equipInitRadius = Math.sqrt(relX ** 2 + relY ** 2);
            this.equipInitAngle = Math.atan2(relY, relX);
        }

        public override OnStep(ms: number): void {
            this._msTotal += ms;
            this._msTotal = Math.min (this._msTotal, this.relMachine.msFloat);
            this.rate = this._msTotal / this.relMachine.msFloat;

            if (this._msTotal < this.relMachine.msFloat) {
                return;
            };
            this.relMachine.EnterStatus(this.relMachine.statusOut);
        }
    }

    /**
     * 状态 - 出场
     */
    export class StatusOut extends Status {
        /**
         * 累计毫秒
         */
        _msTotal: number = 0;

        public override OnStep(ms: number): void {
            this._msTotal += ms;
            this._msTotal = Math.min (this._msTotal, this.relMachine.msOut);
            this.rate = this._msTotal / this.relMachine.msOut;

            if (this._msTotal < this.relMachine.msOut) {
                return;
            };
            this.relMachine.cache.rs.onGot (this.relMachine);
            this.relMachine.relState.RemEle(this.relMachine);
            this.relMachine.relState.counterAnimNeed.Cancel(this.relMachine.idAnimNeed);
        }
    }
}

export default GameElementReward;