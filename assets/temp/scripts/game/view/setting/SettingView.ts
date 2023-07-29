import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import indexDataStorageItem from "../../../IndexStorageItem";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import SettingViewState from "./SettingViewState";

const {ccclass, property} = cc._decorator;

const APP = `SettingView`;

/**
 * 城镇界面 - 样式
 */
@ccclass
export default class SettingView extends UIViewComponent {
    /**
     * 文本 - 音乐
     */
    @property(cc.Label)
    txtMusic: cc.Label = null;
    /**
     * 音乐
     */
    @property(ComponentNodeEventer)
    sliderMusic: ComponentNodeEventer = null;
    /**
     * 音乐的事件派发器
     */
    @property(ComponentNodeEventer)
    evterMusic: ComponentNodeEventer = null;

    /**
     * 文本 - 音效
     */
    @property(cc.Label)
    txtVoice: cc.Label = null;
    /**
     * 音效
     */
    @property(ComponentNodeEventer)
    sliderVoice: ComponentNodeEventer = null;
    /**
     * 音效的事件派发器
     */
    @property(ComponentNodeEventer)
    evterVoice: ComponentNodeEventer = null;

    static nodeType = UINodeType.Pop<SettingView, IndexViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/setting_view`,
            componentGetter: node => node.getComponent(SettingView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<SettingView, IndexViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_SETTING
                        ],
                        propsFilter: (com, state, props) => {
                            com.txtMusic.string = `音乐音量 ${Math.ceil(100 * jiang.mgrData.Get(indexDataStorageItem.volumeMusic))}%`;
                            com.sliderMusic.slider.progress = jiang.mgrData.Get(indexDataStorageItem.volumeMusic);
                            com.sliderMusic.evterSlide.On((args) => {
                                jiang.mgrData.Set(indexDataStorageItem.volumeMusic, com.sliderMusic.slider.progress);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_SETTING);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.VOLUME_CHANGE);
                            });
                            com.evterMusic.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });

                            com.txtVoice.string = `音效音量 ${Math.ceil(100 * jiang.mgrData.Get(indexDataStorageItem.volumeVoice))}%`;
                            com.sliderVoice.slider.progress = jiang.mgrData.Get(indexDataStorageItem.volumeVoice);
                            com.sliderVoice.evterSlide.On((args) => {
                                jiang.mgrData.Set(indexDataStorageItem.volumeVoice, com.sliderVoice.slider.progress);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.INDEXVIEW_SETTING);
                                jiang.mgrUI.ModuleRefresh(IndexDataModule.VOLUME_CHANGE);
                            });
                            com.evterVoice.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet(gameCommon.BTN_VOICE);
                            });
                        }
                    }
                ),
                UINodeType.ModuleStyle.Pop<SettingView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_CHILDREN_ABLE
                        ],
                        propsFilter: (com, state, props) => {
                            UINodeInstHideRS.ClearScale0 ();
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
}