import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import GamePlayViewState from "./GamePlayViewState";
import GameElementTxt from "../../game_element/common/GameElementTxt";
import GameElementPart from "../../game_element/common/GameElementPart";
import GameDisplayEff from "../../display/GameDisplayEff";
import GameElementEff from "../../game_element/common/GameElementEff";
import GameElementBody from "../../game_element/body/GameElementBody";
import GameDisplayBG from "../../display/GameDisplayBG";
import UINodeType from "../../../frame/ui/UINodeType";
import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import IndexDataModule from "../../../IndexDataModule";
import GameElementBodyBehaviourRS from "../../game_element/body/GameElementBodyBehaviourRS";
import MBPlayer from "../../game_element/body/logic_3031/MBPlayer";
import gameCommon from "../../GameCommon";
import GameElementReward from "../../game_element/common/GameElementReward";
import GameElementBuff from "../../game_element/buff/GameElementBuff";
import GameDisplayBuff from "../../display/GameDisplayBuff";
import GameElementParticleRain from "../../game_element/particle/GameElementParticleRain";
import GameDisplayParticleRain from "../../display/GameDisplayParticleRain";
import GameElementParticleSnow from "../../game_element/particle/GameElementParticleSnow";
import GameDisplayParticleSnow from "../../display/GameDisplayParticleSnow";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import GraphicsDrawer from "../../../frame/extend/graphics_drawer/GraphicsDrawer";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import CfgChapter from "../../../frame/config/src/CfgChapter";
import CfgLevel from "../../../frame/config/src/CfgLevel";
import GamePlayViewTrace from "./GamePlayViewTrace";
import GameDisplayReward from "../../display/GameDisplayReward";
import GamePlayViewEquipmentBtn from "./GamePlayViewEquipmentBtn";
import GameElementLigthPoint from "../../game_element/common/GameElementLightPoint";
import GameDisplayLightPoint from "../../display/GameDisplayLightPoint";
import utilMath from "../../../frame/basic/UtilMath";
import GuideMgr from "../guide_view/GuideMgr";
import CfgScene from "../../../frame/config/src/CfgScene";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import GamePlayViewBossBoard from "./GamePlayViewBossBoard";
import indexBuildConfig from "../../../IndexBuildConfig";
import MgrSdk from "../../../frame/sdk/MgrSdk";

const APP = `GamePlayView`;

const {ccclass, property} = cc._decorator;

const MAT_PROPERTY_SCREEN_WIDTH = `screenWidth`;
const MAT_PROPERTY_SCREEN_HEIGHT = `screenHeight`;

const MAT_PROPERTY_TEXTURE_BODY_ENV = `textureBodyEnv`;
const MAT_PROPERTY_TEXTURE_EFF_BLOOM = `textureEffBloom`;
const MAT_PROPERTY_TEXTURE_BODY_ELEMENT = `textureBodyElement`;
const MAT_PROPERTY_TEXTURE_EFF_LIGHT = `textureEffLight`;
const MAT_PROPERTY_TEXTURE_EFF_OFFSET_ADD = `textureEffOffsetAdd`;
const MAT_PROPERTY_TEXTURE_EFF_OFFSET_SUB = `textureEffOffsetSub`;
const MAT_PROPERTY_TEXTURE_BOARD = `textureBoard`;

@ccclass
export default class GamePlayView extends UIViewComponent {
    /**
     * 图片-背景 Y
     */
    @property(cc.Node)
    containerBg: cc.Node = null;

    /**
     * 容器 - 残影
     */
    @property(cc.Node)
    containerTrace: cc.Node = null;

    /**
     * 容器-npc Y
     */
    @property(cc.Node)
    containerNpc: cc.Node = null;

    /**
     * 容器 - 奖励
     */
    @property(cc.Node)
    containerReward: cc.Node = null;

    /**
     * 容器 - 雨点
     */
    @property (cc.Node)
    containerRain: cc.Node = null;

    /**
     * 容器 - 雪花
     */
    @property (cc.Node)
    containerSnow: cc.Node = null;

    /**
     * 容器 - 碎块
     */
    @property (cc.Node)
    containerPart: cc.Node = null;

    /**
     * 容器 - 光照
     */
    @property (cc.Node)
    containerLight: cc.Node = null;

    /**
     * 容器-特效 Y
     */
    @property(cc.Node)
    containerEff: cc.Node = null;

