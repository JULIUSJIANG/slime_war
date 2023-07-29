import BCType from "../../frame/basic/BCType";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import MBPlayer from "../game_element/body/logic_3031/MBPlayer";
import CfgEquipmentProps from "../../frame/config/src/CfgEquipmentProps";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import GEEI_2004 from "../game_element/equipment/geei_2004/GEEI_2004";
import GEEI_2006 from "../game_element/equipment/geei_2006/GEEI_2006";
import gameCommon from "../GameCommon";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayEquipment007`;

/**
 * 弓箭常规可视化专用 + 不考虑后座力震颤 + 魔法书定制 + 锁旋转角
 */
@ccclass
export default class GameDisplayEquipment007 extends UIViewComponent {

    /**
     * 节点列表 - 光晕
     */
    @property([cc.Node])
    listNodeBloom: Array <cc.Node> = [];

    /**
     * 节点 - 轨迹
     */
    @property([cc.Node])
    listNodeTrace: Array<cc.Node> = [];

    /**
     * 动画组件
     */
    @property(cc.Animation)
    anim: cc.Animation = null;

    /**
     * 容器 - 角度
     */
    @property(cc.Node)
    nodeAngle: cc.Node = null;

    /**
     * 用于抵抗角度的列表
     */
    @property (cc.Node)
    listNodeResist: Array<cc.Node> = [];

    /**
     * 当前动画名字
     */
    _currAnim: string;

    /**
     * 载入东湖
     * @param animName 
     */
    LoadAnim (animName: string) {
        if (this._currAnim == animName) {
            return;
        };
        this._currAnim = animName;
        this.anim.play(this._currAnim);
    }

    protected onDisable(): void {
        this._currAnim = null;
    }

    /**
     * 已缓存了的节点
     */
    private static nodeTypeCacheMap: Map<number, UINodeType<GameDisplayEquipment007, GamePlayViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 通过配置获取节点类型
     * @param cfg 
     * @returns 
     */
    static GetNodeTypeByRes (cfg: CfgEquipmentProps) {
        if (!this.nodeTypeCacheMap.has(cfg.id)) {
            this.nodeTypeCacheMap.set(
                cfg.id,
                UINodeType.Pop<GameDisplayEquipment007, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: cfg.res,
                        componentGetter: node => node.getComponent(GameDisplayEquipment007),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayEquipment007, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let npc = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                                        let mbPlayer = npc.commonBehaviour as MBPlayer;
            
                                        let geei2006 = mbPlayer.playerMgrEquipment.equipInst as GEEI_2006;

                                        com.node.x = geei2006.relEquip.machine.equip.npc.args.equipOffsetX;
                                        com.node.y = geei2006.relEquip.machine.equip.npc.args.equipOffsetY;
    
                                        com.LoadAnim(geei2006.currStatus.OnAnim());
                                        com.AnimTimeScale(state.playMachine.gameState._timeScale * gameCommon.STANDARD_ANIM_MS / geei2006.currStatus.OnMSKeep());

                                        for (let i = 0; i < com.listNodeTrace.length; i++) {
                                            let node = com.listNodeTrace[i];
                                            node.color = mbPlayer.relBody.commonCache.colorMain;
                                            node.opacity = mbPlayer.playerMgrAction.npc.GetTraceOpacity ();
                                        };

                                        for (let i = 0; i < com.listNodeBloom.length; i++) {
                                            com.listNodeBloom [i].opacity = com._nodeToOpacityMap.get (com.listNodeBloom [i]) * Math.max (mbPlayer.animKeepDefend.rateVisibility, mbPlayer.animKeepShield.rateVisibility);
                                        };
                                    }
                                }
                            )
                        ],
                        childrenCreator: [],
                        propsType: BCType.typeNumber,
                        hideRS: UINodeInstHideRS.setParentNull,
                        enterRS: UINodeInstEnterRS.none
                    }
                )
            )
        }
        return this.nodeTypeCacheMap.get(cfg.id);
    }
}