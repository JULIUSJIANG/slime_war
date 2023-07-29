import UtilObjPool from "../../../frame/basic/UtilObjPool";
import GameStateReward from "../../game_element/GameStateReward";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import ShareViewRS from "./ShareViewRS";

const APP = `ShareViewGroup`;

/**
 * 奖励类型的当前记录
 */
class ShareViewGroup {
    /**
     * 在集合中的索引
     */
    public idx: number;

    /**
     * 具体的行为策略
     */
    public rs: ShareViewRS;

    /**
     * 奖励信息
     */
    public reward: GameStateReward;

    public constructor (args: {
        idx: number,
        rs: ShareViewRS
    }) 
    {
        this.idx = args.idx;
        this.rs = args.rs;
        let rewardProps: Array <number> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
        rewardProps.push (this.rs.idProp, 1);
        this.reward = {
            rs: GameCfgBodyCacheDropRS.xlsxBackpackProp,
            props: rewardProps
        };
    }
}

namespace ShareViewGroup {

}

export default ShareViewGroup;