import IndexDataModule from "./IndexDataModule";
import jiang from "./frame/global/Jiang";
import UINodeType from "./frame/ui/UINodeType";
import GameElementBodyBehaviourRS from "./game/game_element/body/GameElementBodyBehaviourRS";
import VoiceOggView from "./game/view/voice_ogg/VoiceOggView";
import VoiceOggViewState from "./game/view/voice_ogg/VoiceOggViewState";
import UtilObjPool from "./frame/basic/UtilObjPool";
import BCPromiseCtrl from "./frame/basic/BCPromiseCtrl";
import TipsView from "./game/view/tips_view/TipsView";
import TipsViewState from "./game/view/tips_view/TipsViewState";
import GameElementBuffRS from "./game/game_element/buff/GameElementBuffRS";
import EquipmentInstRS from "./game/game_element/equipment/EquipmentInstRS";
import utilString from "./frame/basic/UtilString";
import CfgCacheChapterLevel from "./game/cfg_cache/CfgCacheChapterLevel";
import CfgCacheChapter from "./game/cfg_cache/CfgCacheChapter";
import GameCfgBodyCacheDrop from "./game/game_element/body/GameCfgBodyCacheDrop";
import GameCfgBodyCacheDropRS from "./game/game_element/body/GameCfgBodyCacheDropRS";
import CfgCacheStoreUnlockRS from "./game/cfg_cache/CfgCacheStoreUnlockRS";
import CfgCacheStore from "./game/cfg_cache/CfgCacheStore";
import CfgCacheLotteryUnlockRS from "./game/cfg_cache/CfgCacheLotteryUnlockRS";
import CfgCacheLottery from "./game/cfg_cache/CfgCacheLottery";
import BlurView from "./game/view/blur_view/BlurView";
import BlurViewState from "./game/view/blur_view/BlurViewState";
import CfgGameElement from "./frame/config/src/CfgGameElement";
import CfgEff from "./frame/config/src/CfgEff";
import CfgVoiceOgg from "./frame/config/src/CfgVoiceOgg";
import CfgCacheGameElement from "./game/cfg_cache/CfgCacheGameElement";
import CfgCacheEquipment from "./game/cfg_cache/CfgCacheEquipment";
import UtilArray from "./frame/basic/UtilArray";
import gameCommon from "./game/GameCommon";
import GUideMgrView from "./game/view/guide_view/GuideMgrView";
import GuideMgr from "./game/view/guide_view/GuideMgr";
import ScreenShotView from "./game/view/screen_shot_view/ScreenShotView";
import ScreenShotViewState from "./game/view/screen_shot_view/ScreenShotViewState";
import CfgChapter from "./frame/config/src/CfgChapter";
import CfgCacheScene from "./game/cfg_cache/CfgCacheScene";
import IndexViewBtn from "./game/view/index_view/IndexViewBtn";
import IndexViewTag from "./game/view/index_view/IndexViewTag";
import MgrSdk from "./frame/sdk/MgrSdk";
import LoadingView from "./game/view/loading_view/LoadingView";
import LoadingViewState from "./game/view/loading_view/LoadingViewState";
import FontView from "./game/view/font_view/FontView";
import FontViewState from "./game/view/font_view/FontViewState";
import EquipmentLvUpSumViewItem from "./game/view/equipment_lv_up_sum_view/EquipmentLvUpSumViewItem";
import EquipmentLvUpSumView from "./game/view/equipment_lv_up_sum_view/EquipmentLvUpSumView";
import LockView from "./game/view/lock_view/LockView";
import LockViewState from "./game/view/lock_view/LockViewState";
import utilMath from "./frame/basic/UtilMath";
import FlashView from "./game/view/flash_view/FlashView";
import DefineVoice from "./game/game_element/body/DefineVoice";
import LvUpBatchView from "./game/view/lv_up_batch_view/LvUpBatchView";
import LvUpBatchViewItem from "./game/view/lv_up_batch_view/LvUpBatchViewItem";

const APP = `indexLoading`;

namespace indexLoading {
    /**
     * 总量
     */
    export let totalCount = 1;

    /**
     * 已完成量
     */
    export let finishedCount = 0;

