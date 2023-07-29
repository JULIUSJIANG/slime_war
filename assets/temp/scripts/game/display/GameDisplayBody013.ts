import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import jiang from "../../frame/global/Jiang";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import utilString from "../../frame/basic/UtilString";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayMonster013`;

/**
 * 旋转角与 b2 挂钩，中心点对齐
 */
@ccclass
export default class GameDisplayMonster013 extends UIViewComponent {
    /**
     * 用于上色的节点
     */
    @property (cc.Node)
    listNodeTint: Array <cc.Node> = [];

    /**
     * 节点缓存
     */
    static _nodeTypeCacheMapForAtk = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayMonster013, GamePlayViewState, number>>;
    /**
     * 获取对应的节点类型
     * @param res 
     * @returns 
     */
    static GetNodeTypeForAtk (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayMonster013._nodeTypeCacheMapForAtk.has(cfg.id)) {
            GameDisplayMonster013._nodeTypeCacheMapForAtk.set(
                cfg.id,
                UINodeType.Pop<GameDisplayMonster013, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayMonster013),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayMonster013, GamePlayViewState, number>(
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
                                        com.node.angle = npcELe.commonBody.b2Body.GetAngle() / Math.PI * 180;
                                        for (let i = 0; i < com.listNodeTint.length; i++) {
                                            com.listNodeTint [i].color = npcELe.commonCache.colorMain;
                                            com.listNodeTint [i].opacity = npcELe.commonCache.opacityMain;
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
            );
        };
        return this._nodeTypeCacheMapForAtk.get(cfg.id);
    }
}