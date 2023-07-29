import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import IndexViewState from "./IndexViewState";

const {ccclass, property} = cc._decorator;

const APP = `IndexViewTag`;

/**
 * 首页按钮的游标
 */
@ccclass
export default class IndexViewTag extends UIViewComponent {

    static nodeType = UINodeType.Pop<IndexViewTag, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/index_view_tag`,
            componentGetter: node => node.getComponent (IndexViewTag),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<IndexViewTag, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_MAIN
                        ],
                        propsFilter: (com, state, props) => {
                            com.node.y = state.currStatus.OnGetTagY ();
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