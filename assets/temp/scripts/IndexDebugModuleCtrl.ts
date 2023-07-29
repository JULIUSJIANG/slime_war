import indexDataStorageItem from "./IndexStorageItem";
import MgrDataItem from "./frame/data/MgrDataItem";
import MgrDataType from "./frame/data/MgrDataType";
import MgrDataItemMediaRS from "./frame/data/MgrDateItemMediaRS";
import DebugViewDefine from "./frame/debug/DebugViewDefine";

const APP = `indexCtrlModule`;
namespace indexDebugModuleCtrl {
    export const drawB2joint = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制关节`,
        MgrDataItem.Pop(
            APP,
            `drawB2joint_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const drawB2transform = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制变换`,
        MgrDataItem.Pop(
            APP,
            `drawB2transform_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const drawB2aabb = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制箱盒`,
        MgrDataItem.Pop(
            APP,
            `drawB2aabb_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const drawB2shape = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制形状`,
        MgrDataItem.Pop(
            APP,
            `drawB2shape_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const drawB2particle = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制粒子`,
        MgrDataItem.Pop(
            APP,
            `drawB2particle_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const drawB2controller = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制马达`,
        MgrDataItem.Pop(
            APP,
            `drawB2controller_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const drawB2contact = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `b2-绘制碰撞`,
        MgrDataItem.Pop(
            APP,
            `drawB2contact_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const logTree = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `打印节点树`,
        MgrDataItem.Pop(
            APP,
            `logVirturalTree_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const catchTouch = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `打印交互节点`,
        MgrDataItem.Pop(
            APP,
            `catchTouch_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
    export const logViewStatus = DebugViewDefine.ModuleInfo.Pop(
        APP,
        `打印界面状态`,
        MgrDataItem.Pop(
            APP,
            `logViewStatus_${indexDataStorageItem.version}`,
            MgrDataType.typeBool,
            () => false,
            MgrDataItemMediaRS.local
        )
    );
}

export default indexDebugModuleCtrl;