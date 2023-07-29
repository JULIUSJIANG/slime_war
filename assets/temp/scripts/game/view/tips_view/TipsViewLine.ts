import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import TipsViewState from "./TipsViewState";

const {ccclass, property} = cc._decorator;

const APP = `TipsViewLine`;

/**
 * 提示界面 - 行
 */
@ccclass
export default class TipsViewLine extends UIViewComponent {
    /**
     * 文本
     */
    @property(cc.Label)
    txt: cc.Label = null;

    static nodeType = UINodeType.Pop<TipsViewLine, TipsViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/tips_view_line`,
            componentGetter: node => node.getComponent(TipsViewLine),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<TipsViewLine, TipsViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.TIPSVIEW
                        ],
                        propsFilter: (com, state, props) => {
                            let rec: TipsViewState.Record;
                            for (let i = 0; i < state.listRecord.length; i++) {
                                if (props != state.listRecord[i].id) {
                                    continue;
                                };
                                rec = state.listRecord[i];
                            };
                            com.txt.string = rec.txt;

                            let rate = 1.0 - rec.lessMS / gameCommon.TIPS_HOLD;

                            let rateOpacity = 1.0 - Math.abs (rate - 0.5) / 0.5;
                            rateOpacity = Math.pow (rateOpacity, 0.25);
                            com.node.opacity = 255 * rateOpacity;

                            let rateScale = 1.0 - rate;
                            rateScale = Math.pow (rateScale, 8.0);
                            com.node.scale = 1.0 + rateScale * 2.0;
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
}