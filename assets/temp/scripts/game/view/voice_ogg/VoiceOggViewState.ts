import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import IndexDataModule from "../../../IndexDataModule";
import IndexLayer from "../../../IndexLayer";
import indexDataStorageItem from "../../../IndexStorageItem";
import CfgVoiceOgg from "../../../frame/config/src/CfgVoiceOgg";
import VoiceOggInfo from "./VoiceOggInfo";
import VoiceOggTypeRS from "./VoiceOggTypeRS";
import VoiceOggVolumeStatusIdle from "./VoiceOggVolumeStatusIdle";
import VoiceOggVolumeStatusCD from "./VoiceOggVolumeStatusCD";
import VoiceOggVolumeStatus from "./VoiceOggVolumeStatus";

const APP = `VoiceOggViewState`;

// 每毫秒的音量变化
const VOLUME_PER_MS = 1 / 1000;

/**
 * 音频界面-状态
 */
class VoiceOggViewState extends ViewState {
    
    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false,
        );
        this.statusIdle = new VoiceOggVolumeStatusIdle (this);
        this.statusCD = new VoiceOggVolumeStatusCD (this);
        this.Enter (this.statusIdle);
        VoiceOggViewState.inst = this;
    }

    private static _t = new UtilObjPoolType<VoiceOggViewState>({
        instantiate: () => {
            return new VoiceOggViewState();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(VoiceOggViewState._t, apply);

        jiang.mgrEvter.evterUpdate.On((ms) => {
            // 派发时间事件
            val.currStatus.OnStep (ms);
            // 通知时间推进
            for (let i = val.infoList.length - 1; 0 <= i; i--) {
                let info = val.infoList[i];
                info.currStatus.OnStep (ms);
            };
            // 穷尽所有音频记录
            for (let i = val.infoList.length - 1; 0 <= i; i--) {
                let info = val.infoList[i];
                // 记录已维持的时间
                info.lifeCount += ms;
                // 最大持续时长为 -1 的，视为用不结束
                if (info.lifeMax == -1) {
                    continue;
                };
                // 时间轴还没到终点的话，忽略
                if (info.lifeCount < info.lifeMax) {
                    continue;
                };
                // 否则是要删除的
                val.Recovery(i);
            };

            // 同步音效数据
            for (let i = val.voiceList.length - 1; 0 <= i; i--) {
                let id = val.voiceList[i];
                // 还存在的话，忽略
                if (val._mapIdToRec.has(id)) {
                    continue;
                };
                // 否则音效这边也要同步删除
                val.voiceList.splice(i, 1);
            };
        });

        return val;
    }

    /**
     * 全局实例
     */
    static inst: VoiceOggViewState;

    /**
     * 迭代 id
     */
    private _genId: number = 0;

    /**
     * id 到实例的映射
     */
    private _mapIdToRec: Map<number, VoiceOggInfo> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 当前的信息列表
     */
    infoList: Array<VoiceOggInfo> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 应用音频
     */
    private ApplyOgg (cfgId: number, typeRS: VoiceOggTypeRS) {
        let id = ++this._genId;
        let voiceInfo = VoiceOggInfo.Pop(
            APP,
            id,
            cfgId,
            typeRS
        );
        this.infoList.push(voiceInfo);
        this._mapIdToRec.set(voiceInfo.genId, voiceInfo);
        jiang.mgrUI.ModuleRefresh(IndexDataModule.RELOAD);
        return id;
    }

    /**
     * 取消音频
     */
    private CancelOgg (instId: number) {
        // 查找音频索引
        let index = -1;
        for (let i = 0; i < this.infoList.length; i++) {
            let rec = this.infoList[i];
            if (rec.genId != instId) {
                continue;
            };
            index = i;
        };
        // 结果非法，忽略
        if (index < 0) {
            return;
        };
        this.Recovery(index);
    }

    /**
     * 获取实例的配表 id
     * @param instId 
     */
    GetRec (instId: number) {
        return this._mapIdToRec.get(instId);
    }

    /**
     * 回收某位置的音频记录
     * @param idx 
     */
    private Recovery (idx: number) {
        // 获取记录
        let rec = this.infoList[idx];
        // 移除记录
        this.infoList.splice(idx, 1);
        // 删除记录
        this._mapIdToRec.delete(rec.genId);
        // 回收
        UtilObjPool.Push(rec);
        // 要求刷新
        jiang.mgrUI.ModuleRefresh(IndexDataModule.RELOAD);
    }

    /**
     * 音效 - 存储的列表
     */
    voiceList: Array<number> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 音效 - 播放
     * @param idCfg 
     */
    VoiceSet (idCfg: number) {
        if (idCfg == null || idCfg == 0) {
            return;
        };
        let idGen = this.ApplyOgg(idCfg, VoiceOggTypeRS.voice);
        let rec = this.GetRec(idGen);
        rec.volumeSetting = jiang.mgrData.Get(indexDataStorageItem.volumeVoice);
        this.voiceList.push(idGen);
    }

    /**
     * 背景音乐 - 存储的列表
     */
    bgmAppId: number;
    /**
     * 背景音乐 - 设置
     * @param idCfg 
     */
    BgmSet (idCfg: number) {
        let currentRec = this.GetRec(this.bgmAppId);
        if (currentRec && currentRec.cfgId == idCfg) {
            return;
        };
        // 取消上一个背景音乐
        this.CancelOgg(this.bgmAppId);
        this.bgmAppId = this.ApplyOgg(idCfg, VoiceOggTypeRS.bgm);
        let rec = this.GetRec(this.bgmAppId);
        rec.volumeSetting = jiang.mgrData.Get(indexDataStorageItem.volumeMusic);
    }

    /**
     * 重置背景音乐
     */
    ResetBgm () {
        let currentRec = this.GetRec(this.bgmAppId);
        let idCfg = currentRec.cfgId;
        this.CancelOgg (this.bgmAppId);
        this.BgmSet (idCfg);
    }

    OnChange (module: IndexDataModule): void {
        if (module == IndexDataModule.VOLUME_CHANGE) {
            this.currStatus.OnVolumeChange ();
        };
    }

    /**
     * 状态 - 待机
     */
    statusIdle: VoiceOggVolumeStatusIdle;
    /**
     * 状态 - 冷却
     */
    statusCD: VoiceOggVolumeStatusCD;

    /**
     * 当前状态
     */
    currStatus: VoiceOggVolumeStatus;
    /**
     * 进入状态
     * @param status 
     */
    Enter (status: VoiceOggVolumeStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.currStatus.OnEnter ();
    }
}

namespace VoiceOggViewState {

}

export default VoiceOggViewState;