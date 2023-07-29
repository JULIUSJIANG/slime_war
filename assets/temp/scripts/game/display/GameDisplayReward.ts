import BCType from "../../frame/basic/BCType";
import ComponentNodeEventer from "../../frame/component/ComponentNodeEventer";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import gameCommon from "../GameCommon";
import GameElementReward from "../game_element/common/GameElementReward";
import EquipmentViewEquip from "../view/equipment_view/EquipmentViewEquip";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import EquipmentViewBackpackProp from "../view/equipment_view/EquipmentViewBackpackProp";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayReward`;

/**
 * 选项界面的空格子
 */
@ccclass
export default class GameDisplayReward extends UIViewComponent {

    /**
     * 容器 - 武器
     */
    @property (cc.Node)
    containerEquipment: cc.Node = null;
    
    /**
     * 奖励 - 武器
     */
    static nodeTypeForEquipment = UINodeType.Pop<GameDisplayReward, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_eff/scene_reward_equipment`,
            componentGetter: node => node.getComponent(GameDisplayReward),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameDisplayReward, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                           IndexDataModule.DEFAULT,
                           IndexDataModule.PLAYING
                       ],
                        propsFilter: (com, state, props) => {
                            let ele = state.playMachine.gameState.GetEleById <GameElementReward> (props);
                            // 状态 - 入场
                            if (ele.currStatus == ele.statusIn) {
                                com.node.x = ele.posInit.x;
                                com.node.y = ele.posInit.y;
                                com.node.scale = ele.currStatus.rate;
                            };

                            // 状态 - 渐进
                            if (ele.currStatus == ele.statusFloat) {
                                let currAngle = ele.currStatus.rate * 2 * Math.PI + ele.statusFloat.equipInitAngle;
                                let currRadius = (1 - ele.currStatus.rate) ** 2 * ele.statusFloat.equipInitRadius;
                                com.node.x = ele.relState.player.commonCenterPos.x + Math.cos(currAngle) * currRadius;
                                com.node.y = ele.relState.player.commonCenterPos.y + Math.sin(currAngle) * currRadius;
                                com.node.scale = 1;
                            };

                            // 状态 - 出场
                            if (ele.currStatus == ele.statusOut) {
                                com.node.x = ele.relState.player.commonCenterPos.x;
                                com.node.y = ele.relState.player.commonCenterPos.y;
                                com.node.scale = 1 - ele.currStatus.rate;
                            };
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<GameDisplayReward, GamePlayViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipment;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                           let ele = state.playMachine.gameState.GetEleById <GameElementReward> (props);
                           let idCfg = ele.props [0];
                           listNode.push (
                                EquipmentViewEquip.GetNodeTypeForIconScene (
                                    idCfg
                                )
                                    .CreateNode (
                                        state,
                                        idCfg,
                                        idCfg
                                    )
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

    /**
     * 奖励 - 背包物品
     */
    static nodeTypeForParticle = UINodeType.Pop<GameDisplayReward, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_eff/scene_reward_particle`,
            componentGetter: node => node.getComponent(GameDisplayReward),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameDisplayReward, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                           IndexDataModule.DEFAULT,
                           IndexDataModule.PLAYING
                       ],
                        propsFilter: (com, state, props) => {
                            let ele = state.playMachine.gameState.GetEleById <GameElementReward> (props);
                            // 最大坐标位移
                            let posOffsetMax = 50;
                            // 获取进度
                            let rate = ele.currStatus.rate;
                            // 状态 - 入场，初始位置和随机位置间插值
                            if (ele.currStatus == ele.statusIn) {
                                rate = Math.pow (rate, 0.5);
                                com.node.x = ele.posInit.x + rate * ele.statusIn.particleRandomX * posOffsetMax;
                                com.node.y = ele.posInit.y + rate * ele.statusIn.particleRandomY * posOffsetMax;
                                com.node.opacity = 255 * rate;
                            };

                            // 状态 - 渐进
                            if (ele.currStatus == ele.statusFloat) {
                                let xStart = ele.posInit.x + ele.statusIn.particleRandomX * posOffsetMax;
                                let yStart = ele.posInit.y + ele.statusIn.particleRandomY * posOffsetMax;

                                // 当前位置指向玩家的向量
                                let vecX = ele.relState.player.commonCenterPos.x - xStart;
                                let vecY = ele.relState.player.commonCenterPos.y - yStart;

                                com.node.x = xStart + vecX * rate;
                                com.node.y = yStart + vecY * rate;
                                com.node.opacity = 255 * (1 - rate);
                            };

                            // 状态 - 出场
                            if (ele.currStatus == ele.statusOut) {
                                com.node.x = ele.relState.player.commonCenterPos.x;
                                com.node.y = ele.relState.player.commonCenterPos.y;
                                com.node.opacity = 255 * (1 - rate);
                            };
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<GameDisplayReward, GamePlayViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerEquipment;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                           let ele = state.playMachine.gameState.GetEleById <GameElementReward> (props);
                           let idCfg = ele.props [0];
                           listNode.push (
                                EquipmentViewBackpackProp.GetNodeTypeForScene (
                                    idCfg
                                )
                                    .CreateNode (
                                        state,
                                        idCfg,
                                        idCfg
                                    )
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