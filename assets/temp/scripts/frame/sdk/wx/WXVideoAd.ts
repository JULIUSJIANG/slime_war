import LockViewState from "../../../game/view/lock_view/LockViewState";
import TipsViewState from "../../../game/view/tips_view/TipsViewState";
import BCPromiseCtrl from "../../basic/BCPromiseCtrl";
import UtilObjPool from "../../basic/UtilObjPool";
import MgrEvter from "../../evter/MgrEvter";
import jiang from "../../global/Jiang";
import MgrSdkCore from "../MgrSdkCore";
import MgrSdkCoreWX from "./MgrSdkCoreWX";
import WXVideoAdInst from "./WXVideoAdInst";

const APP = `WXVideoAd`;

/**
 * 微信视频广告模块总管理
 */
class WXVideoAd {
    /**
     * 归属的微信 sdk
     */
    relMgr: MgrSdkCoreWX;

    /**
     * 当前所有的视频实例
     */
    listInst: Array <WXVideoAdInst> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    constructor (args: {
        relMgr: MgrSdkCoreWX
    }) 
    {
        this.relMgr = args.relMgr;
        for (let i = 0; i < WXVideoAd.listIdVideoAD.length; i++) {
            let idVideoAD = WXVideoAd.listIdVideoAD [i];
            this.listInst.push (new WXVideoAdInst ({
                relMgr: this,
                idAd: idVideoAD
            }));
        };
    }

    /**
     * 进行视频播放
     * @returns 
     */
    Play (): Promise <MgrSdkCore.VideoCtx> {
        let lockId = LockViewState.inst.LockApp ();
        return Promise.resolve ()
            .then (() => {
                // 可用视频的进程
                let ctrlReady: BCPromiseCtrl <WXVideoAdInst> = BCPromiseCtrl.Pop (APP);
                // 逐帧检测
                let onUpdate = () => {
                    // 尝试查找可用视频
                    for (let i = 0; i < this.listInst.length; i++) {
                        let listInstI = this.listInst [i];
                        listInstI.Init ();
                        // 确实有可用视频，到此为止
                        if (listInstI.loadCurrStatus == listInstI.loadStatusReady) {
                            ctrlReady.resolve (listInstI);
                            return;
                        };
                    };
                    // 起码真的有视频在加载中
                    for (let i = 0; i < this.listInst.length; i++) {
                        let listInstI = this.listInst [i];
                        // 确实有视频加载中，继续等候
                        if (listInstI.loadCurrStatus == listInstI.loadStatusLoading) {
                            return;
                        };
                        // 根本无可用视频，终止检测
                        ctrlReady.resolve (null);
                    };
                };
                // 帧监听的 id
                let idUpdateListen: number = MgrEvter.inst.evterUpdate.On (onUpdate);
                onUpdate ();
                return ctrlReady._promise
                    .then ((instReady) => {
                        jiang.mgrEvter.evterUpdate.Off (idUpdateListen);
                        // 根本无可用视频，视频播放失败
                        if (!instReady) {
                            TipsViewState.inst.Tip (`今日可观看视频次数为 0`);
                            return {
                                isRewardAble: false
                            };
                        };
                        // 进行播放
                        return instReady.playCurrStatus.PlayOnPlay ()
                            .then ((resp) => {
                                // 播放失败
                                if (!resp) {
                                    TipsViewState.inst.Tip (`未完整地观看视频`);
                                };
                                return {
                                    isRewardAble: resp
                                };
                            })
                    });
            })
            .then ((resp) => {
                LockViewState.inst.LockCancel (lockId);
                return resp;
            });
    }

    /**
     * 初始化
     */
    Init () {
        for (let i = 0; i < this.listInst.length; i++) {
            let listInstI = this.listInst [i];
            // listInstI.Init ();
        };
    }

    /**
     * 当前视频储备数量
     */
    countAble: number = 0;

    /**
     * 离开加载状态
     */
    OnLoadExit () {
        this.countAble = 0;
        for (let i = 0; i < this.listInst.length; i++) {
            let listInstI = this.listInst [i];
            if (listInstI.loadCurrStatus == listInstI.loadStatusReady) {
                this.countAble++;
            };
        };

        // 所有加载都已出结果
        let isAllLoadResult = true;
        for (let i = 0; i < this.listInst.length; i++) {
            let listInstI = this.listInst [i];
            if (listInstI.loadCurrStatus == listInstI.loadStatusLoading) {
                isAllLoadResult = false;
                break;
            };
        };

        // 全部加载完成，告知玩家今日剩余次数
        if (isAllLoadResult && this.countAble != this.listInst.length) {
            TipsViewState.inst.Tip (`今日剩余的视频观看量 ${this.countAble}`);
        };
    }
}

namespace WXVideoAd {

    export const ad6_60 = [
        `adunit-ca11389b6aa435d3`,
        `adunit-ea217dcf7143fd1a`,
        `adunit-4a17a75177984fb9`
    ];

    export const ad6_30 = [
        `adunit-c9e476add0168ff7`,
        `adunit-84c65dc18eecb21d`,
        `adunit-38ed46e0d6839145`
    ];

    export const ad6_15 = [
        `adunit-820eb549f23b7c8a`,
        `adunit-09190278ae2544f5`,
        `adunit-20997fc973b96124`
    ];

    /**
     * 集合 - 视频 id，由控制台创建
     */
    export const listIdVideoAD = [
        ...ad6_60
    ];
}

export default WXVideoAd;