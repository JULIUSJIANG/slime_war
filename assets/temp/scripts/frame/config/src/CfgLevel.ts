
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgLevel`;

export default class CfgLevel {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgLevel> ({
		instantiate: () => {
			return new CfgLevel();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgLevel._t, apply);
		t.id = data[0];
		t.relChapter = data[1];
		t.idx = data[2];
		t.theme = data[3];
		t.part_0_triger_ms = data[4];
		t.part_0_monster_id = data[5];
		t.part_0_monster_delay = data[6];
		t.part_0_monster_x = data[7];
		t.part_1_triger_ms = data[8];
		t.part_1_monster_id = data[9];
		t.part_1_monster_delay = data[10];
		t.part_1_monster_x = data[11];
		t.part_2_triger_ms = data[12];
		t.part_2_monster_id = data[13];
		t.part_2_monster_delay = data[14];
		t.part_2_monster_x = data[15];
		return t;
	}


	/**
	 * 标识
	 */
	id: number;

	/**
	 * 归属章节
	 */
	relChapter: number;

	/**
	 * 索引
	 */
	idx: number;

	/**
	 * 主题
	 */
	theme: number;

	/**
	 * 波次 0 时间点
	 */
	part_0_triger_ms: number;

	/**
	 * 波次 0 单位 id
	 */
	part_0_monster_id: number[];

	/**
	 * 波次 0 单位延时
	 */
	part_0_monster_delay: number[];

	/**
	 * 波次 0 单位坐标
	 */
	part_0_monster_x: number[];

	/**
	 * 波次 1 时间点
	 */
	part_1_triger_ms: number;

	/**
	 * 波次 1 单位 id
	 */
	part_1_monster_id: number[];

	/**
	 * 波次 1 单位延时
	 */
	part_1_monster_delay: number[];

	/**
	 * 波次 1 单位坐标
	 */
	part_1_monster_x: number[];

	/**
	 * 波次 2 时间点
	 */
	part_2_triger_ms: number;

	/**
	 * 波次 2 单位 id
	 */
	part_2_monster_id: number[];

	/**
	 * 波次 2 单位延时
	 */
	part_2_monster_delay: number[];

	/**
	 * 波次 2 单位坐标
	 */
	part_2_monster_x: number[];


	/**
	 * 获取标识
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgLevel): number {
		return cfgItem.id;
	}

	/**
	 * 获取归属章节
	 * @param cfgItem 
	 */
	public static relChapterGetter (cfgItem: CfgLevel): number {
		return cfgItem.relChapter;
	}

	/**
	 * 获取索引
	 * @param cfgItem 
	 */
	public static idxGetter (cfgItem: CfgLevel): number {
		return cfgItem.idx;
	}

	/**
	 * 获取主题
	 * @param cfgItem 
	 */
	public static themeGetter (cfgItem: CfgLevel): number {
		return cfgItem.theme;
	}

	/**
	 * 获取波次 0 时间点
	 * @param cfgItem 
	 */
	public static part_0_triger_msGetter (cfgItem: CfgLevel): number {
		return cfgItem.part_0_triger_ms;
	}

	/**
	 * 获取波次 0 单位 id
	 * @param cfgItem 
	 */
	public static part_0_monster_idGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_0_monster_id;
	}

	/**
	 * 获取波次 0 单位延时
	 * @param cfgItem 
	 */
	public static part_0_monster_delayGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_0_monster_delay;
	}

	/**
	 * 获取波次 0 单位坐标
	 * @param cfgItem 
	 */
	public static part_0_monster_xGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_0_monster_x;
	}

	/**
	 * 获取波次 1 时间点
	 * @param cfgItem 
	 */
	public static part_1_triger_msGetter (cfgItem: CfgLevel): number {
		return cfgItem.part_1_triger_ms;
	}

	/**
	 * 获取波次 1 单位 id
	 * @param cfgItem 
	 */
	public static part_1_monster_idGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_1_monster_id;
	}

	/**
	 * 获取波次 1 单位延时
	 * @param cfgItem 
	 */
	public static part_1_monster_delayGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_1_monster_delay;
	}

	/**
	 * 获取波次 1 单位坐标
	 * @param cfgItem 
	 */
	public static part_1_monster_xGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_1_monster_x;
	}

	/**
	 * 获取波次 2 时间点
	 * @param cfgItem 
	 */
	public static part_2_triger_msGetter (cfgItem: CfgLevel): number {
		return cfgItem.part_2_triger_ms;
	}

	/**
	 * 获取波次 2 单位 id
	 * @param cfgItem 
	 */
	public static part_2_monster_idGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_2_monster_id;
	}

	/**
	 * 获取波次 2 单位延时
	 * @param cfgItem 
	 */
	public static part_2_monster_delayGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_2_monster_delay;
	}

	/**
	 * 获取波次 2 单位坐标
	 * @param cfgItem 
	 */
	public static part_2_monster_xGetter (cfgItem: CfgLevel): number[] {
		return cfgItem.part_2_monster_x;
	}
}