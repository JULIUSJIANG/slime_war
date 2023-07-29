import BCType from "../../frame/basic/BCType";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UINodeInstEnterRS from "../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../frame/ui/UINodeType";
import UIViewComponent from "../../frame/ui/UIViewComponent";
import IndexDataModule from "../../IndexDataModule";
import GameElementPart from "../game_element/common/GameElementPart";
import gameCommon from "../GameCommon";
import GamePlayViewState from "../view/game_play/GamePlayViewState";

const {ccclass, property} = cc._decorator;

const APP = `GameDisplayPart`;

/**
 * 碎块
 */
@ccclass
export default class GameDisplayPart extends UIViewComponent {
    /**
     * 核心颜色
     */
    @property(cc.Node)
    nodeColor: cc.Node = null;

    static _mapNodeType: Map<string, UINodeType<GameDisplayPart, GamePlayViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    static GetNodeTypeByPath (res: string) {
        if (!GameDisplayPart._mapNodeType.has(res)) {
            GameDisplayPart._mapNodeType.set(
                res,
                UINodeType.Pop<GameDisplayPart, GamePlayViewState, number>(
                    APP,
                    {
                        prefabPath: res,
                        componentGetter: node => node.getComponent(GameDisplayPart),
                        listModuleStyle: [
                            UINodeType.ModuleStyle.Pop<GameDisplayPart, GamePlayViewState, number>(
                                APP,
                                {
                                    listRefModule: [
                                        IndexDataModule.DEFAULT,
                                        IndexDataModule.PLAYING
                                    ],
                                    propsFilter: (com, state, props) => {
                                        let elePart = state.playMachine.gameState.GetEleById<GameElementPart>(props);
                                        com.node.x = elePart.currPos.x;
                                        com.node.y = elePart.currPos.y;

                                        /// 更正透明度
                                        let opacity =  1 - elePart.totalMS / elePart.maxLifeMS;
                                        com.nodeColor.opacity = Math.max(0, opacity) * elePart.opacity;

                                        // 更正颜色
                                        com.nodeColor.color = elePart.color;
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
        return GameDisplayPart._mapNodeType.get(res);
    }

    /**
     * 无描边
     */
    static nodeType101 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_1`);
    static nodeType102 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_2`);
    static nodeType103 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_3`);
    static nodeType104 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_4`);
    static nodeType105 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_5`);
    static nodeType106 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_6`);
    static nodeType107 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_7`);
    static nodeType108 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_8`);
    static nodeType109 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_9`);
    static nodeType110 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_1_10`);

    /**
     * 有描边
     */
    static nodeType201 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_1`);
    static nodeType202 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_2`);
    static nodeType203 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_3`);
    static nodeType204 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_4`);
    static nodeType205 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_5`);
    static nodeType206 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_6`);
    static nodeType207 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_7`);
    static nodeType208 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_8`);
    static nodeType209 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_9`);
    static nodeType210 = GameDisplayPart.GetNodeTypeByPath(`${gameCommon.SUB_MAIN}/prefab_part/part_2_10`);
}