    /**
     * 初始化
     */
    export function Init () {
        let appIdAsyncMax = jiang.mgrRes.AsyncMaxApp ();
        let appIdLock: number;
        Promise.resolve()
            .then (() => {
                let promiseBundleLoad = jiang.mgrRes.mgrBundle.GetLoadRecord(gameCommon.SUB_MAIN).process._promise;
                // 加载主分包
                let arrPromise: Array<Promise <any>> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                arrPromise.push (promiseBundleLoad);
                let costMayBe = 2000;
                let countSplit = 10;
                let timeSpace = costMayBe / countSplit;
                for (let i = 1; i <= countSplit; i++) {
                    let ctrl = BCPromiseCtrl.Pop (APP);
                    promiseBundleLoad.then (() => ctrl.resolve(null));
                    setTimeout (() => ctrl.resolve(null), i * timeSpace );
                    arrPromise.push (ctrl._promise);
                };
                return this.EnterLoad(
                    1,
                    arrPromise,
                    `加载资源..`
                );
            })
            .then(() => {
                jiang.mgrCfg.Init ();
                return this.EnterLoad(
                    2,
                    jiang.mgrCfg.promiseArr,
                    `加载配置..`
                );
            })
            // 进行配置缓存
            .then(() => {
                // 锁定界面
                jiang.mgrUI.Open (
                    LockView.nodeType,
                    LockViewState.Pop (APP)
                );

                // 上锁
                appIdLock = LockViewState.inst.LockApp ();

                // 字体界面
                jiang.mgrUI.Open (
                    FontView.nodeType,
                    FontViewState.Pop (APP)
                );

                // 全局静态 - 画面捕获
                jiang.mgrUI.Open (
                    ScreenShotView.nodeType,
                    new ScreenShotViewState ()
                );

                // 全局静态 - 初始化模糊界面
                jiang.mgrUI.Open (
                    BlurView.nodeType,
                    BlurViewState.Pop(APP)
                );
            
                // 全局静态 - 初始化提示框
                jiang.mgrUI.Open(
                    TipsView.nodeType,
                    TipsViewState.Pop(APP)
                );
            
                // 全局静态 - 初始化 ogg 播放器
                jiang.mgrUI.Open (
                    VoiceOggView.nodeType,
                    VoiceOggViewState.Pop(APP)
                );

                // 全局静态 - 引导界面
                jiang.mgrUI.Open (
                    GUideMgrView.nodeType,
                    GuideMgr.inst
                );
                
                // 所有配置加载完成的标识
                promiseCfgLoaded.resolve(null);

                // 场景数据
                for (let i = 0; i < jiang.mgrCfg.cfgScene._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgScene._list [i];
                    let cache: CfgCacheScene = {
                        idCfg: cfg.id,
                        colorLight: utilString.ParseSharpStrToCCColor (cfg.color_light),
                        colorDark: utilString.ParseSharpStrToCCColor (cfg.color_shadow)
                    };
                    CfgCacheScene.SetCache (cfg, cache);
                };

                // 商店数据缓存
                for (let i = 0; i < jiang.mgrCfg.cfgStore._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgStore._list [i];
                    let rs = CfgCacheStoreUnlockRS.mapIdToRS.get (cfg.unlock_logic);
                    let cache: CfgCacheStore = {
                        unlockRS: rs,
                        unlockRSProps: rs.propsCreator (cfg)
                    };
                    CfgCacheStore.SetCache (cfg, cache);
                };

                // 乐透数据缓存
                for (let i = 0; i < jiang.mgrCfg.cfgLottery._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgLottery._list [i];
                    let rs = CfgCacheLotteryUnlockRS.mapIdToRS.get (cfg.unlock_logic);
                    let cache: CfgCacheLottery = {
                        unlockRS: rs,
                        unlockRSProps: rs.propsCreator (cfg)
                    };
                    CfgCacheLottery.SetCache (cfg, cache);
                };
                // 章节数据缓存
                for (let i = 0; i < jiang.mgrCfg.cfgChapter._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgChapter._list [i];
                    let recChapter: CfgCacheChapter = {
                        idCfg: cfg.id,
                        listMonsterSortByIdCfg: [],
                        levelMin: null,
                        levelMax: null,
                        powerSum: 0,
                        // 章节强度底数 x 标准强度系数
                        powerStandard: jiang.mgrCfg.cfgCommon._list [0].inc_for_chapter ** i * jiang.mgrCfg.cfgCommon._list [0].standard_chapter_power_sum
                    };
                    CfgCacheChapter.SetCache (cfg, recChapter);
                };

                // 关卡数据缓存
                for (let i = 0; i < jiang.mgrCfg.cfgLevel._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgLevel._list[i];
                    let arr: Array<number> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
                    for (let i = 0; i < cfg.part_0_monster_id.length; i++) {
                        let monsterCfgId = cfg.part_0_monster_id[i];
                        arr.push(monsterCfgId);
                    };
                    for (let i = 0; i < cfg.part_1_monster_id.length; i++) {
                        let monsterCfgId = cfg.part_1_monster_id[i];
                        arr.push(monsterCfgId);
                    };
                    for (let i = 0; i < cfg.part_2_monster_id.length; i++) {
                        let monsterCfgId = cfg.part_2_monster_id[i];
                        arr.push(monsterCfgId);
                    };
                    let arrOrigin: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                    arrOrigin.push (...arr);
                    UtilArray.RemRepeat (arr);
                    arr.sort((a, b) => {
                        return - a + b;
                    });
                    let powerSum = 0;
                    for (let i = 0; i < arrOrigin.length; i++) {
                        let idCfg = arrOrigin [i];
                        let cfgInst = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfg)._list [0];
                        powerSum += cfgInst.power;
                    };
                    // boss 关卡
                    let isBossLevel = false;
                    for (let i = 0; i < arr.length; i++) {
                        let idCfgBody = arr [i];
                        let idCfgBodyConfig = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfgBody)._list [0];
                        if (0 < idCfgBodyConfig.is_boss) {
                            isBossLevel = true;
                            break;
                        };
                    };
                    // 关卡的缓存
                    let recLevel: CfgCacheChapterLevel = {
                        idLev: cfg.id,
                        listMonster: arr,
                        powerSum: powerSum,
                        isBossLevel: isBossLevel
                    };
                    CfgCacheChapterLevel.idToCacheMap.set(recLevel.idLev, recLevel);

                    // 章节的缓存
                    let cfgChapter = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, cfg.relChapter)._list [0];
                    let recChapter = CfgCacheChapter.GetCache (cfgChapter);
                    recChapter.listMonsterSortByIdCfg.push (...arr);
                    if (recChapter.levelMin == null || recLevel.idLev < recChapter.levelMin) {
                        recChapter.levelMin = recLevel.idLev;
                    };
                    if (recChapter.levelMax == null || recChapter.levelMax < recLevel.idLev) {
                        recChapter.levelMax = recLevel.idLev;
                    };
                    recChapter.powerSum += recLevel.powerSum;
                };

