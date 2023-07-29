import BCType from "../../frame/basic/BCType";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementBody from "../game_element/body/GameElementBody";
import gameCommon from "../GameCommon";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayHp`;

const NEAR_BY_SPEED = 0.4;

/**
 * 生命面板
 */
@ccclass
export default class GameDisplayHp extends UIViewComponent {
    /**
     * 横条 - 生命
     */
    @property (cc.Node)
    nodeBar: cc.Node = null;

    /**
     * 横条 - 追赶专用
     */
    @property (cc.Node)
    nodeBarNearBy: cc.Node = null;

    /**
     * 横条 - 护盾
     */
    @property (cc.Node)
    nodeShield: cc.Node = null;

    /**
     * 节点 - 警告
     */
    @property (cc.Node)
    nodeWarning: cc.Node = null;

    /**
     * 技能 cd 的不透明度管理
     */
    @property (cc.Node)
    nodeCDOpacity: cc.Node = null;
    /**
     * 技能 cd 的进度管理
     */
    @property (cc.Node)
    nodeCDProgress: cc.Node = null;

    static nodeType = UINodeType.Pop<GameDisplayHp, GamePlayViewState, Array<number>>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/board_npc`,
            componentGetter: node => node.getComponent(GameDisplayHp),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameDisplayHp, GamePlayViewState, Array<number>>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let eleId = props[0];
                            let eleX = props[1];
                            let eleY = props[2];
                            let eleSize = props[3];

                            let eleMonster = state.playMachine.gameState.GetEleById<GameElementBody>(eleId);
                            com.node.x = eleX;
                            com.node.y = eleY;
                        
                            com.node.width = 2 * eleSize;
                            let barBase = Math.max (eleMonster.commonHpCurrent + eleMonster.commonShield, eleMonster.commonHpMax);
                            com.nodeBar.width = 2 * eleSize * eleMonster.commonHpCurrent / barBase;

                            // 比目标横条要短，直接更正为目标长度
                            if (com.nodeBarNearBy.width < com.nodeBar.width) {
                                com.nodeBarNearBy.width += NEAR_BY_SPEED;
                            }
                            else {
                                com.nodeBarNearBy.width -= NEAR_BY_SPEED;
                            };
                            com.nodeBarNearBy.width = Math.max (com.nodeBarNearBy.width, com.nodeBar.width);
                            com.nodeBarNearBy.width = Math.min (com.nodeBarNearBy.width, 2 * eleSize);

                            com.nodeShield.x = com.nodeBar.width;
                            com.nodeShield.width = 2 * eleSize * eleMonster.commonShield /  barBase;
                            com.nodeWarning.opacity = com._nodeToOpacityMap.get (com.nodeWarning) * eleMonster.commonAnimTipsFlash.rateVisibility;
                            com.nodeWarning.scaleX = com.nodeWarning.scaleY = eleMonster.commonAnimTipsFlash.rateVisibility * 2;

                            if (!eleMonster.commonCD || eleMonster.commonCD.msCD < 1200) {
                                com.nodeCDOpacity.opacity = 0;
                                return;
                            };
                            let rate = 1 - eleMonster.commonCD.currentCD / eleMonster.commonCD.msCD;
                            com.nodeCDProgress.width = 2 * eleSize * rate;
                            rate = 1.0 - Math.abs (rate - 0.5) / 0.5;
                            rate = Math.pow (rate, 0.1);
                            com.nodeCDOpacity.opacity = rate * 255;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeArray,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}