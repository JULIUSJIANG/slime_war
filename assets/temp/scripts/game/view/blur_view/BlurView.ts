import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import BlurViewScreenShot from "./BlurViewScreenShot";
import BlurViewState from "./BlurViewState";

const {ccclass, property} = cc._decorator;

const APP = `BlurView`;

/**
 * 总的模糊界面
 */
@ccclass
export default class BlurView extends UIViewComponent {
    /**
     * 容器 - 截图内容
     */
    @property(cc.Node)
    containerScreenShot: cc.Node = null;

    static nodeType: UINodeType<BlurView, BlurViewState, number> = UINodeType.Pop (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/blur_view`,
            componentGetter: node => node.getComponent (BlurView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop <BlurView, BlurViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.BLUR
                        ],
                        propsFilter: (com, state, props) => {

                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<BlurView, BlurViewState, number> (
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerScreenShot;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 1; i <= BlurViewState.SCREEN_SHOOT_COUNT; i++) {
                                listNode.push (
                                    BlurViewScreenShot.nodeType.CreateNode (
                                        state,
                                        i,
                                        i
                                    )
                                );
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