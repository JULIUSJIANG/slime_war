import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import MgrSdkCoreWX from "../../../frame/sdk/wx/MgrSdkCoreWX";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import ExitViewState from "./ExitViewState";

const {ccclass, property} = cc._decorator;

const APP = `ExitView`;

/**
 * 退出界面
 */
@ccclass
export default class ExitView extends UIViewComponent {
    /**
     * 文本 - 提示
     */
    @property (cc.Label)
    txtTips: cc.Label = null;

    static nodeType = UINodeType.Pop<ExitView, ExitViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/exit_view`,
            componentGetter: node => node.getComponent (ExitView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <ExitView, ExitViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.EXIT
                        ],
                        propsFilter: (com, state, props) => {
                            // 当前电脑端的话，甩锅给手机; 当前手机端的话，甩锅给电脑
                            com.txtTips.string = `已在${(MgrSdk.inst.IsPc () ? `手机` : `电脑`)}登录，当前数据失效\n（自动退出${Math.ceil (MgrSdkCoreWX.inst.mgrLife.statusExitTips.msWait / 1000)}秒）`;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.opacityInForTemp200
        }
    )
}