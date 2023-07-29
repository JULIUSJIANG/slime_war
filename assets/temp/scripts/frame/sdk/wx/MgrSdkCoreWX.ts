import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import ShareViewRS from "../../../game/view/share_view/ShareViewRS";
import TipsViewState from "../../../game/view/tips_view/TipsViewState";
import BCPromiseCtrl from "../../basic/BCPromiseCtrl";
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";
import utilString from "../../basic/UtilString";
import CfgBackpackProp from "../../config/src/CfgBackpackProp";
import jiang from "../../global/Jiang";
import MgrSdk from "../MgrSdk";
import MgrSdkCore from "../MgrSdkCore";
import MgrSdkEnterRS from "../MgrSdkEnterRS";
import MgrSdkCoreWXCloudCallRecord from "./MgrSdkCoreWXCloudCallRecord";
import MgrSdkCoreWXCloudFunctionRS from "./MgrSdkCoreWXCloudFunctionRS";
import MgrSdkCoreWXCloudStatus from "./MgrSdkCoreWXCloudStatus";
import MgrSdkCoreWXCloudStatusIdle from "./MgrSdkCoreWXCloudStatusIdle";
import MgrSdkCoreWXCloudStatusInited from "./MgrSdkCoreWXCloudStatusInited";
import MgrSdkCoreWXCloudStatusIniting from "./MgrSdkCoreWXCloudStatusIniting";
import { MgrSdkCoreWXUserInfo } from "./MgrSdkCoreWXUserInfo";
import WXAudio from "./WXAudio";
import WXImgLoader from "./WXImgLoader";
import WXLifeCycle from "./WXLifeCycle";
import WXVideoAd from "./WXVideoAd";

const APP = `MgrSdkCoreWX`;

/**
 * 键 - 本地
 */
const KEY_LOCAL = `${APP}_local`;
/**
 * 键 - 服务器
 */
const KEY_SERVER = `${APP}_server`;

/**
 * sdk 核心 - 微信
 */
class MgrSdkCoreWX extends MgrSdkCore {
    /**
     * 全局单例
     */
    static inst: MgrSdkCoreWX;

    private constructor () {
        super ();
        MgrSdkCoreWX.inst = this;
        this.mgrAd = new WXVideoAd ({
            relMgr: this
        });
        this.mgrLife = new WXLifeCycle ({
            relMgr: this
        });

        this.cloudStatusIdle = new MgrSdkCoreWXCloudStatusIdle (this);
        this.cloudStatusIniting = new MgrSdkCoreWXCloudStatusIniting (this);
        this.cloudStatusInited = new MgrSdkCoreWXCloudStatusInited (this);
        this.CloudEnterStatus (this.cloudStatusIdle);
    }

