import MgrSdkCoreWXCloudFunctionRS from "./MgrSdkCoreWXCloudFunctionRS";

/**
 * 云函数的调用记录
 */
export default class MgrSdkCoreWXCloudCallRecord<I, O> {
    /**
     * 注册信息
     */
    rs: MgrSdkCoreWXCloudFunctionRS<I, O>;
    /**
     * 参数
     */
    t: I;
    /**
     * 成功的回调
     */
    success: (resp: O) => void;
    /**
     * 失败的回调
     */
    fail: (resp: any) => void;
    /**
     * 重试的延时
     */
    retryTimeout = 0;

    public constructor (args: {
        rs: MgrSdkCoreWXCloudFunctionRS<I, O>,
        t: I,
        success: (resp: O) => void,
        fail: (resp: any) => void
    })
    {
        this.rs = args.rs;
        this.t = args.t;
        this.success = args.success;
        this.fail = args.fail;
    }
}