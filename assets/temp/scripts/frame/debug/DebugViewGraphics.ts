import BCType from "../basic/BCType";
import B2ElementRS from "../extend/b2_extend/B2ElementRS";
import GraphicsDrawer from "../extend/graphics_drawer/GraphicsDrawer";
import indexDebugModuleCtrl from "../../IndexDebugModuleCtrl";
import IndexDataModule from "../../IndexDataModule";
import UINodeType from "../ui/UINodeType";
import UIViewComponent from "../ui/UIViewComponent";
import DebugViewDefine from "./DebugViewDefine";
import DebugViewState from "./DebugViewState";
import jiang from "../global/Jiang";
import UINodeInstHideRS from "../ui/UINodeInstHideRS";
import UINodeInstEnterRS from "../ui/UINodeInstEnterRS";
const {ccclass, property} = cc._decorator;

const APP = `DebugViewGraphics`;

/**
 * 画板
 */
@ccclass
export default class DebugViewGraphics extends UIViewComponent {
    /**
     * 画笔
     */
    @property(cc.Graphics)
    graphics: cc.Graphics = null;
 
    /**
     * 画笔绘制器
     */
    graphicsDrawer: GraphicsDrawer;
 
    protected onLoad(): void {
        this.graphicsDrawer = GraphicsDrawer.Pop(APP, this.graphics);
    }

    /**
     * 节点类型
     */
    static nodeType: UINodeType<DebugViewGraphics, DebugViewState, number>= UINodeType.Pop<DebugViewGraphics, DebugViewState, number>(
        APP,
        {
            prefabPath: `DebugViewGraphics`,
            componentGetter: node => node.getComponent(DebugViewGraphics),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<DebugViewGraphics, DebugViewState, number>(
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.DEFAULT,
                            IndexDataModule.DEBUG_VIEW
                        ],
                        propsFilter: (com, state, props) => {
                            com.graphics.clear();
                            let drawTag = 0;
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2joint)) {
                                drawTag += B2ElementRS.joint.drawAbleTag;
                            };
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2transform)) {
                                drawTag += B2ElementRS.bodyTransform.drawAbleTag;
                            };
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2aabb)) {
                                drawTag += B2ElementRS.aabb.drawAbleTag;
                            };
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2shape)) {
                                drawTag += B2ElementRS.shape.drawAbleTag;
                            };
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2particle)) {
                                drawTag += B2ElementRS.particle.drawAbleTag;
                            };
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2controller)) {
                                drawTag += B2ElementRS.controller.drawAbleTag;
                            };
                            if (DebugViewState.CheckModuleActive(indexDebugModuleCtrl.drawB2contact)) {
                                drawTag += B2ElementRS.contact.drawAbleTag;
                            };
                            // 正式进行绘制
                            DebugViewDefine.b2wList.forEach(( info, index ) => {
                                com.graphicsDrawer.SetTransform(
                                    info.cameraPixelPerSize,
                                    info.cameraX,
                                    info.cameraY
                                );
                                B2ElementRS.eleDrawFuncList.forEach((func) => {
                                    func(
                                        info.b2w,
                                        com.graphicsDrawer,
                                        drawTag
                                    );
                                });
                            });
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    );
}