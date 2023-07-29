import MgrSdk from "../MgrSdk";
import MgrSdkCoreWX from "./MgrSdkCoreWX";
import MgrSdkCoreWXCloudCallRecord from "./MgrSdkCoreWXCloudCallRecord";
import MgrSdkCoreWXCloudStatus from "./MgrSdkCoreWXCloudStatus";

const APP = `MgrSdkCoreWXCloudStatusInited`;

/**
 * sdk 核心 - 微信 - 云状态 - 初始化完成
 */
export default class MgrSdkCoreWXCloudStatusInited extends MgrSdkCoreWXCloudStatus {
    /**
     * 集合 - 待处理的云函数
     */
    public listCallRecord: Array <MgrSdkCoreWXCloudCallRecord<any, any>> = [];

    public OnEnter(): void {
        // 处理掉所有滞留的任务
        for (let i = 0; i < this.listCallRecord.length; i++) {
            let record = this.listCallRecord [i];
            this.Call (record);
        };
        this.listCallRecord.length = 0;
    }

    /**
     * 调用云函数
     * @param record 
     */
    public Call (record: MgrSdkCoreWXCloudCallRecord<any, any>) {
        MgrSdk.inst.Log (`wx: cloud call [${record.rs.name}]...`, record);
        MgrSdkCoreWX.wx.cloud.callFunction({
            name: `${record.rs.name}`,
            data: record.t,
            success: (resp) => {
                MgrSdk.inst.Log (`wx: cloud call [${record.rs.name}] success`, resp.result);
                record.success (resp.result);
            },
            fail: (resp) => {
                MgrSdk.inst.Log (`wx: cloud call [${record.rs.name}] fail`, resp);
                record.fail (resp);
            }
        })
    }
}