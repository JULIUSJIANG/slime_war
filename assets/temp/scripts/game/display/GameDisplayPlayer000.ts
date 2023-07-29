import BCType from "../../frame/basic/BCType";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementBody from "../game_element/body/GameElementBody";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import MBPlayer from "../game_element/body/logic_3031/MBPlayer";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import gameCommon from "../GameCommon";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayPlayer000`;

/**
 * 动画名 - 马 - 步行
 */
const ANIM_NAME_HORSE_WALK = `npc_horse_ordinary`;
/**
 * 动画名 - 马 - 跳跃
 */
const ANIM_NAME_HORSE_JUMP = `npc_horse_jump`;
/**
 * 动画名 - 马 - 坠落
 */
const ANIM_NAME_HORSE_FLOAT = `npc_horse_float`;

const ANIM_NAME_ANIM_LEFT = `npc_yo_bi_anim_left`;
const ANIM_NAME_ANIM_LEFT_DMGED = `npc_yo_bi_anim_left_dmged`;
const ANIM_NAME_ANIM_RIGHT = `npc_yo_bi_anim_right`;
const ANIM_NAME_ANIM_RIGHT_DMGED = `npc_yo_bi_anim_right_dmged`;
const ANIM_NAME_DEATH = `npc_yo_bi_anim_death`;

/**
 * 马
 */
@ccclass
export default class GameDisplayPlayer000 extends UIViewComponent {
    
    /**
     * 节点列表 - 光晕
     */
    @property([cc.Node])
    listNodeBloom: Array <cc.Node> = [];
    /**
     * 节点列表 - 防御
     */
    @property([cc.Node])
    listNodeDefend: Array <cc.Node> = [];
    /**
     * 节点列表 - 护盾
     */
    @property([cc.Node])
    listNodeShield: Array <cc.Node> = [];

    /**
     * 节点 - 轨迹
     */
    @property([cc.Node])
    listNodeTrace: Array<cc.Node> = [];

    /**
     * 容器 - 装备
     */
    @property(cc.Node)
    containerEquipment: cc.Node = null;

    /**
     * 动画组件 - 玩家
     */
    @property(cc.Animation)
    animPlayer: cc.Animation = null;
    /**
     * 当前动画名字
     */
    _currAnimPlayer: string;
    /**
     * 载入动画 - 玩家
     * @param animName 
     */
    LoadAnimPlayer (animName: string) {
        if (this._currAnimPlayer == animName) {
            return;
        };
        this._currAnimPlayer = animName;
        this.animPlayer.play(this._currAnimPlayer);
    }
    
    /**
     * 集合 - 马的帧动画
     */
    @property ([cc.Node])
    listNodeHorseFrame: Array <cc.Node> = [];

    /**
     * 动画组件 - 马
     */
    animHorse: cc.Animation = null;
    /**
     * 当前动画名字
     */
    _currAnimHorse: string;
    /**
     * 载入动画 - 马
     * @param animName 
     * @returns 
     */
    LoadAnimHorse (animName: string) {
        return;

        if (this._currAnimHorse == animName) {
            return;
        };
        this._currAnimHorse = animName;
        this.animHorse.play(this._currAnimHorse);
    }

    protected onDisable(): void {
        this._currAnimPlayer = null;
    }

    static nodeType = UINodeType.Pop<GameDisplayPlayer000, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_npc/player`,
            componentGetter: node => node.getComponent(GameDisplayPlayer000),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameDisplayPlayer000, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let npcELe = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                            com.node.x = npcELe.commonFootPos.x;
                            com.node.y = npcELe.commonFootPos.y;
                        
                            // 同步时间缩放
                            com.AnimTimeScale(state.playMachine.gameState._timeScale * npcELe.commonTimeScaleSelf);

                            let mbPlayer = npcELe.commonBehaviour as MBPlayer;

                            // 身体的动画
                            let animBody: string;
                            // 常态
                            if (
                                mbPlayer.playerMgrHealth.machine.currStatus == mbPlayer.playerMgrHealth.machine.statusOrdinary
                            ) 
                            {
                                // 左朝向
                                if (mbPlayer.playerMgrBodyDir.currStatus == mbPlayer.playerMgrBodyDir.statusLeft) {
                                    animBody = ANIM_NAME_ANIM_LEFT;
                                };
                                // 右朝向
                                if (mbPlayer.playerMgrBodyDir.currStatus == mbPlayer.playerMgrBodyDir.statusRight) {
                                    animBody = ANIM_NAME_ANIM_RIGHT;
                                };
                            };
                            // 仅受伤
                            if (mbPlayer.playerMgrHealth.machine.currStatus == mbPlayer.playerMgrHealth.machine.statusHurted) {
                                // 左朝向
                                if (mbPlayer.playerMgrBodyDir.currStatus == mbPlayer.playerMgrBodyDir.statusLeft) {
                                    animBody = ANIM_NAME_ANIM_LEFT_DMGED;
                                };
                                // 右朝向
                                if (mbPlayer.playerMgrBodyDir.currStatus == mbPlayer.playerMgrBodyDir.statusRight) {
                                    animBody = ANIM_NAME_ANIM_RIGHT_DMGED;
                                };
                            };
                            // 已死亡
                            if (mbPlayer.playerMgrHealth.machine.currStatus == mbPlayer.playerMgrHealth.machine.statusDeath) {
                                animBody = ANIM_NAME_DEATH;
                            };
                            com.LoadAnimPlayer(animBody);

                            // 马的动画
                            let animHorse: string;
                            if (
                                mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusWalk
                                
                                || mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusForwardUp
                                || mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusForwardFloat
                            ) 
                            {
                                animHorse = ANIM_NAME_HORSE_WALK;
                            };
                            if (
                                mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusJump 
                                || mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusJumpUp
                                
                                || mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusBackUp
                            ) 
                            {
                                animHorse = ANIM_NAME_HORSE_JUMP;
                            };
                            if (
                                mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusJumpFloat

                                || mbPlayer.playerMgrAction.currStatus == mbPlayer.playerMgrAction.statusBackFloat 
                            ) 
                            {
                                animHorse = ANIM_NAME_HORSE_FLOAT;
                            };
                            com.LoadAnimHorse(animHorse);
                            // 更正马序列帧显示、隐藏的情况
                            for (let i = 0; i < com.listNodeHorseFrame.length; i++) {
                                let nodeHorseFrame = com.listNodeHorseFrame [i];
                                nodeHorseFrame.active = i == mbPlayer.playerMgrHorseFrame.currStatus.idx;
                            };

                            // 着色
                            for (let i = 0; i < com.listNodeTrace.length; i++) {
                                let node = com.listNodeTrace[i];
                                node.color = mbPlayer.relBody.commonCache.colorMain;
                                node.opacity = mbPlayer.playerMgrAction.npc.GetTraceOpacity ();
                            };
                            for (let i = 0; i < com.listNodeBloom.length; i++) {
                                com.listNodeBloom [i].color = mbPlayer.relBody.commonCache.colorMain;
                                com.listNodeBloom [i].opacity = com._nodeToOpacityMap.get(com.listNodeBloom [i]) * Math.max (mbPlayer.animKeepDefend.rateVisibility, mbPlayer.animKeepShield.rateVisibility);
                            };
                            for (let i = 0; i < com.listNodeDefend.length; i++) {
                                com.listNodeDefend [i].color = mbPlayer.relBody.commonCache.colorMain;
                                com.listNodeDefend [i].opacity = com._nodeToOpacityMap.get(com.listNodeDefend [i]) * mbPlayer.animKeepDefend.rateVisibility;
                            };
                            for (let i = 0; i < com.listNodeShield.length; i++) {
                                com.listNodeShield [i].color = mbPlayer.relBody.commonCache.colorMain;
                                com.listNodeShield [i].opacity = com._nodeToOpacityMap.get(com.listNodeShield [i]) * mbPlayer.animKeepShield.rateVisibility;
                            };
                        } 
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<GameDisplayPlayer000, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipment
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let eleMonster = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                            let mbPlayer = eleMonster.commonBehaviour as MBPlayer;
                            if (mbPlayer.playerMgrHealth.machine.currStatus == mbPlayer.playerMgrHealth.machine.statusDeath) {
                                return;
                            };
                            mbPlayer.playerMgrEquipment.equipInst.rs.instDisplay(
                                state,
                                eleMonster,
                                listNode
                            );
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}