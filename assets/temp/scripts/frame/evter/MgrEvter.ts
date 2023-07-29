import BCEventer from "../basic/BCEventer";
import UtilObjPool from "../basic/UtilObjPool";
import UtilObjPoolType from "../basic/UtilObjPoolType";
import MgrUI from "../ui/MgrUI";

const APP = `MgrEvter`;

/**
 * 事件管理器
 */
class MgrEvter {

    private constructor () {
        let setNumber: Set<cc.macro.KEY> = UtilObjPool.Pop(UtilObjPool.typeSet, APP) as Set<cc.macro.KEY>;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (args: cc.Event.EventKeyboard) => {
            if (setNumber.has(args.keyCode)) {
                return;
            };
            setNumber.add(args.keyCode);
            this.evterKeyDown.Call(args.keyCode);
        });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (args: cc.Event.EventKeyboard) => {
            setNumber.delete(args.keyCode);
            this.evterKeyUp.Call(args.keyCode);
        });
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.evterHide.Call(null);
        });
        cc.game.on(cc.game.EVENT_SHOW, () => {
            this.evterShow.Call(null);
        });
        let msSum = 0;
        let second = 0;
        this.evterUpdate.On ((ms) => {
            msSum += ms;
            let secondCurrent = Math.floor (msSum / 1000);
            if (second != secondCurrent) {
                second = secondCurrent;
                this.evterSecondUpdate.Call (null);
            };
        });
    }

    private static _t = new UtilObjPoolType<MgrEvter>({
        instantiate: () => {
            return new MgrEvter();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string) {
        return UtilObjPool.Pop(MgrEvter._t, apply);
    }

    static inst = MgrEvter.Pop(APP);
    /**
     * 画面刷新
     */
    evterUpdate = BCEventer.Pop<number>(APP);
    /**
     * 按钮-按下
     */
    evterKeyDown = BCEventer.Pop<cc.macro.KEY>(APP);
     /**
      * 按钮-抬起
      */
    evterKeyUp = BCEventer.Pop<cc.macro.KEY>(APP);
    /**
     * 事件派发-隐藏
     */
    evterHide = BCEventer.Pop(APP);
    /**
     * 事件派发-显示
     */
    evterShow = BCEventer.Pop(APP);
    /**
     * 秒刷新
     */
    evterSecondUpdate = BCEventer.Pop(APP);
}

export default MgrEvter;