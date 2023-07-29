import { b2Filter } from "../../../box2d_ts/Box2D";
import UtilObjPool from "../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../frame/basic/UtilObjPoolType";

const APP = `GameCtxB2BodyFixtureTypeRS`;

/**
 * 形状的注册信息
 */
class GameCtxB2BodyFixtureTypeRS {
    /**
     * 索引
     */
    private static _idx: number = 0;

    private constructor () {}

    private static _t = new UtilObjPoolType<GameCtxB2BodyFixtureTypeRS>({
        instantiate: () => {
            return new GameCtxB2BodyFixtureTypeRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (
        apply: string,
        args: {
            name: string,
            recAbleCheck: (rs: GameCtxB2BodyFixtureTypeRS) => boolean,
            phyAble: boolean
        }
    )
    {
        let val = UtilObjPool.Pop(GameCtxB2BodyFixtureTypeRS._t, apply);
        val.idx = GameCtxB2BodyFixtureTypeRS._idx++;
        val.name = args.name;
        val.recAbleCheck = args.recAbleCheck;
        val.phyAble = args.phyAble;

        GameCtxB2BodyFixtureTypeRS.listRS.push (val);
        return val;
    }

    /**
     * 索引
     */
    idx: number;

    /**
     * 名称
     */
    name: string;

    /**
     * 记录许可
     */
    recAbleCheck: (rs: GameCtxB2BodyFixtureTypeRS) => boolean;

    /**
     * 物理许可
     */
    phyAble: boolean;

    /**
     * 分类的标识
     */
    categoryBits: number;
    /**
     * 遮罩标识
     */
    maskBits: number;
    /**
     * b2 过滤器
     */
    b2filter: b2Filter;
}

namespace GameCtxB2BodyFixtureTypeRS {
    /**
     * 列表形式的存储
     */
    export const listRS: Array <GameCtxB2BodyFixtureTypeRS> = [];

    /**
     * 有密度的身体形状，必定会被检测到
     */
    export const BODY = GameCtxB2BodyFixtureTypeRS.Pop(
        APP,
        {
            name: `BODY`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: true
        }
    );
    /**
     * 飞弹，只可能被护盾检测到
     */
    export const BODY_BULLET = GameCtxB2BodyFixtureTypeRS.Pop(
        APP,
        {
            name: `BODY_BULLET`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: false
        }
    );
    /**
     * 飞弹，只可能被护盾检测到
     */
    export const BODY_BULLET_GROUND = GameCtxB2BodyFixtureTypeRS.Pop(
        APP,
        {
            name: `BODY_BULLET_GROUND`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: true
        }
    );
    /**
     * 无密度的纯范围探测，必定不会被检测到
     */
    export const AREA = GameCtxB2BodyFixtureTypeRS.Pop(
        APP,
        {
            name: `AREA`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: false
        }
    );
    /**
     * 守卫，仅能检测到飞弹
     */
    export const AREA_SHIELD = GameCtxB2BodyFixtureTypeRS.Pop(
        APP,
        {
            name: `AREA_SHIELD`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: false
        }
    );
    /**
     * 剑气，能检测到所有 BODY，必定不会被检测到
     */
    export const AREA_SWORD = GameCtxB2BodyFixtureTypeRS.Pop(
        APP,
        {
            name: `AREA_SWORD`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: false
        }
    );

    /**
     * 护盾
     */
    export const SHIELD = GameCtxB2BodyFixtureTypeRS.Pop (
        APP,
        {
            name: `SHIELD`,
            recAbleCheck: (rs) => {
                switch (rs) {
                    case GameCtxB2BodyFixtureTypeRS.BODY: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.BODY_BULLET_GROUND: {
                        return true;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SHIELD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    case GameCtxB2BodyFixtureTypeRS.AREA_SWORD: {
                        return false;
                    };
                    default: {
                        return false;
                    };
                };
            },
            phyAble: false
        }
    )
};

for (let i = 0; i < GameCtxB2BodyFixtureTypeRS.listRS.length; i++) {
    let listRSI = GameCtxB2BodyFixtureTypeRS.listRS [i];
    // 每个类型有自己独一无二的标识
    listRSI.categoryBits = 1 << listRSI.idx;
    listRSI.maskBits = 0;
};
for (let i = 0; i < GameCtxB2BodyFixtureTypeRS.listRS.length; i++) {
    let listRSI = GameCtxB2BodyFixtureTypeRS.listRS [i];
    for (let j = 0; j < GameCtxB2BodyFixtureTypeRS.listRS.length; j++) {
        let listRSJ = GameCtxB2BodyFixtureTypeRS.listRS [j];

        let able = listRSI.recAbleCheck (listRSJ);
        // 如果能碰撞，i 的遮罩把 j 的记录下来，j 的遮罩把 i 也记录下来，否则 i 单方面记是无意义的
        if (able) {
            listRSI.maskBits |= listRSJ.categoryBits;
            listRSJ.maskBits |= listRSI.categoryBits;
        };
    };
};
for (let i = 0; i < GameCtxB2BodyFixtureTypeRS.listRS.length; i++) {
    let listRSI = GameCtxB2BodyFixtureTypeRS.listRS [i];
    listRSI.b2filter = new b2Filter ();
    listRSI.b2filter.categoryBits = listRSI.categoryBits;
    listRSI.b2filter.maskBits = listRSI.maskBits;
    listRSI.b2filter.groupIndex = 0;
};

export default GameCtxB2BodyFixtureTypeRS;