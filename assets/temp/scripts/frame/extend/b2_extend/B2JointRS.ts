import { b2DistanceJoint, b2Joint, b2JointType, b2MouseJoint, b2PulleyJoint, b2Vec2 } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";
import GraphicsDrawer from "../graphics_drawer/GraphicsDrawer";
import b2EleSetting from "./B2EleSetting";

const APP = `B2JointRS`;

/**
 * 关节的注册信息
 */
class B2JointRS<T extends b2Joint> {

    private constructor () {}

    private static _t = new UtilObjPoolType<B2JointRS<any>>({
        instantiate: () => {
            return new B2JointRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T extends b2Joint> (
        apply: string,
        type: b2JointType,
        drawer: (joint: T, p1: b2Vec2, p2: b2Vec2, gd: GraphicsDrawer) => void
    ) 
    {
        let val = UtilObjPool.Pop(B2JointRS._t, apply);
        val.type = type;
        val.drawer = drawer;

        B2JointRS._instMap.set(type, val);
        return val;
    }

    /**
     * 关节类型
     */
    type: b2JointType;
    /**
     * 具体的绘制方法
     */
    drawer: (joint: T, p1: b2Vec2, p2: b2Vec2, gd: GraphicsDrawer) => void;
}

namespace B2JointRS {
    /**
     * 实例记录
     */
    export const _instMap: Map<b2JointType, B2JointRS<any>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 距离
     */
    export const distance = B2JointRS.Pop<b2DistanceJoint>(
        APP,
        b2JointType.e_distanceJoint,
        (joint, p1, p2, gd) => {
            gd.StraightLine(
                p1.x, 
                p1.y, 
                p2.x, 
                p2.y, 
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.joint.areaBegin
            );
        }
    );

    /**
     * 滑轮
     */
    export const pulley = B2JointRS.Pop<b2PulleyJoint>(
        APP,
        b2JointType.e_pulleyJoint,
        (joint, p1, p2, gd) => {
            const s1 = joint.GetGroundAnchorA();
            const s2 = joint.GetGroundAnchorB();
            gd.StraightLine(
                s1.x,
                s1.y,
                p1.x,
                p1.y,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.joint.areaBegin
            );
            gd.StraightLine(
                s2.x,
                s2.y,
                p2.x,
                p2.y,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.joint.areaBegin
            );
            gd.StraightLine(
                s1.x,
                s1.y,
                s2.x,
                s2.y,
                gd.Pixel(b2EleSetting.lineWidth),
                b2EleSetting.color.joint.areaEnd
            );
        }
    );

    /**
     * 拖拽
     */
    export const mouse = B2JointRS.Pop<b2MouseJoint>(
        APP,
        b2JointType.e_mouseJoint,
        (joint, p1, p2, gd) => {
            gd.RoundFill(
                p1.x,
                p1.y,
                gd.Pixel(b2EleSetting.dotRadius),
                b2EleSetting.color.joint.dot
            );
            gd.RoundFill(
                p2.x,
                p2.y,
                gd.Pixel(b2EleSetting.dotRadius),
                b2EleSetting.color.joint.dot
            );
            gd.StraightLine(
                p1.x,
                p1.y,
                p2.x,
                p2.y,
                gd.Pixel(b2EleSetting.dotRadius),
                b2EleSetting.color.joint.areaBegin
            );
        }
    );
}

export default B2JointRS;