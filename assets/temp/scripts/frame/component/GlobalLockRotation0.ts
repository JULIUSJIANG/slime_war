const {ccclass, property} = cc._decorator;

/**
 * 始终全局锁定旋转角
 */
@ccclass
export default class LockRotation0 extends cc.Component {

    protected update(): void {
        let node = this.node.parent;
        let angle = 0;
        while (node != null) {
            angle += node.angle;
            node = node.parent;
        };
        this.node.angle = -angle;
    }
}