import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrSdk from "../sdk/MgrSdk";
import UINodePrefabRecord from "./UINodePrefabRecord";
import UIViewComponent from "./UIViewComponent";

const APP = `UINodeInstEnterRS`;

/**
 * ui 实例入场方式
 */
class UINodeInstEnterRS {

    private constructor () {}

    private static _t = new UtilObjPoolType<UINodeInstEnterRS>({
        instantiate: () => {
            return new UINodeInstEnterRS ();
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
            update: (prefabMsg: UINodePrefabRecord, com: UIViewComponent, idx: number) => void
        }
    )
    {
        let val = UtilObjPool.Pop (UINodeInstEnterRS._t, apply);
        val._update = args.update;
        return val;
    }

    /**
     * 具体的刷新逻辑
     */
    _update: (prefabMsg: UINodePrefabRecord, com: UIViewComponent, idx: number) => void;

    /**
     * 刷新
     * @param com 
     */
    Update (prefabMsg: UINodePrefabRecord, com: UIViewComponent, idx: number) {
        this._update (prefabMsg, com, idx);
    }
}

namespace UINodeInstEnterRS {
    /**
     * 不控制
     */
    export const none = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (com) => {

            }
        }
    );

    export const opacityInForPrefab200 = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (prefabMsg, com) => {
                let opacity = prefabMsg.msDisplayed / 200 * 255;
                opacity = Math.min (opacity, 255);
                if (com.node.opacity == opacity) {
                    return;
                };
                com.node.opacity = opacity;
            }
        }
    );

    export const opacityInForTemp200 = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (prefabMsg, com) => {
                let opacity = com._msDisplayedTemp / 200 * 255;
                opacity = Math.min (opacity, 255);
                if (com.node.opacity == opacity) {
                    return;
                };
                com.node.opacity = opacity;
            }
        }
    );

    export const opacityInForTemp600 = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (prefabMsg, com) => {
                let opacity = com._msDisplayedTemp / 600 * 255;
                opacity = Math.min (opacity, 255);
                if (com.node.opacity == opacity) {
                    return;
                };
                com.node.opacity = opacity;
            }
        }
    );

    export const opacityInForIdx16A200 = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (prefabMsg, com, idx) => {
                let msUnit = 16;
                let msAnim = 200;
                let msMin = idx * msUnit;
                let ms = com._msDisplayedTemp;
                let opacity = (ms - msMin) / msAnim * 255;
                opacity = Math.min (opacity, 255);
                opacity = Math.max (opacity, 0);
                if (com.node.opacity == opacity) {
                    return;
                };
                com.node.opacity = opacity;
            }
        }
    );

    export const scaleInForPrefab200 = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (prefabMsg, com) => {
                let scale = prefabMsg.msDisplayed / 200;
                scale = Math.min (scale, 1);
                if (com.node.scale == scale) {
                    return;
                };
                com.node.scale = scale;
            }
        }
    );
    
    export const scaleInForTemp200 = UINodeInstEnterRS.Pop (
        APP,
        {
            update: (prefabMsg, com) => {
                let scale = com._msDisplayedTemp / 200;
                scale = Math.min (scale, 1);
                if (com.node.scale == scale) {
                    return;
                };
                com.node.scale = scale;
            }
        }
    );
};

export default UINodeInstEnterRS;