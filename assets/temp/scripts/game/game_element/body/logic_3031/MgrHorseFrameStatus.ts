import utilMath from "../../../../frame/basic/UtilMath";
import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import VoiceOggViewState from "../../../view/voice_ogg/VoiceOggViewState";
import GameElementPart from "../../common/GameElementPart";
import DefineVoice from "../DefineVoice";
import MgrHorseFrame from "./MgrHorseFrame";

const APP = `MgrHorrseFrameStatus`;

/**
 * 马的帧动画状态管理器 - 具体的帧
 */
export default class MgrHorseFrameStatus {

    /**
     * 归属的状态机
     */
    relMachine: MgrHorseFrame;

    /**
     * 帧索引
     */
    idx: number;

    /**
     * 维持时间
     */
    msKeep: number
    
    /**
     * 要飞溅泥土的相对位置集合
     */
    listPositionDirt: Array <cc.Vec2> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 启动音效
     */
    voice: number;

    public constructor (args: {
        relMachine: MgrHorseFrame,
        idx: number,
        msKeep: number,
        listPositionDirt: Array <cc.Vec2>,
        voiceActive: number
    }) 
    {
        this.relMachine = args.relMachine;
        this.idx = args.idx;
        this.msKeep = args.msKeep;
        this.listPositionDirt = args.listPositionDirt;
        this.voice = args.voiceActive;
    }

    /**
     * 累计时间
     */
    private _msCount: number;

    /**
     * 事件派发 - 进入状态
     */
    OnEnter () {
        if (this.voice != null) {
            VoiceOggViewState.inst.VoiceSet (DefineVoice.HORSE_DIRT_1);
        };
        for (let i = 0; i < this.listPositionDirt.length; i++) {
            let position = this.listPositionDirt [i];
            GameElementPart.BoomForHorse (
                APP,
                this.relMachine.relNp.relBody.relState,
                this.relMachine.relNp.relBody.relState.cfgSceneCache.colorDark,
                8,
                this.relMachine.relNp.relBody.commonFootPos.x + position.x,
                this.relMachine.relNp.relBody.commonFootPos.y + position.y,
                0,
                1,

                640 / 1000 / 6,
                600,
                0.3
            );
        };

        this._msCount = 0;
    }

    /**
     * 事件派发 - 离开状态
     */
    OnExit () {

    }

    /**
     * 事件派发 - 时间推进
     */
    OnStep (ms: number) {
        this._msCount += ms;
        // 时间到了的话，进入下一个状态
        if (this.msKeep < this._msCount) {
            let idxNext = utilMath.Mod (this.idx - 1, this.relMachine.listStatus.length);
            this.relMachine.EnterStatus (this.relMachine.listStatus [idxNext]);
        };
    }
}