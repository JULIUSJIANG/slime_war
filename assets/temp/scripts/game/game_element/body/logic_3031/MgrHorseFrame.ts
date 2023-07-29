import UtilObjPool from "../../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../../frame/basic/UtilObjPoolType";
import DefineVoice from "../DefineVoice";
import MBPlayer from "./MBPlayer";
import MgrHorseFrameStatus from "./MgrHorseFrameStatus";

const APP = `MgrHorseFrame`;

/**
 * 马的帧动画状态管理器
 */
export default class MgrHorseFrame {

    private constructor () {}

    private static _t = new UtilObjPoolType<MgrHorseFrame>({
        instantiate: () => {
            return new MgrHorseFrame ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relNpc: MBPlayer) {
        let posLeft = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
        posLeft.x = -30;

        let posRight = UtilObjPool.Pop (UtilObjPool.typeccVec2, APP);
        posRight.x = 15;

        // 每个状态的停留时间
        let msKeep = 1000 / 8;

        let val = UtilObjPool.Pop (MgrHorseFrame._t, apply);
        val.relNp = relNpc;
        val.listStatus.push (
            new MgrHorseFrameStatus ({
                relMachine: val,
                idx: 0,
                msKeep: Math.ceil (msKeep),
                listPositionDirt: [
                    posLeft
                ],
                voiceActive: null,
                // voiceActive: DefineVoice.HORSE_DIRT_1
            }),
            new MgrHorseFrameStatus ({
                relMachine: val,
                idx: 1,
                msKeep: Math.ceil (msKeep),
                listPositionDirt: [
                    posRight
                ],
                voiceActive: null,
                // voiceActive: DefineVoice.HORSE_DIRT_2
            }),
            new MgrHorseFrameStatus ({
                relMachine: val,
                idx: 2,
                msKeep: Math.ceil (msKeep),
                listPositionDirt: [

                ],
                voiceActive: null
            }),
            new MgrHorseFrameStatus ({
                relMachine: val,
                idx: 3,
                msKeep: Math.ceil (msKeep),
                listPositionDirt: [
                    posLeft
                ],
                voiceActive: null,
                // voiceActive: DefineVoice.HORSE_DIRT_1
            }),
            new MgrHorseFrameStatus ({
                relMachine: val,
                idx: 4,
                msKeep: Math.ceil (msKeep),
                listPositionDirt: [
                    posRight
                ],
                voiceActive: null,
                // voiceActive: DefineVoice.HORSE_DIRT_2
            }),
            new MgrHorseFrameStatus ({
                relMachine: val,
                idx: 5,
                msKeep: Math.ceil (msKeep),
                listPositionDirt: [

                ],
                voiceActive: null
            })
        );
        val.EnterStatus (val.listStatus [0]);
        return val;
    }

    /**
     * 归属的单位
     */
    relNp: MBPlayer;

    /**
     * 列表 - 状态
     */
    listStatus: Array <MgrHorseFrameStatus> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    /**
     * 当前状态
     */
    currStatus: MgrHorseFrameStatus;

    /**
     * 进入状态
     * @param status 
     */
    public EnterStatus (status: MgrHorseFrameStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}