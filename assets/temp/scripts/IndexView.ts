import BCType from "./frame/basic/BCType";
import ComponentNodeEventer from "./frame/component/ComponentNodeEventer";
import CfgLevel from "./frame/config/src/CfgLevel";
import jiang from "./frame/global/Jiang";
import UINodeType from "./frame/ui/UINodeType";
import UIViewComponent from "./frame/ui/UIViewComponent";
import gameCommon from "./game/GameCommon";
import PlayOrdinary from "./game/play_ordinary/PlayOrdinary";
import GamePlayView from "./game/view/game_play/GamePlayView";
import GamePlayViewState from "./game/view/game_play/GamePlayViewState";
import IndexDataModule from "./IndexDataModule";
import indexLoading from "./IndexLoading";
import indexDataStorageItem from "./IndexStorageItem";
import IndexViewState from "./game/view/index_view/IndexViewState";
import IndexViewRS from "./game/view/index_view/IndexViewRS";
import IndexViewBtn from "./game/view/index_view/IndexViewBtn";
import VoiceOggViewState from "./game/view/voice_ogg/VoiceOggViewState";
import UINodeInstHideRS from "./frame/ui/UINodeInstHideRS";
import MgrUI from "./frame/ui/MgrUI";
import IndexViewTag from "./game/view/index_view/IndexViewTag";
import GuideMgr from "./game/view/guide_view/GuideMgr";
import gameMath from "./game/GameMath";
import utilString from "./frame/basic/UtilString";
import GameStateReward from "./game/game_element/GameStateReward";
import UtilObjPool from "./frame/basic/UtilObjPool";
import GameCfgBodyCacheDropRS from "./game/game_element/body/GameCfgBodyCacheDropRS";
import RewardViewState from "./game/view/reward_view/RewardViewState";
import TipsViewState from "./game/view/tips_view/TipsViewState";
import UINodeInstEnterRS from "./frame/ui/UINodeInstEnterRS";
import utilMath from "./frame/basic/UtilMath";
import indexBuildConfig from "./IndexBuildConfig";

const {ccclass, property} = cc._decorator;

const APP = `IndexView`;

/**
 * 按钮 - 间距
 */
const BTN_SPACING = 0;

/**
 * 按钮 - 高度
 */
const BTN_HEIGHT = 60;

/**
 * 分页宽度
 */
const PAGE_WIDTH = 860;
/**
 * 分页高度
 */
const PAGE_HEIGHT = 560;

/**
 * 左切分页栏的宽度
 */
const WIDTH_LEFT = 70 + 90 + 70;

/**
 * 根界面
 */
@ccclass
export default class IndexView extends UIViewComponent {
    /**
     * 节点 - 进度
     */
    @property (cc.Node)
    nodeProgress: cc.Node = null;

    /**
     * 文本-进度
     */
    @property(cc.Label)
    labProgress: cc.Label = null;

    /**
     * 动画播放组件
     */
    @property(cc.Animation)
    anim: cc.Animation = null;

    /**
     * 容器 - 按钮
     */
    @property(cc.Node)
    containerBtn: cc.Node = null;

    /**
     * 节点 - 分页位置
     */
    @property(cc.Node)
    nodePagePos: cc.Node = null;

    /**
     * 容器 - 分页
     */
    @property(cc.Node)
    containerPage: cc.Node = null;

    /**
     * 右边栏节点
     */
    @property(cc.Node)
    containerLeft: cc.Node = null;

    /**
     * 按钮 - 开始
     */
    @property(ComponentNodeEventer)
    btnStart: ComponentNodeEventer = null;

    /**
     * 容器 - 游标
     */
    @property(cc.Node)
    containerTag: cc.Node = null;

    /**
     * 节点 - 已初始化的内容
     */
    @property(cc.Node)
    nodeInited: cc.Node = null;

