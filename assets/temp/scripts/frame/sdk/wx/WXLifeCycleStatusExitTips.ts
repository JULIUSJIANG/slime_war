import IndexDataModule from "../../../IndexDataModule";
import ExitView from "../../../game/view/exit_view/ExitView";
import ExitViewState from "../../../game/view/exit_view/ExitViewState";
import jiang from "../../global/Jiang";
import WXLifeCycleStatus from "./WXLifeCycleStatus";

const APP = `WXLifeCycleStatusExitTips`;

/**
 * 微信生命周期 - 状态 - 告知
 */
class WXLifeCycleStatusExitTips extends WXLifeCycleStatus {
    /**
     * 提示的倒计时
     */
    msWait = 5000;
    /**
     * 用于监听帧刷新的 id
     */
    idListenUpdate: number;

    OnEnter(): void {
        jiang.mgrUI.Open (
            ExitView.nodeType,
            ExitViewState.Pop (APP)
        );
        this.idListenUpdate = jiang.mgrEvter.evterUpdate.On ((ms) => {
            this.msWait -= ms;
            // 最小值为 0
            this.msWait = Math.max (this.msWait, 0);
            // 刷新界面
            jiang.mgrUI.ModuleRefresh (IndexDataModule.EXIT);

            // 没有剩余时间，立即退出
            if (this.msWait == 0) {
                this.relMachine.EnterStatus (this.relMachine.statusExited);
            };
        });
    }

    OnExit(): void {
        jiang.mgrEvter.evterUpdate.Off (this.idListenUpdate);
    }
}

export default WXLifeCycleStatusExitTips;