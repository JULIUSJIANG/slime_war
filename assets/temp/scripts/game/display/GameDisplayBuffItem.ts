import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GamePlayViewState from "../view/game_play/GamePlayViewState";
import GameElementBuff from "../game_element/buff/GameElementBuff";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayBuffItem`;

/**
 * 增减益的可视化
 */
@ccclass
export default class GameDisplayBuffItem extends UIViewComponent {
    /**
     * 图片 - 进度
     */
    @property([cc.Sprite])
    imgProgress: cc.Sprite[] = [];

    /**
     * 实例缓存
     */
    static _map: Map<string, UINodeType<GameDisplayBuffItem, GamePlayViewState, Array<number>>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 通过资源获取节点类型
     * @param res 
     * @returns 
     */
    static GetNodeTypeByRes (res: string) {
        if (!this._map.has(res)) {
            this._map.set(
                res,
                UINodeType.Pop<GameDisplayBuffItem, GamePlayViewState, Array<number>>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayBuffItem),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayBuffItem, GamePlayViewState, Array<number>>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let eleBuff = state.playMachine.gameState.GetEleById<GameElementBuff>(props[0]);
                                        com.node.scaleX = 1;
                                        com.node.scaleY = 1;

                                        // 更正进度
                                        let rate = 1;
                                        if (0 < eleBuff._cfg.layer_keep_ms) {
                                            rate = eleBuff.ms / eleBuff._cfg.layer_keep_ms;
                                        };
                                        for (let i = 0; i < com.imgProgress.length; i++) {
                                            com.imgProgress[i].fillRange = rate;
                                        };
                                    }
                                }
                            )
                        ],
                        childrenCreator: [],
                        propsType: BCType.typeArray,
                        hideRS: UINodeInstHideRS.setParentNull,
                        enterRS: UINodeInstEnterRS.none
                    }
                )
            );
        };
        return this._map.get(res);
    }
}