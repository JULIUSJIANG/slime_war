import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";

const APP = `RewardGridArgs`;

/**
 * 奖励单元的参数
 */
export default class RewardGridArgs {
    /**
     * 注册信息
     */
    rs: GameCfgBodyCacheDropRS<any>;
    /**
     * 参数
     */
    props: Array<number>;

    private static _t = new UtilObjPoolType<RewardGridArgs>({
        instantiate: () => {
            return {
                rs: null,
                props: null
            };
        },
        onPop: (t) => {

        },
        onPush: (t) => {
            
        },
        tag: APP
    });

    public static Pop (
        rs: GameCfgBodyCacheDropRS<any>,
        props: Array<number>
    ) 
    {
        let val = UtilObjPool.Pop (RewardGridArgs._t, APP);
        val.rs = rs;
        val.props = props;
        return val;
    }

    public static bcType = BCType.Pop<RewardGridArgs> (
        APP,
        (a, b) => {
            if (a.rs != b.rs) {
                return false;
            };
            return BCType.typeArray._equal (a.props, b.props);
        },
        (inst) => {
            UtilObjPool.Push (inst);
        },
        (t) => {
            let cloneProps = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
            cloneProps.push (...t.props);
            let c = RewardGridArgs.Pop (
                t.rs,
                cloneProps
            );
            return c;
        }
    )
}