import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import LockViewState from "./LockViewState";

const {ccclass, property} = cc._decorator;

const APP = `LockView`;

/**
 * 锁定界面
 */
@ccclass
export default class LockView extends UIViewComponent {
    /**
     * 节点 - 全屏锁住
     */
    @property (cc.Node)
    nodeLock: cc.Node = null;

    static nodeType = UINodeType.Pop<LockView, LockViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/lock_view`,
            componentGetter: node => node.getComponent (LockView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <LockView, LockViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.LOCK
                        ],
                        propsFilter: (com, state, props) => {
                            com.nodeLock.active = state.isLocking;
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