    /**
     * 绘图工具
     */
    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    /**
     * 容器 - buff
     */
    @property(cc.Node)
    containerBuff: cc.Node = null;

    /**
     * 容器 - 面板
     */
    @property(cc.Node)
    containerBoard: cc.Node = null;

    /**
     * 容器-冒字 Y
     */
    @property(cc.Node)
    containerTxt: cc.Node = null;

    /**
     * 按钮-选项
     */
    @property(ComponentNodeEventer)
    btnOptions: ComponentNodeEventer = null;

    /**
     * 按钮-瞄准
     */
    @property(ComponentNodeEventer)
    btnAim: ComponentNodeEventer = null;

    /**
     * 准星
     */
    @property(cc.Node)
    nodeMark: cc.Node = null;

    /**
     * 用于播放相机观察内容的精灵
     */
    @property(cc.Sprite)
    sprScreen: cc.Sprite = null;
    
    /**
     * 按钮 - 冲刺
     */
    @property(ComponentNodeEventer)
    btnForward: ComponentNodeEventer = null;

    /**
     * 绘图工具
     */
    drawer: GraphicsDrawer;

    /**
     * 相机 - 物体 - 环境
     */
    @property(cc.Camera)
    cameraBodyEnv: cc.Camera = null;
    /**
     * 相机 - 效果 - 残影
     */
    @property(cc.Camera)
    cameraEffTrace: cc.Camera = null;
    /**
     * 相机 - 效果 - 光晕
     */
    @property(cc.Camera)
    cameraBloom: cc.Camera = null;
    /**
     * 相机 - 物体 - 元素
     */
    @property(cc.Camera)
    cameraBodyElement: cc.Camera = null;
    /**
     * 相机 - 效果 - 光照
     */
    @property(cc.Camera)
    cameraEffLight: cc.Camera = null;
    /**
     * 相机 - 效果 - 偏移 - 增
     */
    @property(cc.Camera)
    cameraEffOffsetAdd: cc.Camera = null;
    /**
     * 相机 - 效果 - 偏移 - 减
     */
    @property(cc.Camera)
    cameraEffOffsetSub: cc.Camera = null;
    /**
     * 相机 - 面板
     */
    @property(cc.Camera)
    cameraBoard: cc.Camera = null;

    /**
     * 容器 - 装备列表
     */
    @property(cc.Node)
    containerEquipmentList: cc.Node = null;

    /**
     * 文本 - 关卡
     */
    @property(cc.Label)
    txtLevel: cc.Label = null;

    /**
     * 节点 - 生命
     */
    @property (cc.Node)
    nodeHp: cc.Node = null;
    /**
     * 节点 - 生命
     */
    @property (cc.Node)
    nodeBarHp: cc.Node = null;
    /**
     * 文本 - 生命
     */
    @property (cc.Label)
    txtHpCount: cc.Label = null;

    /**
     * 节点 - 能量
     */
    @property (cc.Node)
    nodeBarMp: cc.Node = null;
    /**
     * 文本 - 能量
     */
    @property (cc.Label)
    txtMpCount: cc.Label = null;
    /**
     * 节点 - 可用位置标注
     */
    @property (cc.Node)
    nodeBarMpMark: cc.Node = null;

    /**
     * 节点 - 技能遮罩
     */
    @property (cc.Sprite)
    sprMask: cc.Sprite = null;

    /**
     * 节点 - 技能按钮不透明度的代表
     */
    @property ([cc.Node])
    listNodeOpacitySkill: Array<cc.Node> = [];

    /**
     * 节点 - 技能就绪的闪烁
     */
    @property (cc.Node)
    nodeReadyFlash: cc.Node = null;

    /**
     * 节点 - 格挡就绪的常驻
     */
    @property (cc.Node)
    nodeReadyKeep: cc.Node = null;

    /**
     * 节点 - 受伤
     */
    @property (cc.Node)
    nodeFlashDmged: cc.Node = null;

    /**
     * 能量节点
     */
    @property (cc.Node)
    nodeMp: cc.Node = null;

    /**
     * 容器 - boss 面板
     */
    @property (cc.Node)
    containerBossBoard: cc.Node = null;

    /**
     * 节点 - 提示
     */
    @property (cc.Node)
    nodeTips: cc.Node = null;

