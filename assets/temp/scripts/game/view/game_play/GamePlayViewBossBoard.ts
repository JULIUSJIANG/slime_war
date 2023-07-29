import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import GameElementBody from "../../game_element/body/GameElementBody";
import GamePlayViewState from "./GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GamePlayViewBossBoard`;

const NEAR_BY_SPEED = 2;

/**
 * boss 专用的生命面板
 */
@ccclass
export default class GamePlayViewBossBoard extends UIViewComponent {
    /**
     * 用于代表血条长度的节点
     */
    @property (cc.Node)
    nodeBarWidth: cc.Node = null;
    /**
     * 血条的真正长度
     */
    @property (cc.Node)
    nodeBar: cc.Node = null;

    /**
     * 横条 - 追赶专用
     */
    @property (cc.Node)
    nodeBarNearBy: cc.Node = null;


    static nodeType = UINodeType.Pop <GamePlayViewBossBoard, GamePlayViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/game_play_view_board_boss`,
            componentGetter: node => node.getComponent (GamePlayViewBossBoard),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <GamePlayViewBossBoard, GamePlayViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let eleMonster = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                            com.nodeBar.width = eleMonster.commonHpCurrent / eleMonster.commonHpMax * com.nodeBarWidth.width;

                            // 比目标横条要短，直接更正为目标长度
                            if (com.nodeBarNearBy.width < com.nodeBar.width) {
                                com.nodeBarNearBy.width += NEAR_BY_SPEED;
                            }
                            else {
                                com.nodeBarNearBy.width -= NEAR_BY_SPEED;
                            };
                            com.nodeBarNearBy.width = Math.max (com.nodeBarNearBy.width, com.nodeBar.width);
                            com.nodeBarNearBy.width = Math.min (com.nodeBarNearBy.width, com.nodeBarWidth.width);
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForTemp600
        }
    )
}