import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import Logic3013 from "../game_element/body/logic_3013/Logic3013";
import utilMath from "../../frame/basic/UtilMath";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayMonster001`;

/**
 * 旋转角锁住，脚底位置对齐 + 3013 定制
 */
@ccclass
export default class GameDisplayMonster008 extends UIViewComponent {
    /**
     * 节点 - 不透明度
     */
    @property (cc.Node)
    nodeOpacity: cc.Node = null;

    /**
     * 节点缓存
     */
    static _nodeTypeCacheMap = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayMonster008, GamePlayViewState, number>>;
     /**
      * 获取对应的节点类型
      * @param res 
      * @returns 
      */
    static GetNodeType (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayMonster008._nodeTypeCacheMap.has(cfg.id)) {
            GameDisplayMonster008._nodeTypeCacheMap.set(
                cfg.id,
                UINodeType.Pop<GameDisplayMonster008, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayMonster008),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayMonster008, GamePlayViewState, number>(
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

                                        let logic3013 = npcELe.commonBehaviour as Logic3013;
                                        let opacityEnable = utilMath.Clamp (npcELe.commonEnabledMS / 200, 0, 1);
                                        let opacityDisable = utilMath.Clamp ((logic3013.args.life - npcELe.commonEnabledMS) / 200, 0, 1);
                                        com.node.opacity = opacityEnable * opacityDisable * 255;
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