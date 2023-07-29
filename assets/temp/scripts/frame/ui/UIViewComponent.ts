import utilNode from "../basic/UtilNode";
import UtilObjPool from "../basic/UtilObjPool";
import ComponentNodeEventer from "../component/ComponentNodeEventer";
import PlayAnimationOnEnable from "../component/PlayAnimationOnEnable";
import PlayAudioOnEnable from "../component/PlayAudioOnEnable";

const {ccclass, property} = cc._decorator;

const APP = `UIViewComponent`;

/**
 * 窗口的根组件
 */
@ccclass
export default class UIViewComponent extends cc.Component {
    /**
     * 已显示的时间，该值永远不清除
     */
    _msDisplayed: number = 0;
    /**
     * 已显示的时间，该值在回收时候清除
     */
    _msDisplayedTemp: number = 0;

    /**
     * 节点事件派发器
     */
    _nodeEvterList: Array<ComponentNodeEventer>;

    /**
     * 动画播放
     */
    _animOnEnable: Array<PlayAnimationOnEnable>;

    /**
     * 音频播放
     */
    _audioOnEnable: Array<PlayAudioOnEnable>;

    /**
     * 颜色记录
     */
    _nodeToColorMap: Map<cc.Node, Array<number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    /**
     * 不透明度记录
     */
    _nodeToOpacityMap: Map<cc.Node, number> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);
    
    /**
     * 列表 - 动画组件
     */
    _listAnim: Array<cc.Animation>;
    /**
     * 列表 - 所有状态
     */
    _listState: Array<cc.AnimationState> = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
    /**
     * 字典 - 状态到速度的映射
     */
    _stateToSpeedMap: Map<cc.AnimationClip, number> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    Record(): void {
        this._nodeEvterList = this.node.getComponentsInChildren(ComponentNodeEventer);
        this._animOnEnable = this.node.getComponentsInChildren(PlayAnimationOnEnable);
        this._audioOnEnable = this.node.getComponentsInChildren(PlayAudioOnEnable);

        // 记录下所有节点颜色
        utilNode.WalkAllNode(this.node, (n) => {
            let color = UtilObjPool.Pop(UtilObjPool.typeArray, APP);
            color.push(n.color.r, n.color.g, n.color.b);
            this._nodeToColorMap.set(n, color);
            this._nodeToOpacityMap.set(n, n.opacity);
        });

        this._listAnim = this.node.getComponentsInChildren(cc.Animation);
        for (let i = 0; i < this._listAnim.length; i++) {
            let anim = this._listAnim[i];
            let clips = anim.getClips();
            for (let j = 0; j < clips.length; j++) {
                let clip = clips[j];
                this._stateToSpeedMap.set(clip, clip.speed);
            };
        };
    }

    /**
     * 设置层
     * @param group 
     */
    SetGroup (group: number) {
        this._nodeToColorMap.forEach((color, n) => {
            if (!n.isValid) {
                return;
            };
            n.groupIndex = group;
        });
    }

    /**
     * 置灰
     */
    BeGray (darkRate = 1) {
        this._nodeToColorMap.forEach((color, n) => {
            if (!n.isValid) {
                return;
            };
            let c = color[0] + color[1] + color[2];
            c /= 3;
            c *= darkRate;
            let col = UtilObjPool.PopCCColor(APP, c, c, c, color[3]);
            UtilObjPool.Push(n.color);
            n.color = col;
        });
    }

    /**
     * 置彩色
     */
    BeColorFul () {
        this._nodeToColorMap.forEach((color, n) => {
            if (!n.isValid) {
                return;
            };
            let col = UtilObjPool.PopCCColor(APP, color[0], color[1], color[2], color[3]);
            UtilObjPool.Push(n.color);
            n.color = col;
        });
    }

    /**
     * 设置动画的时间缩放
     * @param timeScale 
     */
    AnimTimeScale (timeScale: number) {
        for (let i = 0; i < this._listAnim.length; i++) {
            let anim = this._listAnim[i];
            let clips = anim.getClips();
            for (let j = 0; j < clips.length; j++) {
                let clip = clips[j];
                anim.getAnimationState(clip.name).speed = this._stateToSpeedMap.get(clip) * timeScale;
            };
        };
    }

    /**
     * 取消所有事件监听
     */
    OffAll () {
        this._nodeEvterList.forEach(( evter ) => {
            if (!evter.isValid) {
                return;
            };
            evter.OffAll();
        });
    }
} 