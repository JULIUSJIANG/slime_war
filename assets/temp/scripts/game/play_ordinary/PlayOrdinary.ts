import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";
import CfgLevel from "../../frame/config/src/CfgLevel";
import jiang from "../../frame/global/Jiang";
import indexDataStorageItem from "../../IndexStorageItem";
import gameCommon from "../GameCommon";
import GameElementScene from "../game_element/common/GameElementScene";
import GameState from "../game_element/GameState";
import GameElementBodyBehaviourRS from "../game_element/body/GameElementBodyBehaviourRS";
import MBPlayer from "../game_element/body/logic_3031/MBPlayer";
import PlayOrdinaryEnemyCall from "./PlayOrdinaryEnemyCall";
import PlayOrdinaryStatus from "./PlayOrdinaryStatus";
import PlayOrdinaryStatusDestory from "./PlayOrdinaryStatusDestory";
import PlayOrdinaryStatusFailed from "./PlayOrdinaryStatusFailed";
import PlayOrdinaryStatusPaused from "./PlayOrdinaryStatusPaused";
import PlayOrdinaryStatusPlaying from "./PlayOrdinaryStatusPlaying";
import PlayOrdinaryStatusSuccessed from "./PlayOrdinaryStatusSuccessed";
import GameElementBody from "../game_element/body/GameElementBody";
import PlayOrdinaryStatusSuccessing from "./PlayOrdinaryStatusSuccessing";
import PlayOrdinaryStatusFailing from "./PlayOrdinaryStatusFailing";
import CfgChapter from "../../frame/config/src/CfgChapter";
import VoiceOggViewState from "../view/voice_ogg/VoiceOggViewState";
import GamePlayViewMachine from "../view/game_play/GamePlayViewMachine";
import PlayOrdinaryRS from "./PlayOrdinaryRS";
import CfgScene from "../../frame/config/src/CfgScene";
import ShareViewRS from "../view/share_view/ShareViewRS";
import DefineVoice from "../game_element/body/DefineVoice";
import indexBuildConfig from "../../IndexBuildConfig";
import PlayOrdinaryStatusRelife from "./PlayOrdinaryStatusRelife";

const APP = `PlayOrdinary`;

/**
 * 玩法 - 经典
 */
export default class PlayOrdinary extends GamePlayViewMachine {
    /**
     * 战斗的核心
     */
    public gameState: GameState;
    /**
     * 玩家
     */
    public mbPlayer: MBPlayer;

    private constructor () {
        super ();
    }

