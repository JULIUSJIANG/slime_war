
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgCommon`;

export default class CfgCommon {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgCommon> ({
		instantiate: () => {
			return new CfgCommon();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgCommon._t, apply);
		t.monster_power_to_drop = data[0];
		t.inc_for_level = data[1];
		t.inc_for_chapter = data[2];
		t.coin_count_to_power = data[3];
		t.equip_count_to_power = data[4];
		t.standard_chapter_power_sum = data[5];
		return t;
	}


	/**
	 * 怪物强度掉落转化
	 */
	monster_power_to_drop: number;

	/**
	 * 分级底数
	 */
	inc_for_level: number;

	/**
	 * 章节强度提升底数
	 */
	inc_for_chapter: number;

	/**
	 * 金币数量到强度的转化
	 */
	coin_count_to_power: number;

	/**
	 * 装备数量到强度的转化
	 */
	equip_count_to_power: number;

	/**
	 * 章节标准强度和
	 */
	standard_chapter_power_sum: number;


	/**
	 * 获取怪物强度掉落转化
	 * @param cfgItem 
	 */
	public static monster_power_to_dropGetter (cfgItem: CfgCommon): number {
		return cfgItem.monster_power_to_drop;
	}

	/**
	 * 获取分级底数
	 * @param cfgItem 
	 */
	public static inc_for_levelGetter (cfgItem: CfgCommon): number {
		return cfgItem.inc_for_level;
	}

	/**
	 * 获取章节强度提升底数
	 * @param cfgItem 
	 */
	public static inc_for_chapterGetter (cfgItem: CfgCommon): number {
		return cfgItem.inc_for_chapter;
	}

	/**
	 * 获取金币数量到强度的转化
	 * @param cfgItem 
	 */
	public static coin_count_to_powerGetter (cfgItem: CfgCommon): number {
		return cfgItem.coin_count_to_power;
	}

	/**
	 * 获取装备数量到强度的转化
	 * @param cfgItem 
	 */
	public static equip_count_to_powerGetter (cfgItem: CfgCommon): number {
		return cfgItem.equip_count_to_power;
	}

	/**
	 * 获取章节标准强度和
	 * @param cfgItem 
	 */
	public static standard_chapter_power_sumGetter (cfgItem: CfgCommon): number {
		return cfgItem.standard_chapter_power_sum;
	}
}