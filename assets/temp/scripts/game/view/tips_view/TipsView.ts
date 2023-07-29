import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import TipsViewLine from "./TipsViewLine";
import TipsViewState from "./TipsViewState";

const {ccclass, property} = cc._decorator;

const APP = `TipsView`;

/**
 * 提示界面
 */
@ccclass
export default class TipsView extends UIViewComponent {
    /**
     * 容器 - 行内容
     */
    @property(cc.Node)
    containerLine: cc.Node = null;

    static nodeType = UINodeType.Pop<TipsView, TipsViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/tips_view`,
            componentGetter: node => node.getComponent(TipsView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<TipsView, TipsViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.TIPSVIEW
                        ],
                        propsFilter: (com, state, props) => {
                            com.containerLine.active = state.listRecord.length != 0;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<TipsView, TipsViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerLine;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.listRecord.length; i++) {
                                let rec = state.listRecord[i];
                                listNode.push(TipsViewLine.nodeType.CreateNode(
                                    state,
                                    rec.id,
                                    rec.id
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}