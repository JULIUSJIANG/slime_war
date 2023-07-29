import IndexDataModule from "../../IndexDataModule";
import BCType from "../../frame/basic/BCType";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import gameCommon from "../GameCommon";
import GameElementLigthPoint from "../game_element/common/GameElementLightPoint";
import GameElementPart from "../game_element/common/GameElementPart";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayLightPoint`;

@ccclass
export default class GameDisplayLightPoint extends UIViewComponent {
    /**
     * 核心颜色
     */
    @property (cc.Node)
    nodeColor: cc.Node = null;

    static nodeType = UINodeType.Pop <GameDisplayLightPoint, GamePlayViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_eff/sunray`,
            componentGetter: node => node.getComponent (GameDisplayLightPoint),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <GameDisplayLightPoint, GamePlayViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let eleLightPoint = state.playMachine.gameState.GetEleById <GameElementLigthPoint> (props);
                            com.node.x = eleLightPoint.currPos.x;
                            com.node.y = eleLightPoint.currPos.y;
                            com.nodeColor.opacity = Math.max (0, eleLightPoint.opacity);
                            com.nodeColor.color = eleLightPoint.color;
                            com.nodeColor.width = eleLightPoint.size;
                            com.nodeColor.height = eleLightPoint.size;
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