    /**
     * 节点 - 挂机相关
     */
    @property (cc.Node)
    nodeGold: cc.Node = null;

    /**
     * 挂机 - 倒计时
     */
    @property (cc.Label)
    goldTxtTime: cc.Label = null;
    /**
     * 挂机 - 当前奖励
     */
    @property (cc.Label)
    goldTxtCurrent: cc.Label = null;
    /**
     * 挂机 - 最大奖励
     */
    @property (cc.Label)
    goldTxtMax: cc.Label = null;
    /**
     * 按钮 - 领取挂机收益
     */
    @property ([ComponentNodeEventer])
    listGoldBtn: Array <ComponentNodeEventer> = [];
    /**
     * 按钮 - 领取挂机收益 - 双倍
     */
    @property (ComponentNodeEventer)
    goldBtnDouble: ComponentNodeEventer = null;
    /**
     * 按钮 - 奖励直接提升
     */
    @property (ComponentNodeEventer)
    goldBtnInc: ComponentNodeEventer = null;
    /**
     * 节点 - 视频相关
     */
    @property (cc.Node)
    nodeForVideo: cc.Node = null;
    /**
     * 节点 - 非视频相关
     */
    @property (cc.Node)
    nodeForUnVideo: cc.Node = null;
    /**
     * 文本 - 通过视频奖励直接获得量
     */
    @property (cc.Label)
    txtAdGotImm: cc.Label = null;
    /**
     * 节点 - 进度条
     */
    @property (cc.Node)
    nodeBar: cc.Node = null;
    /**
     * 节点 - 进度条长度
     */
    @property (cc.Node)
    nodeBarLen: cc.Node = null;
    /**
     * 节点 - 时间
     */
    @property (cc.Node)
    nodeTime: cc.Node = null;

    protected onLoad(): void {
        this.labProgress.node.active = true;
        this.containerLeft.opacity = 0;
        this.nodeInited.opacity = 0;
        this.nodeInited.active = false;
    }

    protected onDisable(): void {
        this._currAnimName = null;
        this.containerLeft.opacity = 0;
        this.nodeInited.opacity = 0;
        this.anim.stop();
    }
    
    /**
     * 当前动画
     */
    _currAnimName: string

    /**
     * 把动画置为某个状态
     * @param animName 
     */
    Status (animName: string) {
        if (animName == this._currAnimName) {
            return;
        };
        this._currAnimName = animName;
        this.anim.play(this._currAnimName, 0);
    }

