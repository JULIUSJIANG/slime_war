import MgrSdkCore from "../MgrSdkCore";

/**
 * 微信云函数策略
 */
class MgrSdkCoreWXCloudFunctionRS<I, O> {

    /**
     * 接口名称
     */
    public name: string;

    public constructor (args: {
        name: string
    }) 
    {
        this.name = args.name;
    }
}

namespace MgrSdkCoreWXCloudFunctionRS {
    interface DateNowI {

    };
    interface DateNowO {
        ms: number
    };
    /**
     * 获取当前时间戳
     */
    export const dateNow = new MgrSdkCoreWXCloudFunctionRS<DateNowI, DateNowO> ({
        name: `date_now`
    });

    interface InfoSetI {
        info_json: object
    };
    interface InfoSetO {
        isStorageKeyValid: boolean
    };
    /**
     * 存储信息
     */
    export const infoSet = new MgrSdkCoreWXCloudFunctionRS<InfoSetI, InfoSetO> ({
        name: `info_set`
    });

    interface InfoGetI {

    };
    interface InfoGetO {
        info_json: object
    };
    /**
     * 获取信息
     */
    export const infoGet = new MgrSdkCoreWXCloudFunctionRS<InfoGetI, InfoGetO> ({
        name: `info_get`
    });

    interface MsgCommitI {
        nick_name: string;
        avatar_url: string;
    };
    interface MsgCommitO {
        open_id: string
    };
    /**
     * 同步信息
     */
    export const msgCommit = new MgrSdkCoreWXCloudFunctionRS<MsgCommitI, MsgCommitO>({
        name: `msg_commit`
    });

    interface HelpCommitI {
        help_open_id: string;
        help_id_prop: number;
    };
    interface HelpCommitO {
        msg: string
    };
    /**
     * 提交助力信息
     */
    export const helpCommit = new MgrSdkCoreWXCloudFunctionRS<HelpCommitI, HelpCommitO>({
        name: `help_commit`
    });

    interface GetHelpMsgI {

    };
    interface GetHelpMsgO {
        list_ctx: MgrSdkCore.JoinedCtx []
    };
    /**
     * 获取当前所有的对我的助力信息
     */
    export const getHelpMsg = new MgrSdkCoreWXCloudFunctionRS<GetHelpMsgI, GetHelpMsgO>({
        name: `get_help_msg`
    });
}

export default MgrSdkCoreWXCloudFunctionRS;