                // 章节数据缓存
                let mapIdToChapter: Map <number, number> = new Map ();
                for (let i = 0; i < jiang.mgrCfg.cfgChapter._list.length; i++) {
                    let cfgChapter = jiang.mgrCfg.cfgChapter._list [i];
                    let cacheChapter = CfgCacheChapter.GetCache (cfgChapter);
                    UtilArray.RemRepeat (cacheChapter.listMonsterSortByIdCfg)
                    cacheChapter.listMonsterSortByIdCfg.sort ((a, b) => {
                        let numIdxCountA = utilMath.GetNumIdxCount (a);
                        let numIdxCountB = utilMath.GetNumIdxCount (b);
                        // 特色怪优先
                        if (numIdxCountA != numIdxCountB) {
                            return numIdxCountA - numIdxCountB;
                        };
                        return b - a;
                    });
                    // 记录下怪物 id 到章节的映射
                    for (let i = 0; i < cacheChapter.listMonsterSortByIdCfg.length; i++) {
                        let monsterId = cacheChapter.listMonsterSortByIdCfg [i];
                        mapIdToChapter.set (monsterId, cacheChapter.idCfg);
                    };
                };

                // buff 的预制缓存
                for (let i = 0; i < jiang.mgrCfg.cfgBuffProps._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgBuffProps._list[i];
                    let rs = GameElementBuffRS.instMap.get(cfg.logic);
                    cfg[GameElementBuffRS.SYM_REC] = rs.cfgToArgs(cfg);
                };

                // 装备的预制缓存
                for (let i = 0; i < jiang.mgrCfg.cfgEquipmentProps._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgEquipmentProps._list[i];
                    let rs = EquipmentInstRS.instMap.get(cfg.logic);
                    let cfgArgs = rs.cfgToArgs(cfg);
                    let dataCache: CfgCacheEquipment = {
                        args: cfgArgs,
                        aditionalBody: rs.aditionalBody (cfg, cfgArgs),
                        aditionalEff: rs.aditionalEff (cfg, cfgArgs),
                        aditionalVoice: rs.aditionalVoice (cfg, cfgArgs)
                    };
                    CfgCacheEquipment.SetCache (cfg, dataCache);
                };