    static nodeType = UINodeType.Pop<IndexView, IndexViewState, number>(
        APP,
        {
            prefabPath: `IndexView`,
            componentGetter: node => node.getComponent(IndexView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<IndexView, IndexViewState, number>(
                    APP, 
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_MAIN
                        ],
                        propsFilter: (com, state, props) => {
                            // 理想的位置是，完全对准中心
                            com.containerPage.x = 0;
                            // 约束，被左边栏往左推
                            let containerPageXMin = WIDTH_LEFT + PAGE_WIDTH / 2 - jiang.mgrUI._containerUI.width / 2;
                            com.containerPage.x = Math.max (com.containerPage.x, containerPageXMin);

                            com.labProgress.string = `${indexLoading.indexCurrent}/${indexLoading.indexTotal} ${indexLoading.information}${Math.floor((indexLoading.finishedCount / indexLoading.totalCount) * 100)}%`
                            com.nodeBar.width = ((indexLoading.indexCurrent - 1) / indexLoading.indexTotal + 1 / indexLoading.indexTotal * indexLoading.finishedCount / indexLoading.totalCount) * com.nodeBarLen.width;
                            com.nodeProgress.active = !indexLoading.promiseAllLoad.isResolved;
                            com.nodeInited.active = indexLoading.promiseAllLoad.isResolved;
                            com.nodePagePos.y = state.currStatus.OnGetPageY ();
                            com.nodeGold.active = GuideMgr.inst.currStatus == GuideMgr.inst.statusIdle;
                            com.nodeTime.active = GuideMgr.inst.currStatus == GuideMgr.inst.statusIdle;

                            indexLoading.promiseAllLoad._promise.then(() => {
                                com.Status( `IndexView` );
                            });

                            com.btnStart.evterTouchStart.On(() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                            com.btnStart.evterTouchEnd.On(() => {
                                GuideMgr.inst.currStatus.P1U1OnGotNodeIndexViewBtnStartTouch (com.btnStart);
                                GamePlayViewState.FightLast ();
                            });
                            GuideMgr.inst.currStatus.P1U1OnGotNodeIndexViewBtnStart (com.btnStart);

                            // 初始化完毕，可以更新挂机数据了
                            if (indexLoading.promiseAllLoad.isResolved) {
                                // 更正挂机时长
                                let levMax = 0;
                                let listEquipment = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
                                for (let i = 0; i < listEquipment.length; i++) {
                                    let rec = listEquipment [i];
                                    let recPower = gameMath.equip.ParseCountToPower (rec.count);
                                    let recPowerLev = gameMath.ParsePowerToLev (recPower);
                                    levMax = Math.max (levMax, recPowerLev);
                                };

                                let goldMS = jiang.mgrDateNow.DateNow() - jiang.mgrData.Get (indexDataStorageItem.goldLastDate);
                                goldMS = Math.min (goldMS, gameMath.GOLD_MS_MAX);
                                // 倒计时中的毫秒
                                let goldMSLess = gameMath.GOLD_MS_MAX - goldMS;
                                // 倒计时中的秒
                                let goldMSLessSecond = Math.ceil( goldMSLess / 1000 );
                                let hour = Math.floor (goldMSLessSecond / 3600);
                                let minute = Math.floor ((goldMSLessSecond % 3600) / 60);
                                let second = goldMSLessSecond % 60;
                                com.goldTxtTime.string = `${utilString.KeepLen (`${hour}`, 2, `0`)}:${utilString.KeepLen (`${minute}`, 2, `0`)}:${utilString.KeepLen (`${second}`, 2, `0`)}`;
                                let lvCurrent = levMax;
                                let lvCurrentPower = gameMath.ParseLevToPower (lvCurrent);
                                let lvCurrentPowerCount = gameMath.equip.ParsePowerToCount (lvCurrentPower);

                                // 根据视频开关情况，控制挂机奖励
                                let lvUp = gameMath.HOOK_LV_UP;
                                let lvTarget = lvCurrent + lvUp;
                                let lvTargetPower = gameMath.ParseLevToPower (lvTarget);
                                let lvTargetPowerCount = gameMath.equip.ParsePowerToCount (lvTargetPower);

                                let goldMax = lvTargetPowerCount - lvCurrentPowerCount;
                                let goldCurrent = goldMax * goldMS / gameMath.GOLD_MS_MAX;
                                com.goldTxtCurrent.string = `${utilMath.ParseNumToKMBTAABB(goldCurrent, Math.floor)}`;
                                com.goldTxtMax.string = `${utilMath.ParseNumToKMBTAABB(goldMax, Math.floor)}`;
                                // 正式获取奖励
                                function GotReward (countScale: number) {
                                    // 领取奖励
                                    let listReward: Array<GameStateReward> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                    let rewardProp: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                    rewardProp.push (gameCommon.COIN_FOR_LOTTERY, goldCurrent * countScale);
                                    listReward.push ({
                                        rs: GameCfgBodyCacheDropRS.xlsxBackpackProp,
                                        props: rewardProp
                                    });
                                    RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, listReward);
                                    jiang.mgrData.Set (indexDataStorageItem.goldLastDate, jiang.mgrDateNow.DateNow());
                                    jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_MAIN);
                                }
                                for (let i = 0; i < com.listGoldBtn.length; i++) {
                                    let goldBtn = com.listGoldBtn [i];
                                    goldBtn.evterTouchStart.On (() => {
                                        VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                    });
                                    goldBtn.evterTouchEnd.On (() => {
                                        if (goldCurrent < 1) {
                                            TipsViewState.inst.Tip (`当前奖励太少，无法领取`);
                                            return;
                                        };
                                        GotReward (1);
                                    });
                                };
                                com.goldBtnDouble.evterTouchStart.On (() => {
                                    VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                });
                                com.goldBtnDouble.evterTouchEnd.On (() => {
                                    if (goldCurrent < 1) {
                                        TipsViewState.inst.Tip (`当前奖励太少，无法领取`);
                                        return;
                                    };
                                    jiang.mgrSdk.core.WXVideo()
                                        .then ((ctx) => {
                                            if (ctx.isRewardAble) {
                                                GotReward (2);
                                            };
                                        });
                                });
                                com.goldBtnInc.evterTouchStart.On (() => {
                                    VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                                });
                                com.goldBtnInc.evterTouchStart.On (() => {
                                    jiang.mgrSdk.core.WXVideo()
                                        .then ((ctx) => {
                                            if (ctx.isRewardAble) {
                                                let listReward: Array<GameStateReward> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                                let rewardProp: Array<number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                                                // 直接获得 4 成的奖励
                                                rewardProp.push (gameCommon.COIN_FOR_LOTTERY, goldMax * gameMath.AD_GOT_IMM);
                                                listReward.push ({
                                                    rs: GameCfgBodyCacheDropRS.xlsxBackpackProp,
                                                    props: rewardProp
                                                });
                                                RewardViewState.GotRewardOrdinary (gameCommon.TITLE_REWARD, listReward);
                                            };
                                        });
                                });
                                com.txtAdGotImm.string = `+${gameMath.AD_GOT_IMM * 100}%`;
                                com.nodeForVideo.active = indexBuildConfig.VIDEO_ENABLE;
                                com.nodeForUnVideo.active = !indexBuildConfig.VIDEO_ENABLE;
                            };
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<IndexView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerBtn;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            // 引导中，不生成子内容
                            if (GuideMgr.inst.currStatus != GuideMgr.inst.statusIdle) {
                                return;
                            };
                            // 还没加载完成
                            if (!indexLoading.promiseAllLoad.isResolved) {
                                return;
                            };
                            for (let i = 0; i < IndexViewRS.listInst.length; i++) {
                                let ele = IndexViewRS.listInst[i];
                                listNode.push(IndexViewBtn.nodeType.CreateNode(
                                    state,
                                    ele.id,
                                    ele.id
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<IndexView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerTag;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            // 引导中，不生成子内容
                            if (GuideMgr.inst.currStatus != GuideMgr.inst.statusIdle) {
                                return;
                            };
                            // 还没加载完成
                            if (!indexLoading.promiseAllLoad.isResolved) {
                                return;
                            };
                            listNode.push (IndexViewTag.nodeType.CreateNode (state, null, null));
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<IndexView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerPage;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            // 引导中，不生成子内容
                            if (GuideMgr.inst.currStatus != GuideMgr.inst.statusIdle) {
                                return;
                            };
                            // 还没加载完成
                            if (!indexLoading.promiseAllLoad.isResolved) {
                                return;
                            };
                            for (let i = 0; i < IndexViewRS.listInst.length; i++) {
                                let ele = IndexViewRS.listInst[i];
                                ele.fill(state, listNode);
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
     * 获取位置
     * @param idx 
     * @returns 
     */
    static GetNodeBtnSelectedPos (idx: number) {
        let top = (IndexViewRS.listInst.length * BTN_HEIGHT + (IndexViewRS.listInst.length - 1) * BTN_SPACING) / 2 - BTN_HEIGHT / 2;
        return top - idx * (BTN_HEIGHT + BTN_SPACING);
    }
}
