import indexBuildConfig from "../../../IndexBuildConfig";
import indexDataStorageItem from "../../../IndexStorageItem";
import jiang from "../../../frame/global/Jiang";
import GuideMgrStatus from "./GuideMgrStatus";

/**
 * 新手引导管理器 - 状态 - 待机
 */
export default class GuideMgrStatusIdle extends GuideMgrStatus {
    public OnInited(): void {
        if (jiang.mgrData.Get (indexDataStorageItem.guideStep) == 0 && indexBuildConfig.GUIDE_ENABLE) {
            this.relMgr.EnterStatus (this.relMgr.statusP1U1TouchStart);
        };
    }
}