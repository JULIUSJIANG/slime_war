import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import ViewState from "../../../frame/ui/ViewState";
import IndexDataModule from "../../../IndexDataModule";

const {ccclass, property} = cc._decorator;

const APP = `BookViewMonster`;

/**
 * 图鉴界面 - 怪物
 */
@ccclass
export default class BookViewMonster extends UIViewComponent {

    /**
     * 节点类型的实例缓存
     */
    static _map: Map<string, UINodeType<UIViewComponent, ViewState, number>> = UtilObjPool.Pop(UtilObjPool.typeMap, APP);

    /**
     * 获取资源
     * @param res 
     * @returns 
     */
    static GetNodeTypeByRes (res: string) {
        if (!BookViewMonster._map.has(res)) {
            BookViewMonster._map.set(res, UINodeType.Pop<UIViewComponent, ViewState, number> (
                APP,
                {
                    prefabPath: res,
                    componentGetter: node => node.getComponent(UIViewComponent),
                    listModuleStyle: [
                        UINodeType.ModuleStyle.Pop<UIViewComponent, ViewState, number>(
                            APP,
                            {
                                listRefModule: [
                                    IndexDataModule.DEFAULT,
                                    IndexDataModule.INDEXVIEW_CHALLENGE
                                ],
                                propsFilter: (com, state, props) => {
                                    com.node.x = 0;
                                    com.node.y = 0;
                                }
                            }
                        )
                    ],
                    childrenCreator: [],
                    propsType: BCType.typeNumber,
                    hideRS: UINodeInstHideRS.localScale0,
                    enterRS: UINodeInstEnterRS.opacityInForPrefab200
                },
            ));
        };
        return this._map.get(res);
    }
}