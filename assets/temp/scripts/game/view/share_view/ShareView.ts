import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import MgrSdk from "../../../frame/sdk/MgrSdk";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import IndexViewState from "../index_view/IndexViewState";
import VoiceOggViewState from "../voice_ogg/VoiceOggViewState";
import ShareViewItem from "./ShareViewItem";
import ShareViewState from "./ShareViewState";

const {ccclass, property} = cc._decorator;

const APP = `ShareView`;

/**
 * 分享界面
 */
@ccclass
export default class ShareView extends UIViewComponent {

    /**
     * 玩家头像
     */
    @property (cc.Sprite)
    sprPlayerHead: cc.Sprite = null;

    /**
     * 放置单元的容器
     */
    @property (cc.Node)
    containerItem: cc.Node = null;

    /**
     * 按钮 - 刷新
     */
    @property (ComponentNodeEventer)
    evterRefresh: ComponentNodeEventer = null;

    static nodeType = UINodeType.Pop <ShareView, IndexViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/share_view`,
            componentGetter: node => node.getComponent(ShareView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<ShareView, IndexViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.INDEXVIEW_SHARE,
                            IndexDataModule.SDK
                        ],
                        propsFilter: (com, state, props) => {
                            MgrSdk.inst.core.FillSprByUrl (com.sprPlayerHead, MgrSdk.inst.core.WXGetPlayerHeadUrl ());
                            com.evterRefresh.evterTouchStart.On (() => {
                                VoiceOggViewState.inst.VoiceSet (gameCommon.BTN_VOICE);
                            });
                            com.evterRefresh.evterTouchEnd.On (() => {
                                state.stateShare.RefreshJoinData ();
                            });
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop <ShareView, IndexViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerItem;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            if (!state.stateShare.childrenAble) {
                                return;
                            };
                            for (let i = 0; i < state.stateShare.listGroup.length; i++) {
                                listNode.push (ShareViewItem.nodeType.CreateNode (
                                    state,
                                    i,
                                    i
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
    )
}