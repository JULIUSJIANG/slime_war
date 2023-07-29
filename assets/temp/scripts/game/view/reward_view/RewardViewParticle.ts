import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import ParticleData from "../../game_element/common/ParticleData";
import RewardViewParticleData from "./RewardViewParticleData";
import RewardViewState from "./RewardViewState";

const {ccclass, property} = cc._decorator;

const APP = `RewardViewParticle`;

/**
 * 奖励界面粒子
 */
@ccclass
export default class RewardViewParticle extends UIViewComponent {

    static nodeType = UINodeType.Pop<RewardViewParticle, RewardViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/reward_view_particle`,
            componentGetter: node => node.getComponent (RewardViewParticle),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<RewardViewParticle, RewardViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.REWARD
                        ],
                        propsFilter: (com, state, props) => {
                            let data = state.particleGroup.mapIdToData.get (props) as ParticleData <RewardViewParticleData>;

                            // 位置比率
                            let ratePos = data.rate;
                            ratePos = Math.pow (ratePos, 0.25);
                            com.node.x = Math.cos (data.t.angle) * ratePos * data.t.posHor;
                            com.node.y = Math.sin (data.t.angle) * ratePos * data.t.posVer;

                            // 不透明度比率
                            let rateOpacity = 1.0 - Math.abs (data.rate - 0.5) / 0.5;
                            rateOpacity = Math.pow (rateOpacity, 0.5);
                            com.node.opacity = 255 * rateOpacity;

                            // 缩放
                            com.node.scale = data.t.sizeScale;
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.localScale0,
            enterRS: UINodeInstEnterRS.none
        }
    );
}