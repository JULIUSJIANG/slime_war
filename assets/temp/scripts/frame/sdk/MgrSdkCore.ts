import MgrSdkEnterRS from "./MgrSdkEnterRS";

/**
 * sdk 核心
 */
abstract class MgrSdkCore {
    /**
     * 初始化
     */
    abstract Init (): Promise <unknown>;
    /**
     * 授权
     */
    abstract Author (): Promise <unknown>;

    /**
     * 本地 - 存储 - 不要求可靠
     * @param key 
     * @param val 
     */
    abstract LocalSet (val: object): Promise<unknown>;
    /**
     * 本地 - 读取 - 不要求可靠
     * @param key 
     */
    abstract LocalGet (): Promise<object>;

    /**
     * 远程 - 存储 - 要求可靠
     * @param key 
     * @param val 
     */
    abstract ServerSet (val: object): Promise<unknown>;
    /**
     * 远程 - 读取 - 要求可靠
     * @param key 
     */
    abstract ServerGet (): Promise<object>;
    
    /**
     * 当前的毫秒时间戳
     * @returns 
     */
    abstract DateNow (): Promise<number>;
    /**
     * 把远程图片设置进精灵里面
     * @param spr 
     * @param url 
     */
    abstract FillSprByUrl (spr: cc.Sprite, url: string);

    /**
     * 播放音频
     * @param clip 
     * @param loop 
     * @param volume 
     * @returns 
     */
    AudioPlay (clip: cc.AudioClip, loop: boolean, volume: number) {
        return cc.audioEngine.play (
            clip,
            loop,
            volume
        );
    }
    /**
     * 停止音频
     * @param idAudio 
     */
    AudioStop (idAudio: number) {
        cc.audioEngine.stop (idAudio);
    }
    /**
     * 设置音量
     * @param idAudio 
     * @param volume 
     */
    AudioVolume (idAudio: number, volume: number) {
        cc.audioEngine.setVolume (idAudio, volume);
    }

    /**
     * 分享
     * @param title 
     * @param props 
     */
    abstract WXShare<S, C> (title: string, rs: MgrSdkEnterRS<S>,  props: S, imgId: string, imgUrl: string);
    /**
     * 获取 openId
     */
    abstract WXGetOpenId ();
    /**
     * 进行视频观看
     */
    abstract WXVideo (): Promise<MgrSdkCore.VideoCtx>;
    /**
     * 获取用户头像
     */
    abstract WXGetPlayerHeadUrl (): string;
    /**
     * 获取邀请信息
     */
    abstract WXGetListCtxJoined (): Array<MgrSdkCore.JoinedCtx>;
    /**
     * 刷新邀请信息
     */
    abstract WXRefreshListCtxJoined (): Promise<unknown>;
    /**
     * 提交助力信息
     * @param openId 
     * @param idProp 
     */
    abstract WXHelpCommit (openId: string, idProp: number): Promise<string>;
}

namespace MgrSdkCore {
    /**
     * 视频观看结果的上下文
     */
    export interface VideoCtx {
        /**
         * 奖励发放许可
         */
        isRewardAble: boolean;
    };
    /**
     * 邀请信息
     */
    export interface JoinedCtx {
        /**
         * 邀请索引
         */
        id_prop: number;
        /**
         * 头像地址
         */
        url: string;
    };
}

export default MgrSdkCore;