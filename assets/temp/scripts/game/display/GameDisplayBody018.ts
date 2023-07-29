import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import CfgGameElement from "../../frame/config/src/CfgGameElement";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBody from "../game_element/body/GameElementBody";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import Logic3033 from "../game_element/body/logic_3033/Logic3033";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBody018`;

const MAT_PROPERTY_ENABLED_TIME = `enabledTime`;

/**
 * 旋转角与速度挂钩，中心点对齐 + 刀光专用 + 光束改进
 */
@ccclass
export default class GameDisplayBody018 extends UIViewComponent {
    /** 
     * 列表 - 需要时间的节点
    */
    @property ([cc.RenderComponent])
    listRenderEnabledTime: Array<cc.RenderComponent> = [];

    /**
     * 用于上色的节点
     */
    @property (cc.Node)
    listNodeTint: Array <cc.Node> = [];

    /**
     * 节点 - 尺寸
     */
    @property (cc.Node)
    nodeSize: cc.Node = null;

    /**
     * 节点 - 偏移
     */
    @property (cc.Node)
    nodePos: cc.Node = null;

    /**
     * 节点缓存
     */
    static _nodeTypeCacheMapForAtk = UtilObjPool.Pop(UtilObjPool.typeMap, APP) as Map<number, UINodeType<GameDisplayBody018, GamePlayViewState, number>>;
    /**
     * 获取对应的节点类型
     * @param res 
     * @returns 
     */
    static GetNodeTypeForAtk (cfg: CfgGameElement) {
        let res = cfg.res_scene;
        if (!GameDisplayBody018._nodeTypeCacheMapForAtk.has(cfg.id)) {
            GameDisplayBody018._nodeTypeCacheMapForAtk.set(
                cfg.id,
                UINodeType.Pop<GameDisplayBody018, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayBody018),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayBody018, GamePlayViewState, number>(
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

                                        for (let i = 0; i < com.listNodeTint.length; i++) {
                                            com.listNodeTint [i].color = npcELe.commonCache.colorMain;
                                            com.listNodeTint [i].opacity = npcELe.commonCache.opacityMain;
                                        };
                                        
                                        for (let i = 0; i < com.listRenderEnabledTime.length; i++) {
                                            let render = com.listRenderEnabledTime [i];
                                            render.getMaterial(0).setProperty(MAT_PROPERTY_ENABLED_TIME, npcELe.commonEnabledMS);
                                        };

                                        let logic3033 = npcELe.commonBehaviour as Logic3033;
                                        com.nodeSize.width = logic3033.args.width;
                                        com.nodeSize.height = logic3033.args.height;
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