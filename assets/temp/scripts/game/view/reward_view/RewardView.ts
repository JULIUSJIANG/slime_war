import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import IndexDataModule from "../../../IndexDataModule";
import gameCommon from "../../GameCommon";
import RewardGrid from "../common/RewardGrid";
import RewardGridArgs from "../common/RewardGridArgs";
import RewardViewParticle from "./RewardViewParticle";
import RewardViewState from "./RewardViewState";


const {ccclass, property} = cc._decorator;

const APP = `RewardView`;

/**
 * 奖励界面
 */
@ccclass
export default class RewardView extends UIViewComponent {
    /**
     * 文本 - 标题
     */
    @property (cc.Label)
    txtTitle: cc.Label = null;

    /**
     * 容器 - 奖励
     */
    @property(cc.Node)
    containerReward: cc.Node = null;

    /**
     * 容器 - 粒子
     */
    @property (cc.Node)
    containerParticle: cc.Node = null;

    static nodeType = UINodeType.Pop<RewardView, RewardViewState, number>(
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/reward_view`,
            componentGetter: node => node.getComponent(RewardView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<RewardView, RewardViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.REWARD
                        ],
                        propsFilter: (com, state, props) => {
                            com.txtTitle.string = state.title;
                            com.containerReward.width = state.containerWidth;
                            com.containerReward.height = state.containerHeight;
                        }
                    }
                )
            ],
            childrenCreator: [
                UINodeType.ChildrenGeneration.Pop<RewardView, RewardViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerReward;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.listReward.length; i++) {
                                let rec = state.listReward[i];
                                listNode.push(rec.rs.onGetUIRewardNodeType().CreateNode(
                                    state,
                                    RewardGridArgs.Pop (rec.rs, rec.props),
                                    i
                                ));
                            };
                        }
                    }
                ),
                UINodeType.ChildrenGeneration.Pop<RewardView, RewardViewState, number>(
                    APP,
                    {
                        containerGetter: (tCom) => {
                            return tCom.containerParticle;
                        },
                        uiNodeCreator: (state, props, listNode) => {
                            for (let i = 0; i < state.particleGroup.listParticleData.length; i++) {
                                let particleData = state.particleGroup.listParticleData [i];
                                listNode.push (RewardViewParticle.nodeType.CreateNode (
                                    state,
                                    particleData.id,
                                    particleData.id
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