                // 用于去重的集合
                let setForRemoveRepeat: Set<number> = UtilObjPool.Pop (UtilObjPool.typeSet, APP);
                // 怪物身躯预制缓存
                for (let i = 0; i < jiang.mgrCfg.cfgGameElement._list.length; i++) {
                    let cfg = jiang.mgrCfg.cfgGameElement._list[i];
                    let rs = GameElementBodyBehaviourRS.instMap.get(cfg.logic);
                    let colorParse = utilString.ParseStrToCCColor (cfg.color_main);
                    let cfgArgs = rs.cfgToArgs(cfg);
                    let cache: CfgCacheGameElement = {
                        colorMain: new cc.Color (colorParse.r, colorParse.g, colorParse.b, 255),
                        opacityMain: colorParse.a,
                        relChapter: mapIdToChapter.get (cfg.id),
                        logicArgs: cfgArgs,
                        listDrop: UtilObjPool.Pop (UtilObjPool.typeArray, APP),
                        listAditionBody: rs.aditionalBody (cfg, cfgArgs),
                        listAditionEff: rs.aditionalEff (cfg, cfgArgs),
                        listAditionVoice: rs.aditionalVoice (cfg, cfgArgs)
                    };
                    // 归属的章节信息
                    let relChapter = mapIdToChapter.get (cfg.id);
                    let relChapterCfg = jiang.mgrCfg.cfgChapter.select (CfgChapter.idGetter, relChapter)._list [0];
                    let relChapterCache = CfgCacheChapter.GetCache (relChapterCfg);
                    // 附加物体
                    setForRemoveRepeat.clear ();
                    for (let i = cache.listAditionBody.length - 1; 0 <= i; i--) {
                        let idCfg = cache.listAditionBody [i];
                        // 配置不存在
                        if (jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfg)._list.length == 0) {
                            console.error (`CfgGameElement[${cfg.id}] 的附加物体 [${idCfg}] 不存在`);
                            // 剔除
                            cache.listAditionBody.splice (i, 1);
                            continue;
                        };
                        // 去重
                        if (setForRemoveRepeat.has (idCfg)) {
                            cache.listAditionBody.splice (i, 1);
                            continue;
                        };
                        // 否则记录它的存在
                        setForRemoveRepeat.add (idCfg);
                    };
                    // 附加特效
                    setForRemoveRepeat.clear ();
                    for (let i = cache.listAditionEff.length - 1; 0 <= i; i--) {
                        let idCfg = cache.listAditionEff [i];
                        // 配置不存在
                        if (jiang.mgrCfg.cfgEff.select (CfgEff.idGetter, idCfg)._list.length == 0) {
                            console.error (`CfgGameElement[${cfg.id}] 的附加特效 [${idCfg}] 不存在`);
                            // 剔除
                            cache.listAditionEff.splice (i, 1);
                            continue;
                        };
                        // 去重
                        if (setForRemoveRepeat.has (idCfg)) {
                            cache.listAditionEff.splice (i, 1);
                            continue;
                        };
                        // 否则记录它的存在
                        setForRemoveRepeat.add (idCfg);
                    };
                    // 附加音效
                    setForRemoveRepeat.clear ();
                    for (let i = cache.listAditionVoice.length - 1; 0 <= i; i--) {
                        let idCfg = cache.listAditionVoice [i];
                        // 配置不存在
                        if (jiang.mgrCfg.cfgVoiceOgg.select (CfgVoiceOgg.idGetter, idCfg)._list.length == 0) {
                            if (idCfg != 0) {
                                console.error (`CfgGameElement[${cfg.id}] 的附加音效 [${idCfg}] 不存在`);
                            };
                            // 剔除
                            cache.listAditionVoice.splice (i, 1);
                            continue;
                        };
                        // 去重
                        if (setForRemoveRepeat.has (idCfg)) {
                            cache.listAditionVoice.splice (i, 1);
                            continue;
                        };
                        // 否则记录它的存在
                        setForRemoveRepeat.add (idCfg);
                    };

                    // 掉落物 0
                    if (GameCfgBodyCacheDropRS.mapCodeToRS.has (cfg.drop_0_type) && relChapterCache) {
                        let dropItem: GameCfgBodyCacheDrop = {
                            type: cfg.drop_0_type,
                            val: cfg.drop_0_val,
                            rs: null
                        };
                        cache.listDrop.push (dropItem);
                    };