    private static _t = new UtilObjPoolType<MgrSdkCoreWX>({
        instantiate: () => {
            return new MgrSdkCoreWX ();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop (MgrSdkCoreWX._t, apply);
    }

    static get wx () {
        return window [`wx`];
    }

    /**
     * 本地时间与服务器时间的差值
     */
    timeSpace = 0;

    /**
     * 玩家头像地址
     */
    playerHeadUrl: string;

    /**
     * 玩家标识
     */
    openId: string;

    /**
     * 视频广告管理器
     */
    mgrAd: WXVideoAd;

    /**
     * 生命周期管理器
     */
    mgrLife: WXLifeCycle;

    Init(): Promise<unknown> {
        MgrSdkCoreWX.wx.showShareMenu()
        MgrSdkCoreWX.wx.onShareAppMessage(() => {
            // 背包物品
            let listBackpackProp = jiang.mgrData.Get (indexDataStorageItem.listBackpackProp);
            // 穷举所有分享相关的物品
            for (let i = 0; i < ShareViewRS.listShareViewRS.length; i++) {
                let listShareViewRSI = ShareViewRS.listShareViewRS [i];
                // 已拥有
                let owned = false;
                for (let i = 0; i < listBackpackProp.length; i++) {
                    let listBackpackPropItem = listBackpackProp [i];
                    if (listBackpackPropItem.idCfg == listShareViewRSI.idProp) {
                        owned = true;
                        break;
                    };
                };
                // 已拥有的话，尝试下一位
                if (owned) {
                    continue;
                };
                // 否则针对该物品以进行分享
                let cfgProp = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, listShareViewRSI.idProp)._list [0];
                return this.CreateShareMsg (
                    `我想要${cfgProp.name}，快来帮帮我`,
                    MgrSdkEnterRS.invited,
                    {
                        open_id: MgrSdk.inst.core.WXGetOpenId (),
                        id_prop: `${listShareViewRSI.idProp}`
                    },
                    listShareViewRSI.imgId,
                    listShareViewRSI.imgUrl
                );
            };
            // 所有物品均已拥有，那么分享默认的
            return {
              title: `好耶！是小冒险~`,
              imageUrlId: ShareViewRS.heart.imgId,
              imageUrl: ShareViewRS.heart.imgUrl
            };
        });
        MgrSdk.inst.Log (`wx: init`);
        return Promise.resolve ()
            // 等待云环境初始化成功
            .then (() => {
                let ctrl = BCPromiseCtrl.Pop (APP);
                this.CloudEnterStatus (this.cloudStatusIniting);
                let listenId = jiang.mgrEvter.evterUpdate.On (() => {
                    if (this.cloudCurrStatus != this.cloudStatusInited) {
                        return;
                    };
                    ctrl.resolve (null);
                });
                ctrl._promise.then (() => {
                    jiang.mgrEvter.evterUpdate.Off (listenId);
                });
                return ctrl._promise;
            });
    }

    /**
     * 玩家授权
     * @returns 
     */
    Author(): Promise<unknown> {
        let dateNowStart = Date.now ();
        const SCOPE_USERINFO = `scope.userInfo`;
        return Promise.resolve ()
            // 确保用户已授权
            .then (() => {
                return Promise.resolve ()
                    // 获取授权状态
                    .then (() => {
                        let ctrl = BCPromiseCtrl.Pop<boolean> (APP);
                        let cd = 0;
                        function Go () {
                            MgrSdk.inst.Log (`wx: getSetting...`);
                            MgrSdkCoreWX.wx.getSetting ({
                                scope: SCOPE_USERINFO,
                                success: (resp) => {
                                    MgrSdk.inst.Log (`wx: getSetting success`, resp);
                                    ctrl.resolve (resp.authSetting [SCOPE_USERINFO]);
                                },
                                fail: (resp) => {
                                    MgrSdk.inst.Log (`wx: getSetting fail`, resp);
                                    // 失败的时候自动延期重试
                                    cd += 1000;
                                    setTimeout(() => {
                                        Go ();
                                    }, cd);
                                }
                            });
                        }
                        Go ();
                        return ctrl._promise;
                    })
                    // 尚未授权的话，全屏封锁
                    .then ((ok) => {
                        if (ok) {
                            return Promise.resolve ();
                        };
                        let ctrl = BCPromiseCtrl.Pop (APP);
                        MgrSdk.inst.Log (`wx: createUserInfoButton...`);
                        let button = MgrSdkCoreWX.wx.createUserInfoButton({
                          type: 'text',
                          text: '',
                          style: {
                            width: window.innerWidth,
                            height: window.innerHeight,
                            backgroundColor: '#00000000',
                          }
                        })
                        button.onTap((res) => {
                          if (res.userInfo) {
                            MgrSdk.inst.Log (`wx: createUserInfoButton`, res.userInfo);
                            // 不再需要按钮，销毁
                            button.destroy ();
                            ctrl.resolve (null);
                          };
                        });
                        return ctrl._promise;
                    });
            })
            .then (() => {
                let ctrl = BCPromiseCtrl.Pop (APP);
                let cd = 0;
                function Go () {
                    MgrSdk.inst.Log (`wx: getUserInfo...`);
                    MgrSdkCoreWX.wx.getUserInfo()
                        .then ((data) => {
                            MgrSdk.inst.Log (`wx: getUserInfo then`, data);
                            ctrl.resolve (data.userInfo);
                        })
                        .catch ((err) => {
                            MgrSdk.inst.Log (`wx: getUserInfo catch`, err);
                            cd += 1000;
                            setTimeout(() => {
                                Go ();
                            }, cd);
                        });
                };
                Go ();
                return ctrl._promise;
            })
            .then ((data: MgrSdkCoreWXUserInfo) => {
                let ctrl = BCPromiseCtrl.Pop (APP);
                this.CloudCertain (new MgrSdkCoreWXCloudCallRecord ({
                    rs: MgrSdkCoreWXCloudFunctionRS.msgCommit,
                    t: {
                        nick_name: data.nickName,
                        avatar_url: data.avatarUrl
                    },
                    success: (resp) => {
                        ctrl.resolve (null);
                        MgrSdk.inst.Log (`wx: author nickName[${data.nickName}] openId[${resp.open_id}] avatarUrl[${data.avatarUrl}]`);
                        this.playerHeadUrl = data.avatarUrl;
                        this.openId = resp.open_id;
                    },
                    fail: (err) => {

                    }
                }));
                return ctrl._promise;
            })
            .then (() => {
                // 本次启动附带的参数
                let launchOptions = MgrSdkCoreWX.wx.getLaunchOptionsSync();
                MgrSdk.inst.Log (`wx: getLaunchOptionsSync`, launchOptions);
                let code = launchOptions.query[`_code`];
                let rs = MgrSdkEnterRS.mapCodeToRS.get (code);
                MgrSdk.inst.Log (`wx: code[${code}]`, rs);
                if (rs == null) {
                    rs = MgrSdkEnterRS.none;
                };
                rs.init (launchOptions.query);
            })
            .then (() => {
                jiang.mgrUI.ModuleRefresh (IndexDataModule.SDK);
                this.mgrAd.Init ();
            });
    }

    LocalSet (val: object): Promise<unknown> {
        MgrSdkCoreWX.wx.setStorageSync(KEY_LOCAL, JSON.stringify (val));
        return Promise.resolve (null);
        return new Promise ((resolve) => {
            MgrSdkCoreWX.wx.setStorage ({
                key: KEY_LOCAL,
                data: JSON.stringify (val),
                success: () => {
                    resolve (null);
                },
                fail: () => {
                    console.error (`MgrSdkCoreWX: Set fail val[${val}]`);
                }
            })
        });
    }
    LocalGet (): Promise<object> {
        let dateNowStart = Date.now ();
        let txt = MgrSdkCoreWX.wx.getStorageSync(KEY_LOCAL);
        MgrSdk.inst.Log (`MgrSdkCoreWX: LocalGet Cost[${Date.now () - dateNowStart}]`, txt);
        if (utilString.CheckIsNullOrEmpty (txt)) {
            return Promise.resolve (null);
        };
        return Promise.resolve(JSON.parse (txt));
        return new Promise ((resolve) => {
            MgrSdkCoreWX.wx.getStorage ({
                key: KEY_LOCAL,
                success: (res) => {
                    resolve (JSON.parse (res.data));
                    MgrSdk.inst.Log (`MgrSdkCoreWX: LocalGet Cost[${Date.now () - dateNowStart}]`);
                },
                fail: () => {
                    resolve (null);
                }
            })
        });
    }

    ServerSet (val: object): Promise<unknown> {
        let ctrl = BCPromiseCtrl.Pop<unknown> (APP);
        this.CloudCertain (new MgrSdkCoreWXCloudCallRecord({
            rs: MgrSdkCoreWXCloudFunctionRS.infoSet,
            t: {
                info_json: val
            },
            success: (resp) => {
                MgrSdk.inst.Log (`wx: resp.isStorageKeyValid[${resp.isStorageKeyValid}]`);
                // 存取专用的 key 已经过期，为防止数据冲突，程序关闭！
                if (!resp.isStorageKeyValid) {
                    this.mgrLife.currStatus.OnAppQuit ();
                    return;
                };
                ctrl.resolve (resp);
            },
            fail: (resp) => {
                ctrl.resolve (resp);
            }
        }));
        return ctrl._promise;
    }
    ServerGet (): Promise<object> {
        let dateNowStart = Date.now ();
        let ctrl = BCPromiseCtrl.Pop<object> (APP);
        this.CloudCertain (new MgrSdkCoreWXCloudCallRecord({
            rs: MgrSdkCoreWXCloudFunctionRS.infoGet,
            t: {},
            success: (resp) => {
                ctrl.resolve (resp.info_json);
                MgrSdk.inst.Log (`MgrSdkCoreWX: ServerGet Cost[${Date.now () - dateNowStart}]`);
            },
            fail: (resp) => {
                
            }
        }));
        return ctrl._promise;
    }

    WXVideo () {
        return this.mgrAd.Play ();
    }

    DateNow () {
        let ctrl = BCPromiseCtrl.Pop<number> (APP);
        this.CloudCertain (new MgrSdkCoreWXCloudCallRecord({
            rs: MgrSdkCoreWXCloudFunctionRS.dateNow,
            t: {},
            // 成功的话，恢复待机模式
            success: (resp) => {
                ctrl.resolve (resp.ms);
            },
            // 失败的话，自动重试
            fail: (resp) => {
            }
        }));
        return ctrl._promise;
    }
    
    WXGetPlayerHeadUrl() {
        return this.playerHeadUrl;
    }

    private _listCtxJoined: Array <MgrSdkCore.JoinedCtx> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
    WXGetListCtxJoined(): MgrSdkCore.JoinedCtx[] {
        return this._listCtxJoined;
    }

    WXRefreshListCtxJoined(): Promise<unknown> {
        let ctrl = BCPromiseCtrl.Pop (APP);
        this.CloudCertain (new MgrSdkCoreWXCloudCallRecord ({
            rs: MgrSdkCoreWXCloudFunctionRS.getHelpMsg,
            t: {

            },
            success: (resp) => {
                this._listCtxJoined.length = 0;
                this._listCtxJoined.push (...resp.list_ctx);
                // 抛出变化
                jiang.mgrUI.ModuleRefresh (IndexDataModule.SDK);
                ctrl.resolve (null);
            },
            fail: (resp) => {

            }
        }));
        return ctrl._promise;
    }

    private _mapUrlToImgLoader: Map <string, WXImgLoader> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    FillSprByUrl (spr: cc.Sprite, url: string) {
        if (!this._mapUrlToImgLoader.has (url)) {
            this._mapUrlToImgLoader.set (url, WXImgLoader.Pop (APP, url));
        };
        let loader = this._mapUrlToImgLoader.get (url);
        loader.currStatus.OnFill (spr);
    }

    /**
     * 云 - 当前状态
     */
    cloudCurrStatus: MgrSdkCoreWXCloudStatus;
    /**
     * 云 - 待机中
     */
    cloudStatusIdle: MgrSdkCoreWXCloudStatusIdle;
    /**
     * 云 - 正在初始化
     */
    cloudStatusIniting: MgrSdkCoreWXCloudStatusIniting;
    /**
     * 云 - 初始化完毕
     */
    cloudStatusInited: MgrSdkCoreWXCloudStatusInited;
    /**
     * 云 - 进入某状态
     * @param status 
     */
    CloudEnterStatus (status: MgrSdkCoreWXCloudStatus) {
        let rec = this.cloudCurrStatus;
        this.cloudCurrStatus = status;
        if (rec) {
            rec.OnExit ();
        };
        this.cloudCurrStatus.OnEnter ();
    }
    /**
     * 调用云函数
     * @param record 
     */
    CloudCall<I, O> (record: MgrSdkCoreWXCloudCallRecord<I, O>) {
        // 已经初始化完毕，那么直接调用
        if (this.cloudCurrStatus == this.cloudStatusInited) {
            this.cloudStatusInited.Call (record);
        }
        // 否则加入任务队列
        else {
            this.cloudStatusInited.listCallRecord.push (record);
        };
    }

    /**
     * 确保云函数的调用
     * @param record 
     */
    CloudCertain<I, O> (record: MgrSdkCoreWXCloudCallRecord<I, O>) {
        let clone = new MgrSdkCoreWXCloudCallRecord ({
            rs: record.rs,
            t: record.t,
            // 成功的话，直接通知母体
            success: (resp) => {
                record.success (resp);
            },
            // 失败的话，自动重试
            fail: (resp) => {
                record.retryTimeout += 1000;
                // 自动延期重试
                setTimeout(() => {
                    this.CloudCertain (record);
                }, record.retryTimeout);
                record.fail (resp);
            }
        });
        this.CloudCall (clone);
    }
    
    /**
     * 
     * @param title 构造分享参数
     * @param rs 
     * @param props 
     * @param imgId 
     * @param imgUrl 
     * @returns 
     */
    CreateShareMsg<S, C> (title: string, rs: MgrSdkEnterRS<S>, props: S, imgId: string, imgUrl: string) {
        let txtQuery = rs.ToQueryStr (props);
        return {
            title: title,
            imageUrl: imgUrl,
            imageUrlId: imgId,
            query: txtQuery
        };
    }

    WXShare<S, C>(title: string, rs: MgrSdkEnterRS<S>, props: S, imgId: string, imgUrl: string) {
        let msg = this.CreateShareMsg (
            title,
            rs,
            props,
            imgId,
            imgUrl
        );
        MgrSdk.inst.Log (`wx: shareAppMessage title[${title}] query[${msg.query}] imgId[${imgId}] `);
        MgrSdkCoreWX.wx.shareAppMessage (msg);
    }

    WXGetOpenId() {
        return this.openId;
    }

    WXHelpCommit(openId: string, idProp: number): Promise<any> {
        let ctrl = BCPromiseCtrl.Pop<string> (APP);
        this.CloudCertain (new MgrSdkCoreWXCloudCallRecord ({
            rs: MgrSdkCoreWXCloudFunctionRS.helpCommit,
            t: {
                help_open_id: openId,
                help_id_prop: idProp
            },
            success: (resp) => {
                ctrl.resolve (resp.msg);
            },
            fail: (resp) => {

            }
        }))
        return ctrl._promise;
    }

    /**
     * 生成 id 的种子
     */
    idSeek = 0;
    /**
     * id 到音频实例的映射
     */
    mapIdToAudioInst: Map <number, WXAudio> = new Map ();

    AudioPlay (clip: cc.AudioClip, loop: boolean, volume: number): number {
        let id = ++this.idSeek;
        let audioInst = this.AudioGet (clip);
        this.mapIdToAudioInst.set (id, audioInst);
        audioInst.id = id;
        audioInst.loop = loop;
        audioInst.volume = volume;
        audioInst.currStatus.OnPlay ();
        return id;
    }
    AudioStop(idAudio: number): void {
        let audioInst = this.mapIdToAudioInst.get (idAudio);
        if (!audioInst) {
            return;
        };
        audioInst.currStatus.OnStop ();
        this.mapUrlToPool.get (audioInst.src).push (audioInst);
    }
    AudioVolume(idAudio: number, volume: number): void {
        let audioInst = this.mapIdToAudioInst.get (idAudio);
        if (!audioInst) {
            return;
        };
        audioInst.volume = volume;
        audioInst.currStatus.OnVolume ();
    }

    /**
     * 播放源路径到对象池的映射
     */
    mapUrlToPool: Map <string, Array <WXAudio>> = new Map ();
    /**
     * 获取音频播放的实例
     * @param clip 
     * @returns 
     */
    AudioGet (clip: cc.AudioClip) {
        let url = clip.nativeUrl;
        if (!this.mapUrlToPool.has (url)) {
            this.mapUrlToPool.set (url, new Array ());
        };
        let pool = this.mapUrlToPool.get (url);
        let inst: WXAudio;
        if (pool.length == 0) {
            inst = new WXAudio (url);
        }
        else {
            inst = pool.pop ();
        };
        return inst;
    }
}

namespace MgrSdkCoreWX {
    
}

export default MgrSdkCoreWX;