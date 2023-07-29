import UtilObjPool from "../../../frame/basic/UtilObjPool";
import UtilObjPoolType from "../../../frame/basic/UtilObjPoolType";
import UINode from "../../../frame/ui/UINode";
import GameCfgBodyCacheDropRS from "../../game_element/body/GameCfgBodyCacheDropRS";
import IndexViewState from "../index_view/IndexViewState";
import EquipmentView from "./EquipmentView";
import EquipmentViewDetailBackpackProp from "./EquipmentViewDetailBackpackProp";
import EquipmentViewSelectStatus from "./EquipmentViewSelectStatus";
import EquipmentViewState from "./EquipmentViewState";

const APP = `EquipmentViewSelectStatusBackpackProp`;

/**
 * 装备界面选择状态 - 浏览物品
 */
export default class EquipmentViewSelectStatusBackpackProp extends EquipmentViewSelectStatus {

    private constructor () {super();}

    private static _t = new UtilObjPoolType<EquipmentViewSelectStatusBackpackProp>({
        instantiate: () => {
            return new EquipmentViewSelectStatusBackpackProp();
        },
        onPop: (t) => {

        },
        onPush: (t) => {

        },
        tag: APP
    });

    static Pop (apply: string, relMachine: EquipmentViewState) {
        let val = UtilObjPool.Pop (EquipmentViewSelectStatusBackpackProp._t, apply);
        val.relMachine = relMachine;
        return val;
    }

    /**
     * 当前浏览内容的 id
     */
    idCurrRead: number;

    public OnBackpackProp(idCfg: number): void {
        this.idCurrRead = idCfg;
    }
    
    public OnEquipment(idCfg: number): void {
        this.relMachine.EnterStatus (this.relMachine.statusEquipment);
        this.relMachine.currStatus.OnEquipment (idCfg);
    }

    public OnIdxGlobal() {
        return this.relMachine.listShouldDisplayAll.findIndex ((val) => val.rs == GameCfgBodyCacheDropRS.xlsxBackpackProp && val.idCfg == this.idCurrRead);
    }

    public OnChildren(state: IndexViewState, listNode: UINode[]) {
        listNode.push (
            EquipmentViewDetailBackpackProp.nodeType.CreateNode (
                state,
                this.idCurrRead,
                this.idCurrRead
            )
        );
    }
}