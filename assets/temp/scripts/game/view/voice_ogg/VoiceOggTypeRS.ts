import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import jiang from "../../../frame/global/Jiang";
import VoiceOggInfo from "./VoiceOggInfo";

/**
 * 音频播放类型
 */
class VoiceOggTypeRS {

    /**
     * 名称
     */
    name: string;

    /**
     * 是否该循环播放
     */
    isLoop: boolean;

    /**
     * 音量读取器
     */
    getterVolume: () => number;
    
    constructor (args: {
        name: string,
        isLoop: boolean,
        getterVolume: () => number
    })
    {
        this.name = args.name;
        this.isLoop = args.isLoop;
        this.getterVolume = args.getterVolume;
    }
}


namespace VoiceOggTypeRS {

    /**
     * 背景音乐
     */
    export const bgm = new VoiceOggTypeRS ({
        name: `bgm`,
        isLoop: true,
        getterVolume: () => {
            return jiang.mgrData.Get (indexDataStorageItem.volumeMusic);
        }
    });

    /**
     * 音效
     */
    export const voice = new VoiceOggTypeRS ({
        name: `voice`,
        isLoop: false,
        getterVolume: () => {
            return jiang.mgrData.Get (indexDataStorageItem.volumeVoice);
        }
    });
}

export default VoiceOggTypeRS;