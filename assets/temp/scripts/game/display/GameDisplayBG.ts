import BCType from "../../frame/basic/BCType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import UINodeType from "../../frame/ui/UINodeType";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import gameCommon from "../GameCommon";
import jiang from "../../frame/global/Jiang";
import utilMath from "../../frame/basic/UtilMath";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import CfgScene from "../../frame/config/src/CfgScene";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBG`;

/**
 * 颜色背景
 */
@ccclass
export default class GameDisplayBG extends UIViewComponent {
    /**
     * 节点 - 天空
     */
    @property(cc.Node)
    nodeSky: cc.Node = null;
    /**
     * 节点 - 地面
     */
    @property(cc.Node)
    nodeGround: cc.Node = null;

    /**
     * 资源到节点类型的映射
     */
    private static resToNodeTypeMap: Map<string, UINodeType<GameDisplayBG, GamePlayViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 通过资源路径获取节点类型
     * @param res 
     * @returns 
     */
    static GetNodeTypeByRes (res: string) {
        if (!this.resToNodeTypeMap.has(res)) {
            this.resToNodeTypeMap.set(
                res,
                UINodeType.Pop<GameDisplayBG, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayBG),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayBG, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let cfgScene = jiang.mgrCfg.cfgScene.select(CfgScene.idGetter, props)._list[0];

                                        com.nodeSky.x = state.cameraPos.x;
                                        com.nodeSky.y = state.cameraPos.y + cfgScene.bg_y_offset;
                                    
                                        com.nodeGround.x = Math.floor( state.borderLeft / gameCommon.GROUND_STANDARD_WIDTH ) * gameCommon.GROUND_STANDARD_WIDTH;
                                        com.nodeGround.y = gameCommon.GROUND_Y;
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
        return this.resToNodeTypeMap.get(res);
    }
}