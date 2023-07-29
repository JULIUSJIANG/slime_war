import MgrDataItem from "../data/MgrDataItem";
import UIViewComponent from "../ui/UIViewComponent";
import { b2World } from "../../../box2d_ts/Box2D";
import DebugViewState from "./DebugViewState";
import UINodeType from "../ui/UINodeType";
import DebugViewGroupFast from "./DebugViewGroupFast";
import DebugViewGroupModule from "./DebugViewGroupModule";
import DebugViewGroupMessage from "./DebugViewGroupMessage";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import UtilObjPool from "../basic/UtilObjPool";

const APP = `DebugViewDefine`;

namespace DebugViewDefine {
    /**
     * 绘制信息
     */
    export class B2DrawInfo {

        private constructor () {}

        private static _t = new UtilObjPoolType<B2DrawInfo> ({
            instantiate: () => {
                return new B2DrawInfo();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `B2DrawInfo`
        });

        static Pop (
            apply: string,
            b2w: b2World,
            posScale: number,
            wX: number,
            wY: number
        ) 
        {
            let val = UtilObjPool.Pop(B2DrawInfo._t, apply);
            val.b2w = b2w;
            val.cameraPixelPerSize = posScale;
            val.cameraX = wX;
            val.cameraY = wY;
            return val;
        }

        /**
         * 实际的物理世界
         */
        b2w: b2World;
        /**
         * 位置缩放
         */
        cameraPixelPerSize: number;
        /**
         * x 偏移
         */
        cameraX: number;
        /**
         * y 偏移
         */
        cameraY: number;
    }

    /**
     * 要绘制的物理世界列表
     */
    export const b2wList: Array<B2DrawInfo> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 调试内容组
     */
    export class DebugViewGroup {

        private constructor () {}

        private static _t = new UtilObjPoolType<DebugViewGroup>({
            instantiate: () => {
                return new DebugViewGroup();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `DebugViewGroup`
        });

        static Pop (
            apply: string,
            name: string,
            nodeType: UINodeType<UIViewComponent, DebugViewState, number>
        ) 
        {
            let val = UtilObjPool.Pop(DebugViewGroup._t, apply);
            val.name = name;
            val.nodeType = nodeType;
            return val;
        }

        /**
         * 迭代标识
         */
        static id: number = 0;
        /**
         * 当前标识
         */
        id = ++DebugViewGroup.id;
        /**
         * 该调试内容的名字
         */
        name: string;
        /**
         * 节点类型
         */
        nodeType: UINodeType<UIViewComponent, DebugViewState, number>;
    }

    /**
     * 模块列表
     */
     export const groupList: Array<DebugViewGroup> = [
        DebugViewGroup.Pop(
            APP,
            `快捷方式`,
            DebugViewGroupFast.nodeType
        ),
        DebugViewGroup.Pop(
            APP,
            `模块开关`,
            DebugViewGroupModule.nodeType
        ),
        DebugViewGroup.Pop(
            APP,
            `信息展示`,
            DebugViewGroupMessage.nodeType
        )
    ];

    /**
     * 开关信息
     */
    export const moduleList: Array<DebugViewDefine.ModuleInfo> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 开关信息
     */
    export class ModuleInfo {

        private constructor () {}

        private static _t = new UtilObjPoolType<ModuleInfo>({
            instantiate: () => {
                return new ModuleInfo();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `ModuleInfo`
        });

        static Pop (
            apply: string,
            name: string,
            dataItem: MgrDataItem<boolean>
        ) 
        {
            let val = UtilObjPool.Pop(ModuleInfo._t, apply);
            val.name = name;
            val.dataItem = dataItem;

            moduleList.push(val);
            return val;
        }

        /**
         * 名字
         */
        name: string;
        /**
         * 对应的存储单元
         */
        dataItem: MgrDataItem<boolean>;
    }

    /**
     * 快捷方式列表
     */
    export const fastGroupList: Array<DebugViewDefine.FastGroup> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 快捷方式信息
     */
    export class FastGroup {

        private constructor () {}

        private static _t = new UtilObjPoolType<FastGroup>({
            instantiate: () => {
                return new FastGroup();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `FastGroup`
        });

        static Pop (
            apply: string,
            name: string,
            act: (props: string) => void
        ) 
        {
            let val = UtilObjPool.Pop(FastGroup._t, apply);
            val._name = name;
            val._act = act;

            fastGroupList.push(val);
            return val;
        }

        /**
         * 名称
         */
        _name: string;
        /**
         * 具体行为
         */
        _act: (props: string) => void;
    }

    /**
     * 信息组列表
     */
    export const msgList: Array<DebugViewDefine.MsgGroup> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 日志信息
     */
    export class MsgGroup {

        private constructor () {}

        private static _t = new UtilObjPoolType<MsgGroup>({
            instantiate: () => {
                return new MsgGroup();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: `MsgGroup`
        });

        static Pop (
            apply: string,
            name: string,
            act: () => string
        ) 
        {
            let val = UtilObjPool.Pop(MsgGroup._t, apply);
            val._name = name;
            val._act = act;

            msgList.push(val);
            return val;
        }

        /**
         * 名称
         */
        _name: string;
        /**
         * 实现
         */
        _act: () => string;
    }
}


export default DebugViewDefine;