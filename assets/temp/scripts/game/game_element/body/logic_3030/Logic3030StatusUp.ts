import Logic3030Status from "./Logic3030Status";

/**
 * 震荡弹 - 状态 - 上升中
 */
export default class Logic3030StatusUp extends Logic3030Status {

    public OnDown(): void {
        this.relMachine.EnterStatus (this.relMachine.statusDown);
    }
}