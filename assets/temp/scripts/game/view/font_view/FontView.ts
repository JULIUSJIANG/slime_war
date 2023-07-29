import IndexDataModule from "../../../IndexDataModule";
import BCType from "../../../frame/basic/BCType";
import UtilObjPool from "../../../frame/basic/UtilObjPool";
import jiang from "../../../frame/global/Jiang";
import UINodeInstEnterRS from "../../../frame/ui/UINodeInstEnterRS";
import UINodeInstHideRS from "../../../frame/ui/UINodeInstHideRS";
import UINodeType from "../../../frame/ui/UINodeType";
import UIViewComponent from "../../../frame/ui/UIViewComponent";
import gameCommon from "../../GameCommon";
import FontViewState from "./FontViewState";

const {ccclass, property} = cc._decorator;

const APP = `FontView`;

/**
 * 字体界面
 */
@ccclass
export default class FontView extends UIViewComponent {
    /**
     * 文本组件
     */
    @property ([cc.Label])
    listTxtFontC: cc.Label[] = [];

    static nodeType = UINodeType.Pop<FontView, FontViewState, number> (
        APP,
        {
            prefabPath: `${gameCommon.SUB_MAIN}/prefab_ui/font_view`,
            componentGetter: node => node.getComponent (FontView),
            listModuleStyle: [
                UINodeType.ModuleStyle.Pop<FontView, FontViewState, number> (
                    APP,
                    {
                        listRefModule: [
                            IndexDataModule.FONT,
                        ],
                        propsFilter: (com, state, props) => {
                            let listTxt: Array<string> = UtilObjPool.Pop (UtilObjPool.typeArray, APP);
                            listTxt.push (
                                `章节解锁KMBTAB:`
                            );
                            for (let i = 0; i <= 9; i++) {
                                listTxt.push (`${i}`);
                            };
                            for (let i = 0; i < jiang.mgrCfg.cfgScene._list.length; i++) {
                                let cfg = jiang.mgrCfg.cfgScene._list [i];
                                listTxt.push (cfg.name);
                            };
                            for (let i = 0; i < com.listTxtFontC.length; i++) {
                                com.listTxtFontC [i].string = listTxt.join (``);
                            };

                            setTimeout(() => {
                                com.node.active = false;
                            }, 0);
                        }
                    }
                )
            ],
            childrenCreator: [],
            propsType: BCType.typeNumber,
            hideRS: UINodeInstHideRS.setParentNull,
            enterRS: UINodeInstEnterRS.none
        }
    )
}