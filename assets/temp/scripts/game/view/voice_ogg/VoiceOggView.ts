import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import VoiceOggViewItem from "./VoiceOggViewItem";
import VoiceOggViewState from "./VoiceOggViewState";

const {ccclass, property} = cc._decorator;

const APP = `VoiceOggView`;

/**
 * 音频界面-样式
 */
@ccclass
export default class VoiceOggView extends UIViewComponent {
    static nodeType = UINodeType.Pop<VoiceOggView, VoiceOggViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/voice_ogg_view`,
            componentGetter: node => node.getComponent(VoiceOggView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<VoiceOggView, VoiceOggViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.VOICE_OGG_VIEW
                        ],
                        propsFilter: (com, state, props) => {

                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<VoiceOggView, VoiceOggViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.node;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.infoList.length; i++) {
                                let infoListI = state.infoList [i];
                                listNode.push (VoiceOggViewItem.GetByCfgId(infoListI.cfgId).CreateNode (
                                    state, 
                                    infoListI.genId, 
                                    infoListI.genId
                                ));
                            };
                        }
                    }
                )
            ],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}