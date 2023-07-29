import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import YesViewState from "./YesViewState";

const {ccclass, property} = cc._decorator;

const APP = `YesView`;

/**
 * 确认界面-样式
 */
@ccclass
export default class YesView extends UIViewComponent {
    /**
     * 文本-提示信息
     */
    @property(cc.Label)
    txt: cc.Label = null;
    /**
     * 按钮-确认
     */
    @property(ComponentNodeEventer)
    btnYes: ComponentNodeEventer = null;

    /**
     * 确认
     * @param txt 
     * @returns 
     */
    static Certain (
        txt: string
    ): Promise<unknown> 
    {
        let certainState = YesViewState.Pop(
            APP,
            txt
        );
        return certainState.ctrl._promise;
    }
}