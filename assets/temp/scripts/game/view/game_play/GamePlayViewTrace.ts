import BCType from "../../../frame/basic/BCType";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import GamePlayViewState from "./GamePlayViewState";
import GamePlayViewStateMgrTraceRecord from "./GamePlayViewStateMgrTraceRecord";

const APP = `GamePlayViewTrace`;

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamePlayViewTrace extends UIViewComponent {

    /**
     * 精灵
     */
    @property(cc.Sprite)
    spr: cc.Sprite = null;

    static nodeType = UINodeType.Pop<GamePlayViewTrace, GamePlayViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/game_play_view_trace`,
            componentGetter: node => node.getComponent(GamePlayViewTrace),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<GamePlayViewTrace, GamePlayViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.PLAYING
                        ],
                        propsFilter: (com, state, props) => {
                            let rec = state.mgrTrace.mapIdToRecord.get(props);
                            com.spr.spriteFrame = rec.sprf;
                            com.spr.node.width = rec.width;
                            com.spr.node.height = rec.height;
                            com.node.x = rec.posX;
                            com.node.y = rec.posY;

                            let opacity = 1 - rec.existedTime / gameCommon.TRACE_KEEP;
                            com.spr.node.opacity = 255 * Math.max(0, opacity);
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