                    // 给奖励掉落生成缓存
                    for (let j = 0; j < cache.listDrop.length; j++) {
                        let cacheDrop = cache.listDrop [j];
                        cacheDrop.rs = GameCfgBodyCacheDropRS.mapCodeToRS.get (cacheDrop.type);
                    };
                    CfgCacheGameElement.SetCache (cfg, cache);
                };
            })
            // 进行资源缓存
            .then(() => {
                let loadList: Array<Promise<unknown>> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(FontView.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(LockView.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(LoadingView.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(FlashView.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(EquipmentLvUpSumView.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(EquipmentLvUpSumViewItem.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(LvUpBatchView.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(LvUpBatchViewItem.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(IndexViewBtn.nodeType._prefabPath).process._promise);
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(IndexViewTag.nodeType._prefabPath).process._promise);
                let cfgVoice = jiang.mgrCfg.cfgVoiceOgg.select (CfgVoiceOgg.idGetter, DefineVoice.EQUIPMENT_DROP_TRIGGER)._list [0];
                loadList.push (jiang.mgrRes.mgrAssets.GetLoadRecord(cfgVoice.res).process._promise);
                return this.EnterLoad(
                    3,
                    loadList,
                    `加载预制..`
                );
            })
            // sdk 初始化
            .then (() => {
                return MgrSdk.inst.core.Init ();
            })
            // 时间同步
            .then (() => {
                // 从此每次切换到显示状态，重新同步时间
                jiang.mgrEvter.evterShow.On (() => {
                    // 同步时间期间上锁
                    let lockAppId = LockViewState.inst.LockApp ();
                    jiang.mgrDateNow.currStatus.OnTime ()
                        .then (() => {
                            LockViewState.inst.LockCancel (lockAppId);
                        });
                });
                return jiang.mgrDateNow.currStatus.OnTime ();
            })
            // 存档初始化
            .then(() => {
                let arrPromise: Array<Promise <any>> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                jiang.mgrData.Init();
                arrPromise.push (...jiang.mgrData.promiseArr);
                let costMayBe = 2000;
                let countSplit = 10;
                let timeSpace = costMayBe / countSplit;
                let merge = Promise.all (jiang.mgrData.promiseArr);
                for (let i = 1; i <= countSplit; i++) {
                    let ctrl = BCPromiseCtrl.Pop (APP);
                    merge.then (() => ctrl.resolve(null));
                    setTimeout (() => ctrl.resolve(null), i * timeSpace );
                    arrPromise.push (ctrl._promise);
                };
                return this.EnterLoad(
                    4,
                    arrPromise,
                    `读取存档..`
                );
            })
            .then(() => {
                // 从此每次隐藏都自动保存
                jiang.mgrEvter.evterHide.On (() => {
                    jiang.mgrData.DoSave ();
                });

                jiang.mgrRes.AsyncMaxCancel (appIdAsyncMax);
                GuideMgr.inst.currStatus.OnInited ();
                promiseAllLoad.resolve(null);
                jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_MAIN);
            })
            .then (() => {
                // 权限放这里是因为，ui 没显示出来，玩家根本不会主动去点击画面
                return MgrSdk.inst.core.Author ();
            })
            .then (() => {
                LockViewState.inst.LockCancel (appIdLock);
            });
    }

    /**
     * 全部加载完毕
     */
    export let promiseAllLoad = BCPromiseCtrl.Pop (APP);

    /**
     * 存档加载完毕
     */
    export let promiseStorageLoad = BCPromiseCtrl.Pop (APP);

    /**
     * 配置加载完毕
     */
    export let promiseCfgLoaded = BCPromiseCtrl.Pop (APP);

    /**
     * 索引
     */
    export let indexCurrent: number = 1;

     /**
      * 索引 - 总
      */
    export let indexTotal: number = 4;
 
     /**
      * 提示信息
      */
    export let information: string = `加载中..`;
 
    /**
     * 时间记录
     */
    let tickRecord = Date.now ();

     /**
      * 进入加载
      * @param loadList 
      * @param msg 
      */
    export function EnterLoad (
        index: number,
        loadList: Array<Promise<unknown>>,
        msg: string
    ) 
    {
        indexCurrent = index;
        information = msg;
        totalCount = loadList.length;
        finishedCount = 0;
        loadList.forEach(( promise ) => {
            promise.then(() => {
                finishedCount++;
                jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_MAIN);
            });
        });
        let tickStart = Date.now ();
        let tickStartCost = tickStart - tickRecord;
        tickRecord = tickStart;
        MgrSdk.inst.Log (`EnterLoad idx[${index}] start[${tickStart}] cost[${tickStartCost}]...`);
        return Promise.all([
            Promise.all (loadList)
                .then (() => {
                    let tickEnd = Date.now ();
                    let tickEndCost = tickEnd - tickRecord;
                    tickRecord = tickEnd;
                    MgrSdk.inst.Log (`EnterLoad idx[${index}] end[${tickEnd}] cost[${tickEndCost}]...`);
                }),
            UtilObjPool.PopPromise (
                APP, 
                ( resolve ) => {
                    setTimeout(resolve, 200);
                }
            )
        ]);
    }
};

export default indexLoading;