    private static _t = new UtilObjPoolType<PlayOrdinary>({
        instantiate: () => {
            return new PlayOrdinary();
        },
        onPop: (val) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, idCfgLevel: number) {
        // 背包物品
        let listBackpackProp = jiang.mgrData.Get (indexDataStorageItem.listBackpackProp);
        // 已获得红水晶
        let heartGotted = false;
        // 已获得蓝水晶
        let starGotted = false;
        for (let i = 0; i < listBackpackProp.length; i++) {
            let listBackpackPropItem = listBackpackProp [i];
            if (listBackpackPropItem.idCfg == ShareViewRS.heart.idProp) {
                heartGotted = true;
            };
            if (listBackpackPropItem.idCfg == ShareViewRS.star.idProp) {
                starGotted = true;
            };
        };

        let val = UtilObjPool.Pop(PlayOrdinary._t, apply);

        // 关卡 id
        val.idCfgLev = idCfgLevel;

        // 用于初始化的策略
        val.rsInit = PlayOrdinaryRS.GetRS (idCfgLevel);
        val.idCfgScene = val.rsInit.getterSceneId (idCfgLevel);

        // 主题的配置
        let cfgScene = jiang.mgrCfg.cfgScene.select(CfgScene.idGetter, val.idCfgScene)._list[0];

        // 认为是 boss 战的话，播放固定音乐
        let isBossLevel = val.rsInit.getterIsBossLevel (idCfgLevel);
        if (isBossLevel) {
            VoiceOggViewState.inst.BgmSet (DefineVoice.BGM_BOSS);
        }
        else {
            VoiceOggViewState.inst.BgmSet(cfgScene.bgm);
        };

        // 各个分状态
        val.statusDestory = PlayOrdinaryStatusDestory.Pop(APP, val);
        val.statusFailing = PlayOrdinaryStatusFailing.Pop(APP, val);
        val.statusFailed = PlayOrdinaryStatusFailed.Pop(APP, val);
        val.statusPaused = PlayOrdinaryStatusPaused.Pop(APP, val);
        val.statusPlaying = PlayOrdinaryStatusPlaying.Pop(APP, val);
        val.statusSuccessing = PlayOrdinaryStatusSuccessing.Pop(APP, val);
        val.statusSuccessed = PlayOrdinaryStatusSuccessed.Pop(APP, val);
        val.statusRelife = PlayOrdinaryStatusRelife.Pop(APP, val);

        // 掉落的数量缩放
        let dropScale = val.rsInit.getterDropScale (idCfgLevel);
        // 战斗核心
        let gameState = GameState.Pop (APP, val.idCfgScene, dropScale);
        val.gameState = gameState;

        // 添加场景
        gameState.AddEle(GameElementScene.Pop(APP));
        // 操纵的单位
        let npc = GameElementBody.Pop (
            APP,
            
            {
                posX: 0,
                posY: gameCommon.GROUND_Y,
        
                vecX: 0,
                vecY: 0,
        
                cfgId: gameCommon.PLAYER_CFG_ID, 
                camp: gameCommon.FRIENDLY_CAMP,
                power: 1,
                caller: null
            }
        );
        // 添加单位
        gameState.AddEle(npc);
        // 访问玩家策略
        val.mbPlayer = npc.commonBehaviour as MBPlayer;
        // 有红水晶的话，生命 +1
        if (heartGotted) {
            npc.commonHpMax += 1;
        };
        // 有蓝水晶的话，能量上限 +50
        if (starGotted) {
            val.mbPlayer.mpMax += 50;
        };
        // 记录当前单位
        gameState.player = npc;
        // 满血
        npc.commonHpCurrent = npc.commonHpMax;

        // 设置武器
        let listEquiped = jiang.mgrData.Get (indexDataStorageItem.listCurrentEquiped);
        for (let i = 0; i < listEquiped.length; i++) {
            let idEquip = listEquiped [i];
            if (idEquip == 0) {
                continue;
            };
            val.mbPlayer.playerMgrEquipment.AddEquipment (listEquiped [i]);
        };
        // 武器默认索引为 0
        val.mbPlayer.playerMgrEquipment.SetEquipmentIdx (0);

        // 采用演员
        if (indexBuildConfig.IS_FAKE_ENEMY) {
            // 否则新建
            let listMonsterDelay: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            let listMonsterId: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            let listMonsterX: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

            listMonsterDelay.push (0);
            listMonsterId.push (4001003);
            listMonsterX.push (0, 0);

            listMonsterDelay.push (600);
            listMonsterId.push (4001004);
            listMonsterX.push (0, 0);

            val.listEnemyCall = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            val.listEnemyCall.push (PlayOrdinaryEnemyCall.Pop (
                APP,
                0,
                listMonsterDelay,
                listMonsterId,
                listMonsterX
            ));
        }
        else {
            // 获取怪物列表
            val.listEnemyCall = val.rsInit.getterListEnemyCall (idCfgLevel);
        };

        // 默认状态 - 游玩
        val.Enter(val.statusPlaying);

        // 降雨管理预热
        val.gameState.mgrRain.speedX = cfgScene.rain_speed_x;
        val.gameState.mgrRain.speedY = cfgScene.rain_speed_y;
        val.gameState.mgrRain.countPerMS = cfgScene.rain_count_per_ms;
        val.gameState.mgrRain.WarmUp();

        // 降雪管理预热
        val.gameState.mgrSnow.speedX = cfgScene.snow_speed_x;
        val.gameState.mgrSnow.speedY = cfgScene.snow_speed_y;
        val.gameState.mgrSnow.countPerMS = cfgScene.snow_count_per_ms;
        val.gameState.mgrSnow.WarmUp();

        return val;
    }

    /**
     * 初始化专用的策略
     */
    rsInit: PlayOrdinaryRS;
    /**
     * 当前挑战的关卡 id
     */
    idCfgLev: number;
    /**
     * 当前的主题 id
     */
    idCfgScene: number;
    /**
     * 召唤列表
     */
    listEnemyCall: Array<PlayOrdinaryEnemyCall> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 状态 - 已销毁
     */
    statusDestory: PlayOrdinaryStatusDestory;
    /**
     * 状态 - 失败中
     */
    statusFailing: PlayOrdinaryStatusFailing;
    /**
     * 状态 - 失败
     */
    statusFailed: PlayOrdinaryStatusFailed;
    /**
     * 状态 - 暂停
     */
    statusPaused: PlayOrdinaryStatusPaused;
    /**
     * 状态 - 正在体验
     */
    statusPlaying: PlayOrdinaryStatusPlaying;

    /**
     * 状态 - 成功中
     */
    statusSuccessing: PlayOrdinaryStatusSuccessing;
    /**
     * 状态 - 成功
     */
    statusSuccessed: PlayOrdinaryStatusSuccessed;
    /**
     * 状态 - 重生
     */
    statusRelife: PlayOrdinaryStatusRelife;

    /**
     * 当前状态
     */
    currStatus: PlayOrdinaryStatus;
    /**
     * 累计度过的时间
     */
    totalPassedMS: number = 0;

    public Enter (status: PlayOrdinaryStatus) {
        let rec = this.currStatus;
        this.currStatus = status;
        if (rec) {
            rec.OnExit();
        };
        this.currStatus.OnEnter();
    }

    public OnPause () {
        this.currStatus.OnPause ();
    }

    public OnGetTitle(): string {
        return this.rsInit.getterTitle (this.idCfgLev);
    }

    public OnGetSceneId(): number {
        return this.idCfgScene;
    }

    public OnStep(ms: number) {
        this.currStatus.OnStep (ms);
    }

    public IsBossLevel(): boolean {
        return this.rsInit.getterIsBossLevel (this.idCfgLev);
    }
}