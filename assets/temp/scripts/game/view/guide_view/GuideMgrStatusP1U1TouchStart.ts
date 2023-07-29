import indexDataStorageItem from "../../../IndexStorageItem";
import utilNode from "../../../frame/basic/UtilNode";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import gameCommon from "../../GameCommon";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导管理器 - 状态 - 引导点击按钮
 */
export default class GuideMgrStatusP1U1TouchStart extends GuideMgrStatus {
    public P1U1OnGotNodeIndexViewBtnStart(evter: ComponentNodeEventer): void {
        // utilNode.SetGroup (evter.node, gameCommon.GROUP_IDX_GUIDE);
    }

    public P1U1OnGotNodeIndexViewBtnStartTouch(evter: ComponentNodeEventer): void {
        // utilNode.SetGroup (evter.node, gameCommon.GROUP_IDX_UI);
        this.relMgr.EnterStatus (this.relMgr.statusP1U2Wait);
    }
}