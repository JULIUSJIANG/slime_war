import BCType from "../../frame/basic/BCType";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementParticleRain from "../game_element/particle/GameElementParticleRain";
import gameCommon from "../GameCommon";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayParticleSnow`;

/**
 * 雨滴
 */
@ccclass
export default class GameDisplayParticleSnow extends UIViewComponent {

    static nodeType = UINodeType.Pop<GameDisplayParticleSnow, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_eff/particle_snow`,
            componentGetter: node => node.getComponent(GameDisplayParticleSnow),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GameDisplayParticleSnow, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let eleRain = state.playMachine.gameState.GetEleById<GameElementParticleRain>(props);
                            com.node.x = eleRain.currPos.x;
                            com.node.y = eleRain.currPos.y;
                            com.node.angle = eleRain.rotation;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.none
        }
    )
}