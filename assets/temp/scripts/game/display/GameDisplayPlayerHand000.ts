import BCType from "../../frame/basic/BCType";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import gameCommon from "../GameCommon";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayPlayerHand000`;

/**
 * 手
 */
@ccclass
export default class GameDisplayPlayerHand000 extends UIViewComponent {
    static nodeType = UINodeType.Pop<GameDisplayPlayerHand000, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_npc/player_hand`,
            componentGetter: node => node.getComponent(GameDisplayPlayerHand000),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameDisplayPlayerHand000, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            com.node.position.x = 0;
                            com.node.position.y = 0;
                            com.node.angle = 0;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}
