import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import CfgVoiceOgg from "../../../frame/config/src/CfgVoiceOgg";
import jiang from "../../../frame/global/Jiang";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import VoiceOggViewState from "./VoiceOggViewState";

const {ccclass, property} = cc._decorator;

const APP = `VoiceOggViewItem`;

/**
 * 音频界面-音频实例
 */
@ccclass
export default class VoiceOggViewItem extends UIViewComponent {
    /**
     * 音频播放组件
     */
    @property(cc.AudioSource)
    as: cc.AudioSource = null;

    /**
     * 已缓存的节点类型
     */
    static cacheMap: Map<number, UINodeType<VoiceOggViewItem, VoiceOggViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 通过配表 id 获取节点类型
     * @param cfgId 
     */
    static GetByCfgId (cfgId: number) {
        if (!this.cacheMap.has(cfgId)) {
            let voiceCfg = jiang.mgrCfg.cfgVoiceOgg.select(CfgVoiceOgg.idGetter, cfgId)._list[0];
            let nodeType = UINodeType.Pop<VoiceOggViewItem, VoiceOggViewState, number>(
                APP,
                {
                    prefabPath: voiceCfg.res,
                    componentGetter: node => node.getComponent(VoiceOggViewItem),
                    listModuleStyle: [
                        UINodeType.ModuleStyle.Pop<VoiceOggViewItem, VoiceOggViewState, number>(
                            APP,
                            {
                                listRefModule: [
                                    IndexDataModule.DEFAULT,
                                    IndexDataModule.VOICE_OGG_VIEW
                                ],
                                propsFilter: (com, state, props) => {
                                    let ele = state.GetRec(props);
                                    if (ele.typeRS.isLoop) {
                                        ele.lifeMax = -1;
                                    }
                                    else {
                                        ele.lifeMax = com.as.getDuration() * 1000;
                                    };
                                    ele.com = com;
                                    ele.currStatus.OnDisplay ();
                                }
                            }
                        )
                    ],
                    childrenCreator: [],
                    propsType: BCType.typeNumber,
                    hideRS: UINodeInstHideRS.setParentNull,
                    enterRS: UINodeInstEnterRS.none
                }
            );
            this.cacheMap.set(cfgId, nodeType);
        };
        return this.cacheMap.get(cfgId);
    }
}