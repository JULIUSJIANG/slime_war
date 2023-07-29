import indexBuildConfig from "../IndexBuildConfig";
import UtilObjPool from "../frame/basic/UtilObjPool";

const APP = `VideoStatusRS`;

/**
 * 视频模块的开关状态
 */
class VideoStatusRS {
    /**
     * 开关状态
     */
    enable: boolean;

    constructor (args: {
        enable: boolean
    })
    {
        this.enable = args.enable;
        VideoStatusRS.mapStatusToRS.set (args.enable, this);
    }
}

namespace VideoStatusRS {
    /**
     * 状态到注册信息的映射
     */
    export const mapStatusToRS: Map <boolean, VideoStatusRS> = UtilObjPool.Pop (UtilObjPool.typeMap, APP);

    /**
     * 启用
     */
    export const enable = new VideoStatusRS ({
        enable: true
    });

    /**
     * 关闭
     */
    export const disable = new VideoStatusRS ({
        enable: false
    });

    export function Current () {
        return mapStatusToRS.get (indexBuildConfig.VIDEO_ENABLE);
    }
}

export default VideoStatusRS;