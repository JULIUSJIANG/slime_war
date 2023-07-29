import IndexDataModule from "./IndexDataModule";
import indexDataStorageItem from "./IndexStorageItem";
import DebugViewDefine from "./frame/debug/DebugViewDefine";
import DebugViewState from "./frame/debug/DebugViewState";
import jiang from "./frame/global/Jiang";
import gameCommon from "./game/GameCommon";
import gameMath from "./game/GameMath";
import FlashView from "./game/view/flash_view/FlashView";
import FlashViewState from "./game/view/flash_view/FlashViewState";
import TipsViewState from "./game/view/tips_view/TipsViewState";

const APP = `indexDebugModuleFast`;

namespace indexDebugModuleFast {
    export const btnEnterOpacity0 = DebugViewDefine.FastGroup.Pop (
        APP,
        `隐藏入口`,
        (props) => {
            DebugViewState.inst.SetBtnEnterOpacity (0);
            TipsViewState.inst.Tip (`已生效`);
        }
    );
    export const flash = DebugViewDefine.FastGroup.Pop (
        APP,
        `闪屏`,
        (props) => {
            jiang.mgrUI.Open (
                FlashView.nodeType,
                FlashViewState.Pop (APP)
            );
        }
    );
    export const resetStoraged = DebugViewDefine.FastGroup.Pop (
        APP,
        `重置存档`,
        (props) => {
            let storageKey = jiang.mgrData.Get (indexDataStorageItem.storageKey);
            jiang.mgrData._moduleSet.forEach ((val) => {
                jiang.mgrData.Set (val, val.defVal());
            });
            jiang.mgrData.Set (indexDataStorageItem.storageKey, storageKey);
            TipsViewState.inst.Tip (`已重置，重启后生效`);
        }
    );
    export const equipLvSet = DebugViewDefine.FastGroup.Pop (
        APP,
        `设置武器等级`,
        (props) => {
            let lev = Number.parseFloat (props);
            if (Number.isNaN (lev)) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            let listEquip = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
            for (let i = 0; i < listEquip.length; i++) {
                let recEquip = listEquip [i];
                let power = gameMath.ParseLevToPower (lev);
                recEquip.count = gameMath.equip.ParsePowerToCount (power);
                recEquip.count = Math.ceil (recEquip.count);
                jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
            };
            indexDataStorageItem.listEquipment.media.onSet ();
            TipsViewState.inst.Tip (`已生效`);
        }
    );
    export const challengeLevSet = DebugViewDefine.FastGroup.Pop (
        APP,
        `设置关卡`,
        (props) => {
            let num = Number.parseInt (props);
            if (Number.isNaN (num)) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            jiang.mgrData.Set (indexDataStorageItem.challengeLev, num);
            TipsViewState.inst.Tip (`已生效`);
        }
    );
    export const setGoldMax = DebugViewDefine.FastGroup.Pop (
        APP,
        `挂机奖励最大`,
        (props) => {
            jiang.mgrData.Set (indexDataStorageItem.goldLastDate, jiang.mgrDateNow.DateNow() - gameMath.GOLD_MS_MAX);
            TipsViewState.inst.Tip (`已生效`);
        }
    );
    export const chapterBoss = DebugViewDefine.FastGroup.Pop (
        APP,
        `挑战章节 boss 关`,
        (props) => {
            let chapter = Number.parseFloat (props);
            if (Number.isNaN (chapter)) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            let idLevel: number;
            for (let i = 0; i < jiang.mgrCfg.cfgLevel._list.length; i++) {
                let cfg = jiang.mgrCfg.cfgLevel._list [i];
                if (cfg.relChapter != chapter) {
                    continue;
                };
                idLevel = cfg.id;
            };
            if (idLevel == null) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            jiang.mgrData.Set (indexDataStorageItem.challengeLev, idLevel);
            TipsViewState.inst.Tip (`已生效`);
        }
    );
    export const chapterLast = DebugViewDefine.FastGroup.Pop (
        APP,
        `挑战章节最终关`,
        (props) => {
            let chapter = Number.parseFloat (props);
            if (Number.isNaN (chapter)) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            let idLevel: number;
            for (let i = 0; i < jiang.mgrCfg.cfgLevel._list.length; i++) {
                let cfg = jiang.mgrCfg.cfgLevel._list [i];
                if (cfg.relChapter != chapter) {
                    continue;
                };
                idLevel = cfg.id;
            };
            if (idLevel == null) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            jiang.mgrData.Set (indexDataStorageItem.challengeLev, idLevel - 1);
            TipsViewState.inst.Tip (`已生效`);
        }
    );
    export const chapterLev = DebugViewDefine.FastGroup.Pop (
        APP,
        `武器吸收章节强度`,
        (props) => {
            let chapter = Number.parseFloat (props);
            if (Number.isNaN (chapter)) {
                TipsViewState.inst.Tip (`参数非法`);
                return;
            };
            // 章节强度比率
            let chapterRate = 1.5 ** chapter;
            // 武器 1 级强度
            let equipLev1Power = gameMath.ParseLevToPower (1);
            // 如果赶上强度
            let chapterPower = equipLev1Power * chapterRate;
            // 武器的数量
            let chapterPowerEquipCount = gameMath.equip.ParsePowerToCount (chapterPower);

            let listEquip = jiang.mgrData.Get (indexDataStorageItem.listEquipment);
            for (let i = 0; i < listEquip.length; i++) {
                let recEquip = listEquip [i];
                recEquip.count = chapterPowerEquipCount;
                recEquip.count = Math.ceil (recEquip.count);
                jiang.mgrUI.ModuleRefresh (IndexDataModule.INDEXVIEW_EQUIP);
            };
            indexDataStorageItem.listEquipment.media.onSet ();
            TipsViewState.inst.Tip (`已生效`);
        }
    );
}

export default indexDebugModuleFast;