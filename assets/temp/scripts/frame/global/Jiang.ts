import MgrCfg from '../config/MgrCfg';
import MgrData from '../data/MgrData';
import MgrDateNow from '../date/MgrDateNow';
import MgrEvter from '../evter/MgrEvter';
import MgrRes from "../res/MgrRes";
import MgrSdk from '../sdk/MgrSdk';
import MgrUI from '../ui/MgrUI';


namespace jiang {
    /**
     * 资源管理器
     */
    export const mgrRes = MgrRes.inst;

    /**
     * 视图管理器
     */
    export const mgrUI = MgrUI.inst;

    /**
     * 配置管理器
     */
    export const mgrCfg = MgrCfg.inst;

    /**
     * 数据管理器
     */
    export const mgrData = MgrData.inst;

    /**
     * 事件管理器
     */
    export const mgrEvter = MgrEvter.inst;

    /**
     * sdk 管理器
     */
    export const mgrSdk = MgrSdk.inst;

    /**
     * 时间戳管理器
     */
    export const mgrDateNow = MgrDateNow.inst;
}

window["jiang"] = jiang;
export default jiang;
declare const window: any;