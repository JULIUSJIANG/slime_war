import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayMonster001`;

/**
 * 旋转角锁住，脚底位置对齐
 */
@ccclass
export default class GameDisplayMonster001 extends UIViewComponent {
    /**
     * 节点缓存
     */
    static _nodeTypeCacheMap = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayMonster001, GamePlayViewState, number>>;
     /**
      * 获取对应的节点类型
      * @param res 
      * @returns 
      */
    static GetNodeType (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayMonster001._nodeTypeCacheMap.has(cfg.id)) {
            GameDisplayMonster001._nodeTypeCacheMap.set(
                cfg.id,
                UINodeType.Pop<GameDisplayMonster001, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayMonster001),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayMonster001, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        com.AnimTimeScale(state.playMachine.gameState._timeScale);
                                        let npcELe = state.playMachine.gameState.GetEleById<GameElementBody>(props);
                                        let pos = npcELe.commonFootPos;
                                        com.node.x = pos.x;
                                        com.node.y = pos.y;
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
            );
        };
        return this._nodeTypeCacheMap.get(cfg.id);
    }
}