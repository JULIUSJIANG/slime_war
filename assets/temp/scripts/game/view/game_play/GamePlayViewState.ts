import DebugViewDefine from "../../../frame/debug/DebugViewDefine";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import ViewState from "../../../frame/ui/ViewState";
import BCEventer from "../../../frame/basic/BCEventer";
import IndexDataModule from "../../../IndexDataModule";
import IndexLayer from "../../../IndexLayer";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import PlayOrdinary from "../../play_ordinary/PlayOrdinary";
import indexDataStorageItem from "../../../IndexStorageItem";
import GamePlayViewStateMgrTrace from "./GamePlayViewStateMgrTrace";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import GamePlayView from "./GamePlayView";
import LoadingView from "../loading_view/LoadingView";
import LoadingViewState from "../loading_view/LoadingViewState";
import GamePlayViewTrace from "./GamePlayViewTrace";
import GamePlayViewEquipmentBtn from "./GamePlayViewEquipmentBtn";
import DefineEff from "../../game_element/body/DefineEff";
import GameDisplayPart from "../../display/GameDisplayPart";
import GameSizeMarkRS from "../../game_element/body/GameSizeMarkRS";
import CfgEquipmentProps from "../../../frame/config/src/CfgEquipmentProps";
import CfgCacheEquipment from "../../cfg_cache/CfgCacheEquipment";
import CfgCacheGameElement from "../../cfg_cache/CfgCacheGameElement";
import CfgGameElement from "../../../frame/config/src/CfgGameElement";
import UtilArray from "../../../frame/basic/UtilArray";
import GameDisplayBG from "../../display/GameDisplayBG";
import GameDisplayReward from "../../display/GameDisplayReward";
import GameDisplayParticleRain from "../../display/GameDisplayParticleRain";
import GameDisplayParticleSnow from "../../display/GameDisplayParticleSnow";
import GameDisplayLightPoint from "../../display/GameDisplayLightPoint";
import CfgEff from "../../../frame/config/src/CfgEff";
import GameDisplayEff from "../../display/GameDisplayEff";
import GameDisplayHp from "../../display/GameDisplayHp";
import GameDisplayHp01 from "../../display/GameDisplayHp01";
import GameDisplayTxt from "../../display/GameDisplayTxt";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import GameCfgBodyCacheDrop from "../../game_element/body/GameCfgBodyCacheDrop";
import EquipmentViewEquip from "../equipment_view/EquipmentViewEquip";
import EquipmentViewBackpackProp from "../equipment_view/EquipmentViewBackpackProp";
import CfgBackpackProp from "../../../frame/config/src/CfgBackpackProp";
import CfgVoiceOgg from "../../../frame/config/src/CfgVoiceOgg";
import DefineVoice from "../../game_element/body/DefineVoice";
import GuideMgr from "../guide_view/GuideMgr";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import GamePlayViewMachine from "./GamePlayViewMachine";
import PlayOrdinaryRS from "../../play_ordinary/PlayOrdinaryRS";
import CfgScene from "../../../frame/config/src/CfgScene";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import ChapterUnlockViewCard from "../chapter_unlock_view/ChapterUnlockViewCard";
import GamePlayViewBossBoard from "./GamePlayViewBossBoard";
import UIRoot from "../../../frame/ui/UIRoot";

const APP = `GamePlayViewState`;

/**
 * 游戏界面
 */
export default class GamePlayViewState extends ViewState {
    
    private constructor () {
        super(
            IndexLayer.GAME,
            ViewState.BG_TYPE.SELF,
            false
        );
    }

