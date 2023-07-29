import MgrSdk from "../MgrSdk";
import MgrSdkCoreWX from "./MgrSdkCoreWX";
import MgrSdkCoreWXCloudStatus from "./MgrSdkCoreWXCloudStatus";

const APP = `MgrSdkCoreWXCloudStatusIniting`;

/**
 * sdk 核心 - 微信 - 云状态 - 初始化中
 */
export default class MgrSdkCoreWXCloudStatusIniting extends MgrSdkCoreWXCloudStatus {
    public OnEnter(): void {
        MgrSdk.inst.Log (`wx: cloud initing...`);
        MgrSdkCoreWX.wx.cloud.init ({})
            .then ((resp) => {
                MgrSdk.inst.Log (`wx: cloud inited!`, resp);
                this.relMachine.CloudEnterStatus (this.relMachine.cloudStatusInited);
            })
            .catch (() => {
                this.relMachine.CloudEnterStatus (this.relMachine.cloudStatusIniting);
            });
    }
}