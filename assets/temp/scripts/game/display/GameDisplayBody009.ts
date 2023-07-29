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

const APP = `GameDisplayMonster009`;

const MAT_PROPERTY_ENABLED_TIME = `enabledTime`;

/**
 * 旋转角与速度挂钩，中心点对齐
 */
@ccclass
export default class GameDisplayMonster009 extends UIViewComponent {

    /** 
     * 列表 - 需要时间的节点
    */
    @property ([cc.RenderComponent])
    listRenderEnabledTime: Array<cc.RenderComponent> = [];

    /**
     * 节点缓存
     */
    static _nodeTypeCacheMapForAtk = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayMonster009, GamePlayViewState, number>>;
    /**
     * 获取对应的节点类型
     * @param res 
     * @returns 
     */
    static GetNodeTypeForAtk (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayMonster009._nodeTypeCacheMapForAtk.has(cfg.id)) {
            GameDisplayMonster009._nodeTypeCacheMapForAtk.set(
                cfg.id,
                UINodeType.Pop<GameDisplayMonster009, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayMonster009),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayMonster009, GamePlayViewState, number>(
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
                                        com.node.angle = npcELe.commonBody.b2Body.GetAngle () / Math.PI * 180;

                                        for (let i = 0; i < com.listRenderEnabledTime.length; i++) {
                                            let render = com.listRenderEnabledTime [i];
                                            render.getMaterial(0).setProperty(MAT_PROPERTY_ENABLED_TIME, npcELe.commonEnabledMS);
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