
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgStore`;

export default class CfgStore {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgStore> ({
		instantiate: () => {
			return new CfgStore();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgStore._t, apply);
		t.id = data[0];
		t.item_type = data[1];
		t.item_id = data[2];
		t.unlock_logic = data[3];
		t.unlock_val_0 = data[4];
		t.unlock_val_1 = data[5];
		return t;
	}


	/**
	 * 标识
	 */
	id: number;

	/**
	 * 商品类型
	 */
	item_type: number;

	/**
	 * 商品
	 */
	item_id: number;

	/**
	 * 解锁逻辑
	 */
	unlock_logic: number;

	/**
	 * 解锁参数0
	 */
	unlock_val_0: number;

	/**
	 * 解锁参数1
	 */
	unlock_val_1: number;


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgStore): number {
		return cfgItem.id;
	}

	/**
	 * 获取商品类型
	 * @param cfgItem 
	 */
	public static item_typeGetter (cfgItem: CfgStore): number {
		return cfgItem.item_type;
	}

	/**
	 * 获取商品
	 * @param cfgItem 
	 */
	public static item_idGetter (cfgItem: CfgStore): number {
		return cfgItem.item_id;
	}

	/**
	 * 获取解锁逻辑
	 * @param cfgItem 
	 */
	public static unlock_logicGetter (cfgItem: CfgStore): number {
		return cfgItem.unlock_logic;
	}

	/**
	 * 获取解锁参数0
	 * @param cfgItem 
	 */
	public static unlock_val_0Getter (cfgItem: CfgStore): number {
		return cfgItem.unlock_val_0;
	}

	/**
	 * 获取解锁参数1
	 * @param cfgItem 
	 */
	public static unlock_val_1Getter (cfgItem: CfgStore): number {
		return cfgItem.unlock_val_1;
	}
}