import { b2Contact, b2BuoyancyController, b2Controller } from "../../../../box2d_ts/Box2D";
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";
import GraphicsDrawer from "../graphics_drawer/GraphicsDrawer";
import b2EleSetting from "./B2EleSetting";

const APP = `B2ControllerRS`;

/**
 * 约束的注册信息
 */
class B2ControllerRS<T extends b2Controller> {
    
    private constructor () {}

    private static _t = new UtilObjPoolType<B2ControllerRS<any>>({
        instantiate: () => {
            return new B2ControllerRS();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop<T extends b2Controller> (
        apply: string,
        type: Function,
        drawer: (ctrl: T, gd: GraphicsDrawer) => void
    ) 
    {
        let val = UtilObjPool.Pop(B2ControllerRS._t, apply);
        val.type = type;
        val.drawer = drawer;

        B2ControllerRS._mapInst.set(type, val);
        return val as B2ControllerRS<T>;
    }

    type: Function;

    drawer: (ctrl: T, gd: GraphicsDrawer) => void
}

namespace B2ControllerRS {
    /**
     * 实例记录
     */
    export const _mapInst: Map<Function, B2ControllerRS<any>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 水面
     */
    export const buoyancy = B2ControllerRS.Pop<b2BuoyancyController>(
        APP,
        b2BuoyancyController,
        (ctrl, gd) => {
            const r = b2EleSetting.farLen;
            let normal = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            normal.x = ctrl.normal.x;
            normal.y = ctrl.normal.y;
            normal.Normalize();
            const p1 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            const p2 = UtilObjPool.Pop(UtilObjPool.typeB2Vec2, APP);
            p1.x = normal.x * ctrl.offset + normal.y * r;
            p1.y = normal.y * ctrl.offset - normal.x * r;
            p2.x = normal.x * ctrl.offset - normal.y * r;
            p2.y = normal.y * ctrl.offset + normal.x * r;
            gd.StraightLine(
                p1.x, 
                p1.y, 
                p2.x, 
                p2.y, 
                gd.Pixel(b2EleSetting.lineWidth), 
                b2EleSetting.color.controller.b2BuoyancyController
            );
            UtilObjPool.Push(normal);
            UtilObjPool.Push(p1);
            UtilObjPool.Push(p2);
        }
    );
}

export default B2ControllerRS;