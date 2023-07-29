import UtilObjPool from "../../../frame/basic/UtilObjPool";
import ComponentNodeEventer from "../../../frame/component/ComponentNodeEventer";
import ChallengeSelectView from "./ChallengeSelectView";

/**
 * 注册信息
 */
class ChallengeSelectViewStateRS {

    /**
     * 代号
     */
    public code: number;

    /**
     * 激活的节点获取器
     */
    public nodeActiveGetter: (com: ChallengeSelectView) => cc.Node;
    /**
     * 按钮获取器
     */
    public btnSelectGetter: (com: ChallengeSelectView) => ComponentNodeEventer;
    /**
     * 滚动视图获取器
     */
    public scrollGetter: (com: ChallengeSelectView) => ComponentNodeEventer;

    constructor (args: {
        code: number,
        nodeActiveGetter: (com: ChallengeSelectView) => cc.Node,
        btnSelectGetter: (com: ChallengeSelectView) => ComponentNodeEventer,
        scrollGetter: (com: ChallengeSelectView) => ComponentNodeEventer
    })
    {
        this.code = args.code;
        this.nodeActiveGetter = args.nodeActiveGetter;
        this.btnSelectGetter = args.btnSelectGetter;
        this.scrollGetter = args.scrollGetter;

        ChallengeSelectViewStateRS.mapCodeToRS.set (args.code, this);
        ChallengeSelectViewStateRS.listRS.push (this);
    }
}

namespace ChallengeSelectViewStateRS {
    /**
     * 代号到策略的注册信息
     */
    export const mapCodeToRS: Map <number, ChallengeSelectViewStateRS> = new Map ();
    /**
     * 列表 - 注册
     */
    export const listRS: Array <ChallengeSelectViewStateRS> = [];

    /**
     * 关卡
     */
    export const level = new ChallengeSelectViewStateRS ({
        code: 1,
        nodeActiveGetter: (com) => {
            return com.levelNodeActive;
        },
        btnSelectGetter: (com) => {
            return com.levelBtnSelect;
        },
        scrollGetter: (com) => {
            return com.levelScroll;
        }
    });

    /**
     * 图鉴
     */
    export const book = new ChallengeSelectViewStateRS ({
        code: 2,
        nodeActiveGetter: (com) => {
            return com.bookNodeActive;
        },
        btnSelectGetter: (com) => {
            return com.bookBtnSelect;
        },
        scrollGetter: (com) => {
            return com.bookScroll;
        }
    });
}

export default ChallengeSelectViewStateRS;