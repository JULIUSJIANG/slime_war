import IndexDataModule from "../../../IndexDataModule";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import VoiceOggInfoStatus from "./VoiceOggInfoStatus";
import VoiceOggInfoStatusDisplaying from "./VoiceOggInfoStatusDisplaying";
import VoiceOggInfoStatusWaitDisplay from "./VoiceOggInfoStatusWaitDisplay";
import VoiceOggTypeRS from "./VoiceOggTypeRS";
import VoiceOggViewItem from "./VoiceOggViewItem";

/**
 * 音频数据
 */
export default class VoiceOggInfo {
    /**
     * 实例 id
     */
    genId: number;
    /**
     * 配表 id
     */
    cfgId: number;
    /**
     * 类型
     */
    typeRS: VoiceOggTypeRS;

    /**
     * 生命时长
     */
    lifeCount: number;
    /**
     * 最大生命
     */
    lifeMax: number;
    /**
     * 音量控制 - 设置影响
     */
    volumeSetting: number;
    /**
     * 实例
     */
    com: VoiceOggViewItem;
    /**
     * 播放的凭据
     */
    idVoice: number;

    private constructor () {
        this.statusWaitDisplay = new VoiceOggInfoStatusWaitDisplay (`statusWaitDisplay`, this);
        this.statusDisplaying = new VoiceOggInfoStatusDisplaying (`statusDisplaying`, this);
    }
    private static _t = new UtilObjPoolType<VoiceOggInfo>({
        instantiate: () => {
            return new VoiceOggInfo();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {
            t.currStatus.OnPush ();
        },
        tag: `VoiceInfo`
    });

    static Pop (
        apply: string,
        genId: number,
        cfgId: number,
        typeRS: VoiceOggTypeRS
    ) 
    {
        let val = UtilObjPool.Pop(VoiceOggInfo._t, apply);
        val.genId = genId;
        val.cfgId = cfgId;
        val.typeRS = typeRS;
        val.lifeCount = 0;
        val.lifeMax = -1;
        val.Enter (val.statusWaitDisplay);
        val.currStatus.OnPop ();
        return val;
    }

    /**
     * 状态 - 等待实例展示
     */
    statusWaitDisplay: VoiceOggInfoStatusWaitDisplay;
    /**
     * 状态 - 实例展示中
     */
    statusDisplaying: VoiceOggInfoStatusDisplaying;

    /**
     * 当前状态
     */
    currStatus: VoiceOggInfoStatus;

    /**
     * 进入状态
     * @param status 
     */
    Enter (status: VoiceOggInfoStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}