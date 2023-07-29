
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgChapter`;

export default class CfgChapter {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgChapter> ({
		instantiate: () => {
			return new CfgChapter();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgChapter._t, apply);
		t.id = data[0];
		t.list_equip_unlock = data[1];
		t.bg_left = data[2];
		t.bg_right = data[3];
		return t;
	}


	/**
	 * 标识
	 */
	id: number;

	/**
	 * 解锁的武器集合
	 */
	list_equip_unlock: number[];

	/**
	 * 挑战界面分块 - 左
	 */
	bg_left: string;

	/**
	 * 挑战界面分块 - 右
	 */
	bg_right: string;


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgChapter): number {
		return cfgItem.id;
	}

	/**
	 * 获取解锁的武器集合
	 * @param cfgItem 
	 */
	public static list_equip_unlockGetter (cfgItem: CfgChapter): number[] {
		return cfgItem.list_equip_unlock;
	}

	/**
	 * 获取挑战界面分块 - 左
	 * @param cfgItem 
	 */
	public static bg_leftGetter (cfgItem: CfgChapter): string {
		return cfgItem.bg_left;
	}

	/**
	 * 获取挑战界面分块 - 右
	 * @param cfgItem 
	 */
	public static bg_rightGetter (cfgItem: CfgChapter): string {
		return cfgItem.bg_right;
	}
}