    /**
     * 列表 - 相机
     */
    private _listCamera: Array <cc.Camera> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 列表 - 光晕
     */
    private _listRtBloom: Array <cc.RenderTexture> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);

    protected lateUpdate(dt: number): void {
        this.BloomRender ();
    }

    private set cameraX (val: number) {
        for (let i = 0; i < this._listCamera.length; i++) {
            let camera = this._listCamera[i];
            camera.node.x = val;
        };
    }
    private get cameraX () {
        return this.cameraBodyElement.node.x;
    }

    private set cameraY (val: number) {
        for (let i = 0; i < this._listCamera.length; i++) {
            let camera = this._listCamera[i];
            camera.node.y = val;
        };
    }
    private get cameraY () {
        return this.cameraBodyElement.node.y;
    }

    private set cameraZoomRatio (val: number) {
        for (let i = 0; i < this._listCamera.length; i++) {
            let camera = this._listCamera[i];
            camera.zoomRatio = val;
        };
        this.cameraEffTrace.zoomRatio = 1 * gameCommon.SCENE_SCALE / gameCommon.TRACE_SIZE_SCALE;
    }
    private get cameraZoomRatio () {
        return this.cameraBodyElement.zoomRatio;
    }

    protected onLoad(): void {        
        this.cameraEffTrace.node.active = false;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_SCREEN_WIDTH, jiang.mgrUI._containerUI.width);
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_SCREEN_HEIGHT, jiang.mgrUI._containerUI.height);
        this.drawer = GraphicsDrawer.Pop(APP, this.graphics);
        this.sprScreen.node.active = true;
        this._listCamera.push(
            this.cameraBodyEnv,
            this.cameraEffTrace,
            this.cameraBloom,
            this.cameraBodyElement,
            this.cameraEffLight,
            this.cameraEffOffsetAdd,
            this.cameraEffOffsetSub,
            this.cameraBoard
        );

        const PREMULTIPLY_ALPHA = false;

        // 实体 - 环境
        let rtBodyEnv = new cc.RenderTexture();
        rtBodyEnv.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rtBodyEnv.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rtBodyEnv.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraBodyEnv.targetTexture = rtBodyEnv;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_BODY_ENV, rtBodyEnv);

        // 效果 - 光晕
        this.cameraBloom.node.active = true;
        for (let i = 0; i < 4; i++) {
            let rtBloom = new cc.RenderTexture();
            rtBloom.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
            let scale = 1 / 2 ** i;
            rtBloom.initWithSize(Math.ceil (jiang.mgrUI._containerUI.width * scale), Math.ceil (jiang.mgrUI._containerUI.height * scale), cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
            rtBloom.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
            this.sprScreen.getMaterial(0).setProperty(`${MAT_PROPERTY_TEXTURE_EFF_BLOOM}${i}`, rtBloom);
            this._listRtBloom.push (rtBloom);
        };
        this.cameraBloom.targetTexture = this._listRtBloom [1];

        // 实体 - 元素
        let rtBodyElement = new cc.RenderTexture();
        rtBodyElement.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rtBodyElement.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rtBodyElement.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraBodyElement.targetTexture = rtBodyElement;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_BODY_ELEMENT, rtBodyElement);

        // 效果 - 光照
        let rtEffLight = new cc.RenderTexture();
        rtEffLight.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rtEffLight.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rtEffLight.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraEffLight.targetTexture = rtEffLight;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_EFF_LIGHT, rtEffLight);

        // 效果 - 扭曲 - 增
        let rtEffOffsetAdd = new cc.RenderTexture();
        rtEffOffsetAdd.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rtEffOffsetAdd.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rtEffOffsetAdd.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraEffOffsetAdd.targetTexture = rtEffOffsetAdd;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_EFF_OFFSET_ADD, rtEffOffsetAdd);

        // 效果 - 扭曲 - 减
        let rtEffOffsetSub = new cc.RenderTexture();
        rtEffOffsetSub.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rtEffOffsetSub.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rtEffOffsetSub.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraEffOffsetSub.targetTexture = rtEffOffsetSub;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_EFF_OFFSET_SUB, rtEffOffsetSub);

        // 相机 - 面板
        let rtBoard = new cc.RenderTexture();
        rtBoard.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
        rtBoard.initWithSize(jiang.mgrUI._containerUI.width, jiang.mgrUI._containerUI.height, cc.RenderTexture.DepthStencilFormat.RB_FMT_D24S8);
        rtBoard.setPremultiplyAlpha(PREMULTIPLY_ALPHA);
        this.cameraBoard.targetTexture = rtBoard;
        this.sprScreen.getMaterial(0).setProperty(MAT_PROPERTY_TEXTURE_BOARD, rtBoard);
    }

    static CallFired (mbPlayer: MBPlayer, com: GamePlayView, state: GamePlayViewState) {
        mbPlayer.playerMgrEquipment.machine.currStatus.OnFire (
            com.cameraX + (state.firePos.x - jiang.mgrUI._containerUI.width / 2) / com.cameraZoomRatio, 
            com.cameraY + (state.firePos.y - jiang.mgrUI._containerUI.height / 2) / com.cameraZoomRatio
        );
    }

    static nodeType = UINodeType.Pop<GamePlayView, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/game_play_view`,
            componentGetter: node=> node.getComponent(GamePlayView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            state.mgrTrace.relView = com;
                            com.txtLevel.node.active = !indexBuildConfig.IS_FAKE_ENEMY;
                            GuideMgr.inst.CatchGamePlayView (com);

                            com.cameraZoomRatio = state.sceneScale;
                            com.btnOptions.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                state.playMachine.OnPause();
                            });
                        
                            // npc
                            let npcEle = state.playMachine.gameState.player;
                        
                            // 更正相机位置
                            com.cameraX = state.cameraPos.x;
                            com.cameraY = state.cameraPos.y;
                        
                            let mbPlayer = npcEle.commonBehaviour as MBPlayer;

                            com.nodeFlashDmged.opacity = Math.pow (mbPlayer.animDmgedFlash.rateVisibility, 1.0) * 255 * 0.5;
                            // 监听交互
                            com.btnAim.evterTouchStart.On((pos) => {
                                GuideMgr.inst.currStatus.P1U2OnBtnAimTouchStart (com, pos);
                            });
                            com.btnAim.evterTouchMove.On((pos) => {
                                GuideMgr.inst.currStatus.P1U2OnBtnAimTouchMove (com, pos);
                            });
                            com.btnAim.evterTouchEnd.On((pos) => {
                                GuideMgr.inst.currStatus.P1U2OnBtnAimTouchEnd (com, pos);
                            });
                            if (mbPlayer.playerMgrEquipment.machine.currStatus == mbPlayer.playerMgrEquipment.machine.statusFired) {
                                GamePlayView.CallFired(mbPlayer, com, state);
                            };

                            // 按钮 - 格挡
                            com.btnForward.evterTouchStart.On(() => {
                                // 死亡以后不可格挡
                                if (mbPlayer.playerMgrHealth.machine.currStatus == mbPlayer.playerMgrHealth.machine.statusDeath) {
                                    return;
                                };
                                mbPlayer.playerMgrDefendCD.currStatus.OnDefend ();
                                GuideMgr.inst.currStatus.P1U8OnBtnDefendTouched ();
                            });

                            // 更正准星位置
                            if (mbPlayer.playerMgrEquipment.machine.currStatus == mbPlayer.playerMgrEquipment.machine.statusFired) {
                                com.nodeMark.active = true;
                                com.nodeMark.setPosition(
                                    mbPlayer.playerMgrEquipment.firePos.x,
                                    mbPlayer.playerMgrEquipment.firePos.y
                                );
                            }
                            else {
                                com.nodeMark.active = false;
                            };

                            // 生命
                            com.nodeBarHp.x = com.nodeBarHp.width * (npcEle.commonHpCurrent / npcEle.commonHpMax - 1);
                            com.txtHpCount.string = `生命: ${Math.ceil (npcEle.commonHpCurrent)} / ${Math.ceil (npcEle.commonHpMax)}`;

                            // 能量
                            com.nodeBarMp.x = com.nodeBarMp.width * (mbPlayer.mpCurrent / mbPlayer.mpMax - 1);
                            let callAble = mbPlayer.playerMgrEquipment.equipInst.OnAble ();
                            com.nodeBarMp.opacity = callAble ? 255 : 100;
                            // 最小值为 0，避免穿帮
                            com.txtMpCount.string = `能量: ${Math.max( Math.floor (mbPlayer.mpCurrent), 0)} / ${Math.ceil (mbPlayer.mpMax)}`;
                            let need = mbPlayer.playerMgrEquipment.equipInst.OnCostNeed ();
                            com.nodeBarMpMark.x = com.nodeBarHp.width * (need / mbPlayer.mpMax);

                            // 绘制提示信息
                            com.drawer._graphics.clear();
                            if (!indexBuildConfig.HIDE_UI) {
                                GuideMgr.inst.currStatus.P1U2OnDraw ();
                            };

                            // 获取标题
                            com.txtLevel.string = state.playMachine.OnGetTitle ();

                            // 更正冷却位置
                            com.sprMask.fillRange = 1.0 - mbPlayer.playerMgrDefendCD.statusTimeCount.msWait / gameCommon.CD_DEFEND;

                            // 更正不透明度
                            for (let i = 0; i < com.listNodeOpacitySkill.length; i++) {
                                com.listNodeOpacitySkill [i].opacity = mbPlayer.playerMgrDefendCD.opacitySkill;
                            };

                            // 更正不透明度
                            com.nodeReadyFlash.opacity = mbPlayer.animFlashReady.Get255 ();
                            com.nodeReadyFlash.scale = utilMath.Clamp (mbPlayer.animFlashReady.rateVisibility * 1.05, 1.0, 2.0);

                            // 常驻节点
                            com.nodeReadyKeep.opacity = mbPlayer.animShieldReady.Get255 ();

                            // 更正受伤图片位置
                            com.nodeFlashDmged.x = state.cameraPos.x;
                            com.nodeFlashDmged.y = state.cameraPos.y;

                            // 需要能量辅助
                            com.nodeMp.active = state.mpNeed;
                            // 生命条
                            com.nodeHp.active = true;

                            // 进行样式覆盖
                            GuideMgr.inst.currStatus.P1U2OnGamePlayViewStyle ();

                            // pc 端非引导时候提示按钮
                            com.nodeTips.active = MgrSdk.inst.IsPc () && GuideMgr.inst.currStatus == GuideMgr.inst.statusIdle;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBossBoard;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (indexBuildConfig.HIDE_UI) {
                                return;
                            };
                            // 非 boss 关卡，不这么干
                            if (!state.playMachine.IsBossLevel ()) {
                                return;
                            };
                            let listBody = state.playMachine.gameState.GetTypeAllEle(GameElementBody);
                            for (let i = 0; i < listBody.length; i++) {
                                let ele = listBody[i];
                                if (0 < ele.commonArgsCfg.is_boss) {
                                    listNode.push (GamePlayViewBossBoard.nodeType.CreateNode (
                                        state,
                                        ele.id,
                                        ele.id
                                    ));
                                };
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBg;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let idCfgScene = state.playMachine.OnGetSceneId ();
                            let cfgScene = jiang.mgrCfg.cfgScene.select(CfgScene.idGetter, idCfgScene)._list[0];
                            listNode.push(GameDisplayBG.GetNodeTypeByRes(cfgScene.res).CreateNode(state, idCfgScene, idCfgScene));
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerTrace;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.mgrTrace.listRecord.length; i++) {
                                let rec = state.mgrTrace.listRecord[i];
                                listNode.push(GamePlayViewTrace.nodeType.CreateNode(state, rec.id, rec.id));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerNpc;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let listOrigin = state.playMachine.gameState.GetTypeAllEle(GameElementBody);
                            let arr: Array<GameElementBody> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                            for (let i = 0; i < listOrigin.length; i++) {
                                arr.push (listOrigin [i]);
                            };
                            arr.sort ((bodyA, bodyB) => {
                                let sizeA = GameElementBodyBehaviourRS.GetSize (bodyA.commonArgsCfg.id);
                                let sizeB = GameElementBodyBehaviourRS.GetSize (bodyB.commonArgsCfg.id);
                                // 优先尺寸比较
                                if (sizeA != sizeB) {
                                    return sizeB - sizeA;
                                };
                                return bodyA.id - bodyB.id;
                            });
                            for (let i = 0; i < arr.length; i++) {
                                let val = arr [i];
                                val.commonArgsRs.instDisplay(state, val, listNode);
                            };
                            UtilObjPool.Push (arr);
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerReward;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let listReward = state.playMachine.gameState.GetTypeAllEle (GameElementReward);
                            for (let i = 0; i < listReward.length; i++) {
                                let reward = listReward [i];
                                listNode.push(reward.cache.rs.onGetSceneRewardNodeType().CreateNode(
                                    state,
                                    reward.id,
                                    reward.id
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerRain;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.playMachine.gameState.GetTypeAllEle(GameElementParticleRain).length; i++) {
                                let ele = state.playMachine.gameState.GetTypeAllEle(GameElementParticleRain)[i];
                                listNode.push(GameDisplayParticleRain.nodeType.CreateNode(
                                    state,
                                    ele.id,
                                    ele.id
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerSnow;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            
                            for (let i = 0; i < state.playMachine.gameState.GetTypeAllEle(GameElementParticleSnow).length; i++) {
                                let ele = state.playMachine.gameState.GetTypeAllEle(GameElementParticleSnow)[i];
                                listNode.push(GameDisplayParticleSnow.nodeType.CreateNode(
                                    state,
                                    ele.id,
                                    ele.id
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerPart;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.playMachine.gameState.GetTypeAllEle(GameElementPart).length; i++) {
                                let ele = state.playMachine.gameState.GetTypeAllEle(GameElementPart)[i];
                                let node = ele.nodeType.CreateNode(
                                    state,
                                    ele.id,
                                    ele.id
                                );
                                listNode.push(node);
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerLight;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.playMachine.gameState.GetTypeAllEle(GameElementLigthPoint).length; i++) {
                                let ele = state.playMachine.gameState.GetTypeAllEle(GameElementLigthPoint)[i];
                                listNode.push(GameDisplayLightPoint.nodeType.CreateNode(
                                    state,
                                    ele.id,
                                    ele.id
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEff;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.playMachine.gameState.GetTypeAllEle(GameElementEff).length; i++) {
                                let ele = state.playMachine.gameState.GetTypeAllEle(GameElementEff)[i];
                                listNode.push(GameDisplayEff.GetNodeType(
                                    ele.cfgId
                                )
                                    .CreateNode(
                                        state, 
                                        ele.id, 
                                        ele.id
                                    ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBuff;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let listEff = state.playMachine.gameState.GetTypeAllEle(GameElementBuff);
                            for (let i = 0; i < listEff.length; i++) {
                                let val = listEff [i];
                                // listNode.push(GameDisplayBuff.nodeType.CreateNode(
                                //     state,
                                //     val.id,
                                //     val.id
                                // ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBoard;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            let listBody = state.playMachine.gameState.GetTypeAllEle(GameElementBody);
                            for (let i = 0; i < listBody.length; i++) {
                                let ele = listBody[i];
                                let rs = GameElementBodyBehaviourRS.instMap.get(ele.commonArgsCfg.logic);
                                if (rs.boardDisplay == null) {
                                    continue;
                                };
                                let arr = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
                                let size = GameElementBodyBehaviourRS.GetSize(ele.commonArgsCfg.id);
                                arr.push(ele.id, ele.commonHeadPos.x, ele.commonHeadPos.y + gameCommon.HP_FOOT_OFFSET_Y, size);
                                rs.boardDisplay(state, arr, listNode)
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerTxt;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (indexBuildConfig.HIDE_UI) {
                                return;
                            };
                            let listEle = state.playMachine.gameState.GetTypeAllEle(GameElementTxt);
                            for (let i = 0; i < listEle.length; i++) {
                                let ele = listEle[i];
                                listNode.push(ele.nodeType.CreateNode(
                                    state,
                                    ele.id,
                                    ele.id
                                ))
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<GamePlayView, GamePlayViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipmentList;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            // npc
                            let npcEle = state.playMachine.gameState.player;
                            // 操纵的玩家
                            let mbPlayer = npcEle.commonBehaviour as MBPlayer;
                            for (let i = 0; i < mbPlayer.playerMgrEquipment.listEquipmentInst.length; i++) {
                                listNode.push(
                                    GamePlayViewEquipmentBtn.nodeType.CreateNode (
                                        state,
                                        i,
                                        i
                                    )
                                );
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );

    /**
     * 相机坐标 x
     * @returns 
     */
    GetCameraX () {
        return this.cameraX;
    }
    /**
     * 相机坐标 y
     * @returns 
     */
    GetCameraY () {
        return this.cameraY;
    }

    /**
     * 提取精灵
     * @returns 
     */
    ScreenShoot (rt: cc.RenderTexture) {
        this.cameraEffTrace.targetTexture = rt;
        this.cameraEffTrace.node.active = true;
        this.cameraEffTrace.render();
        this.cameraEffTrace.node.active = false;
    }

    /**
     * 刷新光晕层
     */
    private BloomRender () {
        return;
        this.cameraBloom.node.active = true;
        for (let i = 0; i < this._listRtBloom.length; i++) {
            let rtBloom = this._listRtBloom [i];
            this.cameraBloom.targetTexture = rtBloom;
            this.cameraBloom.render();
        };
        this.cameraBloom.node.active = false;
    }
}