    private static _t = new UtilObjPoolType<GamePlayViewState>({
        instantiate: () => {
            return new GamePlayViewState();
        },
        onPop: (t) => {
            
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static _idGen = 0;

    static Pop (
        apply: string,
        playMachine: GamePlayViewMachine
    ) 
    {
        let id = ++this._idGen;
        let val = UtilObjPool.Pop(GamePlayViewState._t, apply);
        val.mgrTrace = GamePlayViewStateMgrTrace.Pop(APP, val);
        val.cameraXOffset = jiang.mgrUI._containerUI.width / 2;
        val.playMachine = playMachine;
        // 生成绘制信息
        val._b2Info = DebugViewDefine.B2DrawInfo.Pop(
            APP,
            playMachine.gameState.b2w,
            1 / jiang.mgrUI._sizePerPixel,
            0,
            0
        );
        // 添加绘制信息
        DebugViewDefine.b2wList.push(val._b2Info);

        let step = (ms: number) => {
            ms *= playMachine.gameState._timeScale;
            GuideMgr.inst.currStatus.P1U2OnGameCoreStep (ms);
            jiang.mgrUI.ModuleRefresh(IndexDataModule.PLAYING);
            playMachine.OnStep (ms);

            val.cameraPos.x = playMachine.gameState.player.commonFootPos.x + (jiang.mgrUI._containerUI.width / 2 + gameCommon.CAMERA_OFFSET_X ) / val.sceneScale;
            val.cameraPos.y = gameCommon.GROUND_Y + (jiang.mgrUI._containerUI.height / 2 + gameCommon.CAMERA_OFFSET_Y ) / val.sceneScale;
            val.borderLeft = playMachine.gameState.player.commonFootPos.x + gameCommon.CAMERA_OFFSET_X;

            let npcEle = val.playMachine.gameState.player;
            if (npcEle != null) {
                val._b2Info.cameraPixelPerSize = 1 / jiang.mgrUI._sizePerPixel * val.sceneScale;
                val._b2Info.cameraX = val.cameraPos.x * jiang.mgrUI._sizePerPixel;
                val._b2Info.cameraY = val.cameraPos.y * jiang.mgrUI._sizePerPixel;
            };

            val.mgrTrace.OnStep(ms);
        }

        // 时间自动推进
        val._updateListenId = jiang.mgrEvter.evterUpdate.On(step);

        let num1Code = Number.parseInt (cc.macro.KEY[`1`]);
        let num9Code = Number.parseInt (cc.macro.KEY[`9`]);
        val.listenIdKeyDown = jiang.mgrEvter.evterKeyDown.On((key) => {
            if (GuideMgr.inst.currStatus != GuideMgr.inst.statusIdle) {
                return;
            };
            let keyNum = key as number;
            // 按下的是数字，直接设置装备
            if (num1Code <= keyNum && keyNum <= num9Code) {
                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                mbPlayer.playerMgrEquipment.SetEquipmentIdx (keyNum - num1Code);
            };
            // 按下的是控制，按顺序切换装备
            if (key == cc.macro.KEY.ctrl) {
                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                mbPlayer.playerMgrEquipment.SetEquipmentIdx ((mbPlayer.playerMgrEquipment.currEquipIdx + 1) % mbPlayer.playerMgrEquipment.listEquipmentInst.length);
            };
            // 按下的是空格，进行格挡
            if (key == cc.macro.KEY.space) {
                mbPlayer.playerMgrDefendCD.currStatus.OnDefend ();
            };
        });
        // 隐藏的时候自动暂停
        val.listenHide = jiang.mgrEvter.evterHide.On(() => {
            // 非新手引导情况下自动暂停
            if (GuideMgr.inst.currStatus == GuideMgr.inst.statusIdle) {
                playMachine.OnPause ();
            };
        });
        val.listenShow = jiang.mgrEvter.evterShow.On(() => {
            
        });
        let npcEle = val.playMachine.gameState.player;
        let mbPlayer = npcEle.commonBehaviour as MBPlayer;
        val.mpNeed = false;
        for (let i = 0; i < mbPlayer.playerMgrEquipment.listEquipmentInst.length; i++) {
            let equipInst = mbPlayer.playerMgrEquipment.listEquipmentInst [i];
            val.mpNeed = val.mpNeed || 0 < equipInst.cfgProps.props_cost;
        };
        mbPlayer.playerMgrEquipment.listEquipmentInst
        return val;
    }

    /**
     * 需要能量辅助
     */
    mpNeed: boolean;

    /**
     * 相机位置
     */
    cameraPos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 视图左边界当前的位置
     */
    borderLeft: number = 0;
    /**
     * 开启入场动画
     */
    enableEnterAnim = false;
    /**
     * 开启离场动画
     */
    enableExitAnim = false;
    /**
     * 绘制信息
     */
    _b2Info: DebugViewDefine.B2DrawInfo;
    /**
     * 刷新监听
     */
    _updateListenId: number;
    /**
     * 游戏的核心状态
     */
    playMachine: GamePlayViewMachine;
    /**
     * 相机 x 偏移
     */
    cameraXOffset: number = 0;
    /**
     * 事件监听-按钮按下
     */
    listenIdKeyDown: number;
    /**
     * 事件监听-按钮抬起
     */
    listenIdKeyUp: number;
    /**
     * 事件监听-隐藏
     */
    listenHide: number;
    /**
     * 事件监听-显示
     */
    listenShow: number;
    /**
     * 开火位置
     */
    firePos: cc.Vec2 = UtilObjPool.Pop(UtilObjPool.typeccVec2, APP);
    /**
     * 场景缩放
     */
    sceneScale = gameCommon.SCENE_SCALE;
    /**
     * 管理器 - 轨迹
     */
    mgrTrace: GamePlayViewStateMgrTrace;

    OnInit(): void {
        GuideMgr.inst.CatchGamePlayViewState (this);
    }

    OnDestory(): void {
        jiang.mgrEvter.evterKeyDown.Off(this.listenIdKeyDown);
        jiang.mgrEvter.evterKeyUp.Off(this.listenIdKeyUp);
        DebugViewDefine.b2wList.splice(DebugViewDefine.b2wList.indexOf( this._b2Info ), 1);
        jiang.mgrEvter.evterUpdate.Off(this._updateListenId);
        jiang.mgrEvter.evterHide.Off(this.listenHide);
        jiang.mgrEvter.evterShow.Off(this.listenShow);

        // 释放占用的内存
        this.playMachine.gameState.Release();
        // 通知
        this.mgrTrace.OnDestory();
    }

    /**
     * 挑战最新一关
     */
    public static FightLast () {
        GamePlayViewState.Fight (jiang.mgrData.Get(indexDataStorageItem.challengeLev));
    }

    public static GetListPrefabCommon (): Array <string> {
        // 总的加载表
        let listPrefabPath: Array <string> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

        // 《特效》
        let listEff: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 治疗
        for (let i = 0; i < GameSizeMarkRS.listInst.length; i++) {
            listEff.push (GameSizeMarkRS.listInst [i].effCure)
        };
        // 召唤
        for (let i = 0; i < GameSizeMarkRS.listInst.length; i++) {
            listEff.push (GameSizeMarkRS.listInst [i].effCall)
        };
        // 传送
        for (let i = 0; i < GameSizeMarkRS.listInst.length; i++) {
            listEff.push (GameSizeMarkRS.listInst [i].effTranslation)
        };
        // 命中
        for (let i = 0; i < GameSizeMarkRS.listInst.length; i++) {
            listEff.push (GameSizeMarkRS.listInst [i].effHit)
        };
        // 通用
        listEff.push (DefineEff.DMG);
        listEff.push (DefineEff.BOOM);
        UtilArray.RemRepeat (listEff);

        // 《音效》
        let listVoice: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 音效
        listVoice.push (DefineVoice.EQUIPMENT_DROP_TRIGGER);
        listVoice.push (DefineVoice.EQUIPMENT_DROP_GOT);
        listVoice.push (DefineVoice.ITEM_DROP_GOT);
        listVoice.push (DefineVoice.DEFENDING);
        listVoice.push (DefineVoice.DEFENDED);
        listVoice.push (DefineVoice.HURTED);
        listVoice.push (DefineVoice.MONSTER_ATK);
        listVoice.push (DefineVoice.HORSE_DIRT_1);
        listVoice.push (DefineVoice.HORSE_DIRT_2);
        listVoice.push (DefineVoice.CLEAR_SCREEN);
        UtilArray.RemRepeat (listVoice);

        // 残影
        listPrefabPath.push (
            GamePlayViewTrace.nodeType._prefabPath
        );
        // 奖励
        listPrefabPath.push (
            GameDisplayReward.nodeTypeForEquipment._prefabPath,
            GameDisplayReward.nodeTypeForParticle._prefabPath,
        );
        // 雨滴
        listPrefabPath.push (
            GameDisplayParticleRain.nodeType._prefabPath
        );
        // 雪
        listPrefabPath.push (
            GameDisplayParticleSnow.nodeType._prefabPath
        );
        // 碎块
        listPrefabPath.push (
            GameDisplayPart.nodeType101._prefabPath,
            GameDisplayPart.nodeType102._prefabPath,
            GameDisplayPart.nodeType103._prefabPath,
            GameDisplayPart.nodeType104._prefabPath,
            GameDisplayPart.nodeType105._prefabPath,
            GameDisplayPart.nodeType106._prefabPath,
            GameDisplayPart.nodeType107._prefabPath,
            GameDisplayPart.nodeType108._prefabPath,
            GameDisplayPart.nodeType109._prefabPath,
            GameDisplayPart.nodeType110._prefabPath,
            GameDisplayPart.nodeType201._prefabPath,
            GameDisplayPart.nodeType202._prefabPath,
            GameDisplayPart.nodeType203._prefabPath,
            GameDisplayPart.nodeType204._prefabPath,
            GameDisplayPart.nodeType205._prefabPath,
            GameDisplayPart.nodeType206._prefabPath,
            GameDisplayPart.nodeType207._prefabPath,
            GameDisplayPart.nodeType208._prefabPath,
            GameDisplayPart.nodeType209._prefabPath,
            GameDisplayPart.nodeType210._prefabPath
        );
        // 光点
        listPrefabPath.push (
            GameDisplayLightPoint.nodeType._prefabPath
        );
        // 特效
        for (let i = 0; i < listEff.length; i++) {
            let idCfg = listEff [i];
            let idCfgConfig = jiang.mgrCfg.cfgEff.select (CfgEff.idGetter, idCfg)._list [0];
            if (!idCfgConfig) {
                console.error (`特效[${idCfg}]不存在`);
                continue;
            };
            listPrefabPath.push (
                GameDisplayEff.GetNodeType (idCfg)._prefabPath
            );
        };
        // 面板
        listPrefabPath.push (
            GameDisplayHp.nodeType._prefabPath,
            GameDisplayHp01.nodeType._prefabPath,
            GamePlayViewBossBoard.nodeType._prefabPath
        );
        // 文本
        listPrefabPath.push (
            GameDisplayTxt.nodeTypeDmg._prefabPath,
            GameDisplayTxt.nodeTypeAppear._prefabPath,
            GameDisplayTxt.nodeTypeRecovery._prefabPath
        );

        // 基础 ui
        listPrefabPath.push (
            // 主界面
            GamePlayView.nodeType._prefabPath,
            // 装备切换按钮
            GamePlayViewEquipmentBtn.nodeType._prefabPath
        );
        // 音频
        for (let i = 0; i < listVoice.length; i++) {
            let idCfgVoice = listVoice [i];
            let cfg = jiang.mgrCfg.cfgVoiceOgg.select (CfgVoiceOgg.idGetter, idCfgVoice)._list [0];
            listPrefabPath.push (cfg.res);
        };
        
        // 去重
        UtilArray.RemRepeat (listPrefabPath);
        return listPrefabPath;
    }

    /**
     * 加载关卡
     * @param lev 
     */
    public static Load (lev: number) {
        // 配置 - 关卡
        let rsInit = PlayOrdinaryRS.GetRS (lev);
        // 配置 - 主题
        let cfgScene = jiang.mgrCfg.cfgScene.select(CfgScene.idGetter, rsInit.getterSceneId (lev))._list[0];

        // 总的加载表
        let listPrefabPath: Array <string> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

        // 《装备》
        let listEquipment: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        let storagedListEquip = jiang.mgrData.Get (indexDataStorageItem.listCurrentEquiped);
        for (let i = 0; i < storagedListEquip.length; i++) {
            let idEquip = storagedListEquip [i];
            if (idEquip == 0) {
                continue;
            };
            listEquipment.push (idEquip);
        };

        // 《物体》
        let listBody: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 玩家自身
        listBody.push (gameCommon.PLAYER_CFG_ID);
        // 装备产生
        for (let i = 0; i < listEquipment.length; i++) {
            let equip = listEquipment [i];
            let cfg = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, equip)._list [0];
            let cfgCache = CfgCacheEquipment.GetCache (cfg);
            listBody.push (...cfgCache.aditionalBody);
        };
        // 该关卡会召唤的单位
        let listEnemyCall = rsInit.getterListEnemyCall (lev);
        for (let i = 0; i < listEnemyCall.length; i++) {
            let listEnemyCallItem = listEnemyCall [i];
            for (let j = 0; j < listEnemyCallItem.listItem.length; j++) {
                let listEnemyCallItemEle = listEnemyCallItem.listItem [j];
                listBody.push (listEnemyCallItemEle.idCfg);
            };
        };
        // 包含所有子节点的集合
        let listBodyChildren: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 协助判断是否已经放入 listBodyChildren （处理过）
        let listBodyChildrenSetExisted: Set <number> = UtilObjPool.Pop (UtilObjPool.typeSet, APP);
        while (0 < listBody.length) {
            let pop = listBody.pop ();
            // 已有记录，忽略
            if (listBodyChildrenSetExisted.has (pop)) {
                continue;
            };
            listBodyChildrenSetExisted.add (pop);
            listBodyChildren.push (pop);
            // 获取缓存数据
            let popCache = CfgCacheGameElement.GetCache (jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, pop)._list [0]);
            // 把附加物体加进穷举里面
            listBody.push (...popCache.listAditionBody);
        };
        listBody.push (...listBodyChildren);
        UtilArray.RemRepeat (listBody);

        // 《特效》
        let listEff: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 治疗
        for (let i = 0; i < GameSizeMarkRS.listInst.length; i++) {
            listEff.push (GameSizeMarkRS.listInst [i].effCure)
        };
        // 召唤
        for (let i = 0; i < GameSizeMarkRS.listInst.length; i++) {
            listEff.push (GameSizeMarkRS.listInst [i].effCall)
        };
        // 物体产生
        for (let i = 0; i < listBody.length; i++) {
            let idCfgBody = listBody [i];
            let cfgBody = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfgBody)._list [0];
            let cfgBodyCache = CfgCacheGameElement.GetCache (cfgBody);
            listEff.push (...cfgBodyCache.listAditionEff);
        };
        // 通用
        listEff.push (DefineEff.DMG);
        UtilArray.RemRepeat (listEff);

        // 《音效》
        let listVoice: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 背景音乐
        let isBossLevel = rsInit.getterIsBossLevel (lev);
        if (isBossLevel) {
            listVoice.push (DefineVoice.BGM_BOSS);
        }
        else {
            listVoice.push (cfgScene.bgm);
        };
        // 装备产生
        for (let i = 0; i < listEquipment.length; i++) {
            let equip = listEquipment [i];
            let cfg = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, equip)._list [0];
            let cfgCache = CfgCacheEquipment.GetCache (cfg);
            listVoice.push (...cfgCache.aditionalVoice);
        };
        // 物体产生
        for (let i = 0; i < listBody.length; i++) {
            let idCfgBody = listBody [i];
            let cfgBody = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfgBody)._list [0];
            let cfgBodyCache = CfgCacheGameElement.GetCache (cfgBody);
            listVoice.push (...cfgBodyCache.listAditionVoice);
        };
        // 音效
        UtilArray.RemRepeat (listVoice);

        // 《掉落》
        let listDrop: Array<GameCfgBodyCacheDrop> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        // 物体产生
        for (let i = 0; i < listBody.length; i++) {
            let idCfgBody = listBody [i];
            let cfgBody = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, idCfgBody)._list [0];
            let cfgBodyCache = CfgCacheGameElement.GetCache (cfgBody);
            listDrop.push (...cfgBodyCache.listDrop);
        };

        // 背景
        listPrefabPath.push (
            GameDisplayBG.GetNodeTypeByRes(cfgScene.res)._prefabPath
        );
        
        // 物体
        for (let i = 0; i < listBody.length; i++) {
            let cfgBodyId = listBody [i];
            let cfgBodyIdConfig = jiang.mgrCfg.cfgGameElement.select (CfgGameElement.idGetter, cfgBodyId)._list [0];
            if (!cfgBodyIdConfig) {
                console.error (`物体[${cfgBodyId}]不存在`);
                continue;
            };
            // 场景资源
            listPrefabPath.push (cfgBodyIdConfig.res_scene);
        };
        // 特效
        for (let i = 0; i < listEff.length; i++) {
            let idCfg = listEff [i];
            let idCfgConfig = jiang.mgrCfg.cfgEff.select (CfgEff.idGetter, idCfg)._list [0];
            if (!idCfgConfig) {
                console.error (`特效[${idCfg}]不存在`);
                continue;
            };
            listPrefabPath.push (
                GameDisplayEff.GetNodeType (idCfg)._prefabPath
            );
        };
        // 玩家装备
        for (let i = 0; i < listEquipment.length; i++) {
            let idEquipment = listEquipment [i];
            let cfgEquipment = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idEquipment)._list [0];
            if (!cfgEquipment) {
                console.error (`装备[${idEquipment}]不存在`);
                continue;
            };
            listPrefabPath.push (cfgEquipment.res);
        };

        // 玩家装备 - 顶部切换
        for (let i = 0; i < listEquipment.length; i++) {
            let idEquipment = listEquipment [i];
            let cfgEquipment = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, idEquipment)._list [0];
            if (!cfgEquipment) {
                console.error (`装备[${idEquipment}]不存在`);
                continue;
            };
            listPrefabPath.push (cfgEquipment.res);
            listPrefabPath.push (cfgEquipment.icon_play_view);
        };
        // 掉落物
        for (let i = 0; i < listDrop.length; i++) {
            let listDropItem = listDrop [i];
            if (listDropItem.type == GameCfgBodyCacheDropRS.xlsxEquipment.code) {
                let cfg = jiang.mgrCfg.cfgEquipmentProps.select (CfgEquipmentProps.idGetter, listDropItem.val)._list [0];
                if (!cfg) {
                    console.error (`装备[${listDropItem.val}]不存在`);
                    continue;
                };
                listPrefabPath.push (EquipmentViewEquip.GetNodeTypeForIconScene (listDropItem.val)._prefabPath);
            };
            if (listDropItem.type == GameCfgBodyCacheDropRS.xlsxBackpackProp.code) {
                let cfg = jiang.mgrCfg.cfgBackpackProp.select (CfgBackpackProp.idGetter, listDropItem.val)._list [0];
                if (!cfg) {
                    console.error (`物品[${listDropItem.val}]不存在`);
                    continue;
                };
                listPrefabPath.push (EquipmentViewBackpackProp.GetNodeTypeForScene (listDropItem.val)._prefabPath);
            };
        };
        // 音频
        for (let i = 0; i < listVoice.length; i++) {
            let idCfgVoice = listVoice [i];
            let cfg = jiang.mgrCfg.cfgVoiceOgg.select (CfgVoiceOgg.idGetter, idCfgVoice)._list [0];
            listPrefabPath.push (cfg.res);
        };

        // 把通用的也填充进去
        listPrefabPath.push (...this.GetListPrefabCommon());
        // 去除重复了的
        UtilArray.RemRepeat (listPrefabPath);
        // 去除已加载过的
        for (let i = listPrefabPath.length - 1; 0 <= i; i--) {
            let path = listPrefabPath [i];
            if (jiang.mgrRes.GetPrefab (path)) {
                listPrefabPath.splice (i, 1);
            };
        };

        // 没有东西需要加载
        if (listPrefabPath.length == 0) {
            return Promise.resolve ();
        };
        MgrSdk.inst.Log (`加载清单：`, JSON.stringify (listPrefabPath, null, 1));
        // 所有加载需要
        let listPromise = listPrefabPath.map (path => jiang.mgrRes.mgrAssets.GetLoadRecord (path).process._promise);
        // 期间把加载线程拉满
        let appId = jiang.mgrRes.AsyncMaxApp ();
        Promise.all (listPromise)
            .then (() => {
                jiang.mgrRes.AsyncMaxCancel (appId);
            });
        let loadState = LoadingViewState.Pop (
            APP,
            listPromise
        );
        jiang.mgrUI.Open (
            LoadingView.nodeType,
            loadState
        );
        return loadState.ctrl._promise;
    }

    /**
     * 挑战
     * @param lev 
     */
    public static Fight (lev: number) {
        Promise.resolve ()
            // 先缓存关卡资源
            .then (() => {
                UIRoot.inst.ClearCache ();
                return GamePlayViewState.Load (lev);
            })
            // 再正式打开关卡
            .then (() => {
                MgrSdk.inst.Log (`打开关卡...`);
                jiang.mgrUI.Open (
                    GamePlayView.nodeType,
                    GamePlayViewState.Pop (
                        APP,
                        PlayOrdinary.Pop (APP, lev)
                    )
                );
            });

    }
}