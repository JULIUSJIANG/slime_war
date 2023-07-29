import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import jiang from "../../../frame/global/Jiang";
import ViewState from "../../../frame/ui/ViewState";
import IndexDataModule from "../../../IndexDataModule";
import IndexLayer from "../../../IndexLayer";
import gameCommon from "../../GameCommon";

const APP = `TipsViewState`;

class TipsViewState extends ViewState {

    private constructor () {
        super (
            IndexLayer.SYSTEM,
            ViewState.BG_TYPE.NONE,
            false
        );
    }

    private static _t = new UtilObjPoolType<TipsViewState>({
        instantiate: () => {
            let val = new TipsViewState();
            TipsViewState.inst = val;
            return val;
        },
        onPop: (t) => {
            jiang.mgrEvter.evterUpdate.On((ms) => {
                // 如果当前没有数据，不为此刷新
                if (t.listRecord.length == 0) {
                    return;
                };
                // 时间步进
                for (let i = 0; i < t.listRecord.length;) {
                    let rec = t.listRecord[i];
                    rec.lessMS -= ms;
                    rec.lessMS = Math.max (rec.lessMS, 0);
                    if (rec.lessMS <= 0) {
                        t.listRecord.splice(i, 1);
                    }
                    else {
                        i++;
                    };
                };
                // 刷新界面
                jiang.mgrUI.ModuleRefresh(IndexDataModule.TIPSVIEW);
            });
        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        let val = UtilObjPool.Pop(TipsViewState._t, apply);
        return val;
    }

    /**
     * 列表 - 记录
     */
    listRecord: Array<TipsViewState.Record> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);

    /**
     * 标识生成器
     */
    idGen: number = 0;

    /**
     * 进行提示
     * @param txt 
     */
    Tip (txt: string) {
        if (0 < this.listRecord.length && this.listRecord[this.listRecord.length - 1].txt == txt) {
            this.listRecord[this.listRecord.length - 1].lessMS = gameCommon.TIPS_HOLD;
            return;
        };

        let val = TipsViewState.Record.Pop(APP);
        val.id = ++this.idGen;
        val.txt = txt;
        val.lessMS = gameCommon.TIPS_HOLD;
        this.listRecord.push(val);
        jiang.mgrUI.ModuleRefresh(IndexDataModule.TIPSVIEW);
    }
}

namespace TipsViewState {
    /**
     * 全局实例
     */
    export let inst: TipsViewState = null;

    export const APP = `Record`;

    /**
     * 内容的记录
     */
    export class Record {
        /**
         * 标识
         */
        id: number;
        /**
         * 要提示的文本
         */
        txt: string;
        /**
         * 剩余时间
         */
        lessMS: number;

        private constructor () {}

        private static _t = new UtilObjPoolType<Record>({
            instantiate: () => {
                return new Record();
            },
            onPop: (t) => {

            },
            onPush: (t) => {

            },
            tag: APP
        });

        static Pop (apply: string) {
            return UtilObjPool.Pop(Record._t, apply);
        }
    }
}

export default TipsViewState;