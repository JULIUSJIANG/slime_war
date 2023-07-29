
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgGameElement`;

export default class CfgGameElement {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgGameElement> ({
		instantiate: () => {
			return new CfgGameElement();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgGameElement._t, apply);
		t.id = data[0];
		t.name = data[1];
		t.txt_info = data[2];
		t.color_main = data[3];
		t.size_mark = data[4];
		t.is_boss = data[5];
		t.style_code = data[6];
		t.gravity_scale = data[7];
		t.book = data[8];
		t.drop_0_type = data[9];
		t.drop_0_val = data[10];
		t.drop_1_type = data[11];
		t.drop_1_val = data[12];
		t.props_influence_count = data[13];
		t.props_repel = data[14];
		t.res_scene = data[15];
		t.res_ui = data[16];
		t.power = data[17];
		t.logic = data[18];
		t.prop_0 = data[19];
		t.lv_inc_0 = data[20];
		t.prop_1 = data[21];
		t.lv_inc_1 = data[22];
		t.prop_2 = data[23];
		t.lv_inc_2 = data[24];
		t.prop_3 = data[25];
		t.lv_inc_3 = data[26];
		t.prop_4 = data[27];
		t.lv_inc_4 = data[28];
		t.prop_5 = data[29];
		t.lv_inc_5 = data[30];
		t.prop_6 = data[31];
		t.lv_inc_6 = data[32];
		t.prop_7 = data[33];
		t.lv_inc_7 = data[34];
		t.prop_8 = data[35];
		t.lv_inc_8 = data[36];
		t.prop_9 = data[37];
		t.lv_inc_9 = data[38];
		t.prop_10 = data[39];
		t.lv_inc_10 = data[40];
		t.prop_11 = data[41];
		t.lv_inc_11 = data[42];
		t.prop_12 = data[43];
		t.lv_inc_12 = data[44];
		t.prop_13 = data[45];
		t.lv_inc_13 = data[46];
		t.prop_14 = data[47];
		t.lv_inc_14 = data[48];
		t.prop_15 = data[49];
		t.lv_inc_15 = data[50];
		t.prop_16 = data[51];
		t.lv_inc_16 = data[52];
		t.prop_17 = data[53];
		t.lv_inc_17 = data[54];
		t.prop_18 = data[55];
		t.lv_inc_18 = data[56];
		t.prop_19 = data[57];
		t.lv_inc_19 = data[58];
		t.prop_20 = data[59];
		t.lv_inc_20 = data[60];
		t.prop_21 = data[61];
		t.lv_inc_21 = data[62];
		t.prop_22 = data[63];
		t.lv_inc_22 = data[64];
		t.prop_23 = data[65];
		t.lv_inc_23 = data[66];
		t.prop_24 = data[67];
		t.lv_inc_24 = data[68];
		t.prop_25 = data[69];
		t.lv_inc_25 = data[70];
		t.prop_26 = data[71];
		t.lv_inc_26 = data[72];
		t.prop_27 = data[73];
		t.lv_inc_27 = data[74];
		t.prop_28 = data[75];
		t.lv_inc_28 = data[76];
		t.prop_29 = data[77];
		t.lv_inc_29 = data[78];
		t.prop_30 = data[79];
		t.lv_inc_30 = data[80];
		t.prop_31 = data[81];
		t.lv_inc_31 = data[82];
		return t;
	}


	/**
	 * 【0】我方"1"/敌方"2"【1】单位"1"/技能"2"【2】类id【3】实例id
	 */
	id: number;

	/**
	 * undefined
	 */
	name: string;

	/**
	 * 情报
	 */
	txt_info: string;

	/**
	 * 主颜色
	 */
	color_main: string;

	/**
	 * 尺寸
	 */
	size_mark: number;

	/**
	 * 标记为boss
	 */
	is_boss: number;

	/**
	 * 样式代码
	 */
	style_code: number;

	/**
	 * 重力缩放
	 */
	gravity_scale: number;

	/**
	 * 图鉴可见
	 */
	book: number;

	/**
	 * 掉落物0-类型
	 */
	drop_0_type: number;

	/**
	 * 掉落物0-参数
	 */
	drop_0_val: number;

	/**
	 * 掉落物1-类型
	 */
	drop_1_type: number;

	/**
	 * 掉落物1-参数
	 */
	drop_1_val: number;

	/**
	 * 伤害/治疗的基础量
	 */
	props_influence_count: number;

	/**
	 * 击退的基础量
	 */
	props_repel: number;

	/**
	 * 场景资源路径
	 */
	res_scene: string;

	/**
	 * ui资源路径
	 */
	res_ui: string;

	/**
	 * undefined
	 */
	power: number;

	/**
	 * 逻辑
	 */
	logic: number;

	/**
	 * 参数0
	 */
	prop_0: string;

	/**
	 * undefined
	 */
	lv_inc_0: string;

	/**
	 * 参数1
	 */
	prop_1: string;

	/**
	 * undefined
	 */
	lv_inc_1: string;

	/**
	 * 参数2
	 */
	prop_2: string;

	/**
	 * undefined
	 */
	lv_inc_2: string;

	/**
	 * 参数3
	 */
	prop_3: string;

	/**
	 * undefined
	 */
	lv_inc_3: string;

	/**
	 * 参数4
	 */
	prop_4: string;

	/**
	 * undefined
	 */
	lv_inc_4: string;

	/**
	 * 参数5
	 */
	prop_5: string;

	/**
	 * undefined
	 */
	lv_inc_5: string;

	/**
	 * 参数6
	 */
	prop_6: string;

	/**
	 * undefined
	 */
	lv_inc_6: string;

	/**
	 * 参数7
	 */
	prop_7: string;

	/**
	 * undefined
	 */
	lv_inc_7: string;

	/**
	 * 参数8
	 */
	prop_8: string;

	/**
	 * undefined
	 */
	lv_inc_8: string;

	/**
	 * 参数9
	 */
	prop_9: string;

	/**
	 * undefined
	 */
	lv_inc_9: string;

	/**
	 * 参数10
	 */
	prop_10: string;

	/**
	 * undefined
	 */
	lv_inc_10: string;

	/**
	 * 参数11
	 */
	prop_11: string;

	/**
	 * undefined
	 */
	lv_inc_11: string;

	/**
	 * 参数12
	 */
	prop_12: string;

	/**
	 * undefined
	 */
	lv_inc_12: string;

	/**
	 * 参数13
	 */
	prop_13: string;

	/**
	 * undefined
	 */
	lv_inc_13: string;

	/**
	 * 参数14
	 */
	prop_14: string;

	/**
	 * undefined
	 */
	lv_inc_14: string;

	/**
	 * 参数15
	 */
	prop_15: string;

	/**
	 * undefined
	 */
	lv_inc_15: string;

	/**
	 * 参数16
	 */
	prop_16: string;

	/**
	 * undefined
	 */
	lv_inc_16: string;

	/**
	 * 参数17
	 */
	prop_17: string;

	/**
	 * undefined
	 */
	lv_inc_17: string;

	/**
	 * 参数18
	 */
	prop_18: string;

	/**
	 * undefined
	 */
	lv_inc_18: string;

	/**
	 * 参数19
	 */
	prop_19: string;

	/**
	 * undefined
	 */
	lv_inc_19: string;

	/**
	 * 参数20
	 */
	prop_20: string;

	/**
	 * undefined
	 */
	lv_inc_20: string;

	/**
	 * 参数21
	 */
	prop_21: string;

	/**
	 * undefined
	 */
	lv_inc_21: string;

	/**
	 * 参数22
	 */
	prop_22: string;

	/**
	 * undefined
	 */
	lv_inc_22: string;

	/**
	 * 参数23
	 */
	prop_23: string;

	/**
	 * undefined
	 */
	lv_inc_23: string;

	/**
	 * 参数24
	 */
	prop_24: string;

	/**
	 * undefined
	 */
	lv_inc_24: string;

	/**
	 * 参数25
	 */
	prop_25: string;

	/**
	 * undefined
	 */
	lv_inc_25: string;

	/**
	 * 参数26
	 */
	prop_26: string;

	/**
	 * undefined
	 */
	lv_inc_26: string;

	/**
	 * 参数27
	 */
	prop_27: string;

	/**
	 * undefined
	 */
	lv_inc_27: string;

	/**
	 * 参数28
	 */
	prop_28: string;

	/**
	 * undefined
	 */
	lv_inc_28: string;

	/**
	 * 参数29
	 */
	prop_29: string;

	/**
	 * undefined
	 */
	lv_inc_29: string;

	/**
	 * 参数30
	 */
	prop_30: string;

	/**
	 * undefined
	 */
	lv_inc_30: string;

	/**
	 * 参数31
	 */
	prop_31: string;

	/**
	 * undefined
	 */
	lv_inc_31: string;


	/**
	 * 获取【0】我方"1"/敌方"2"【1】单位"1"/技能"2"【2】类id【3】实例id
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgGameElement): number {
		return cfgItem.id;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static nameGetter (cfgItem: CfgGameElement): string {
		return cfgItem.name;
	}

	/**
	 * 获取情报
	 * @param cfgItem 
	 */
	public static txt_infoGetter (cfgItem: CfgGameElement): string {
		return cfgItem.txt_info;
	}

	/**
	 * 获取主颜色
	 * @param cfgItem 
	 */
	public static color_mainGetter (cfgItem: CfgGameElement): string {
		return cfgItem.color_main;
	}

	/**
	 * 获取尺寸
	 * @param cfgItem 
	 */
	public static size_markGetter (cfgItem: CfgGameElement): number {
		return cfgItem.size_mark;
	}

	/**
	 * 获取标记为boss
	 * @param cfgItem 
	 */
	public static is_bossGetter (cfgItem: CfgGameElement): number {
		return cfgItem.is_boss;
	}

	/**
	 * 获取样式代码
	 * @param cfgItem 
	 */
	public static style_codeGetter (cfgItem: CfgGameElement): number {
		return cfgItem.style_code;
	}

	/**
	 * 获取重力缩放
	 * @param cfgItem 
	 */
	public static gravity_scaleGetter (cfgItem: CfgGameElement): number {
		return cfgItem.gravity_scale;
	}

	/**
	 * 获取图鉴可见
	 * @param cfgItem 
	 */
	public static bookGetter (cfgItem: CfgGameElement): number {
		return cfgItem.book;
	}

	/**
	 * 获取掉落物0-类型
	 * @param cfgItem 
	 */
	public static drop_0_typeGetter (cfgItem: CfgGameElement): number {
		return cfgItem.drop_0_type;
	}

	/**
	 * 获取掉落物0-参数
	 * @param cfgItem 
	 */
	public static drop_0_valGetter (cfgItem: CfgGameElement): number {
		return cfgItem.drop_0_val;
	}

	/**
	 * 获取掉落物1-类型
	 * @param cfgItem 
	 */
	public static drop_1_typeGetter (cfgItem: CfgGameElement): number {
		return cfgItem.drop_1_type;
	}

	/**
	 * 获取掉落物1-参数
	 * @param cfgItem 
	 */
	public static drop_1_valGetter (cfgItem: CfgGameElement): number {
		return cfgItem.drop_1_val;
	}

	/**
	 * 获取伤害/治疗的基础量
	 * @param cfgItem 
	 */
	public static props_influence_countGetter (cfgItem: CfgGameElement): number {
		return cfgItem.props_influence_count;
	}

	/**
	 * 获取击退的基础量
	 * @param cfgItem 
	 */
	public static props_repelGetter (cfgItem: CfgGameElement): number {
		return cfgItem.props_repel;
	}

	/**
	 * 获取场景资源路径
	 * @param cfgItem 
	 */
	public static res_sceneGetter (cfgItem: CfgGameElement): string {
		return cfgItem.res_scene;
	}

	/**
	 * 获取ui资源路径
	 * @param cfgItem 
	 */
	public static res_uiGetter (cfgItem: CfgGameElement): string {
		return cfgItem.res_ui;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static powerGetter (cfgItem: CfgGameElement): number {
		return cfgItem.power;
	}

	/**
	 * 获取逻辑
	 * @param cfgItem 
	 */
	public static logicGetter (cfgItem: CfgGameElement): number {
		return cfgItem.logic;
	}

	/**
	 * 获取参数0
	 * @param cfgItem 
	 */
	public static prop_0Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_0;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_0Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_0;
	}

	/**
	 * 获取参数1
	 * @param cfgItem 
	 */
	public static prop_1Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_1;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_1Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_1;
	}

	/**
	 * 获取参数2
	 * @param cfgItem 
	 */
	public static prop_2Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_2;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_2Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_2;
	}

	/**
	 * 获取参数3
	 * @param cfgItem 
	 */
	public static prop_3Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_3;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_3Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_3;
	}

	/**
	 * 获取参数4
	 * @param cfgItem 
	 */
	public static prop_4Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_4;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_4Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_4;
	}

	/**
	 * 获取参数5
	 * @param cfgItem 
	 */
	public static prop_5Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_5;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_5Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_5;
	}

	/**
	 * 获取参数6
	 * @param cfgItem 
	 */
	public static prop_6Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_6;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_6Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_6;
	}

	/**
	 * 获取参数7
	 * @param cfgItem 
	 */
	public static prop_7Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_7;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_7Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_7;
	}

	/**
	 * 获取参数8
	 * @param cfgItem 
	 */
	public static prop_8Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_8;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_8Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_8;
	}

	/**
	 * 获取参数9
	 * @param cfgItem 
	 */
	public static prop_9Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_9;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_9Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_9;
	}

	/**
	 * 获取参数10
	 * @param cfgItem 
	 */
	public static prop_10Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_10;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_10Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_10;
	}

	/**
	 * 获取参数11
	 * @param cfgItem 
	 */
	public static prop_11Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_11;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_11Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_11;
	}

	/**
	 * 获取参数12
	 * @param cfgItem 
	 */
	public static prop_12Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_12;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_12Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_12;
	}

	/**
	 * 获取参数13
	 * @param cfgItem 
	 */
	public static prop_13Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_13;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_13Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_13;
	}

	/**
	 * 获取参数14
	 * @param cfgItem 
	 */
	public static prop_14Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_14;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_14Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_14;
	}

	/**
	 * 获取参数15
	 * @param cfgItem 
	 */
	public static prop_15Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_15;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_15Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_15;
	}

	/**
	 * 获取参数16
	 * @param cfgItem 
	 */
	public static prop_16Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_16;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_16Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_16;
	}

	/**
	 * 获取参数17
	 * @param cfgItem 
	 */
	public static prop_17Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_17;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_17Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_17;
	}

	/**
	 * 获取参数18
	 * @param cfgItem 
	 */
	public static prop_18Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_18;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_18Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_18;
	}

	/**
	 * 获取参数19
	 * @param cfgItem 
	 */
	public static prop_19Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_19;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_19Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_19;
	}

	/**
	 * 获取参数20
	 * @param cfgItem 
	 */
	public static prop_20Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_20;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_20Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_20;
	}

	/**
	 * 获取参数21
	 * @param cfgItem 
	 */
	public static prop_21Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_21;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_21Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_21;
	}

	/**
	 * 获取参数22
	 * @param cfgItem 
	 */
	public static prop_22Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_22;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_22Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_22;
	}

	/**
	 * 获取参数23
	 * @param cfgItem 
	 */
	public static prop_23Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_23;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_23Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_23;
	}

	/**
	 * 获取参数24
	 * @param cfgItem 
	 */
	public static prop_24Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_24;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_24Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_24;
	}

	/**
	 * 获取参数25
	 * @param cfgItem 
	 */
	public static prop_25Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_25;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_25Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_25;
	}

	/**
	 * 获取参数26
	 * @param cfgItem 
	 */
	public static prop_26Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_26;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_26Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_26;
	}

	/**
	 * 获取参数27
	 * @param cfgItem 
	 */
	public static prop_27Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_27;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_27Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_27;
	}

	/**
	 * 获取参数28
	 * @param cfgItem 
	 */
	public static prop_28Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_28;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_28Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_28;
	}

	/**
	 * 获取参数29
	 * @param cfgItem 
	 */
	public static prop_29Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_29;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_29Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_29;
	}

	/**
	 * 获取参数30
	 * @param cfgItem 
	 */
	public static prop_30Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_30;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_30Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_30;
	}

	/**
	 * 获取参数31
	 * @param cfgItem 
	 */
	public static prop_31Getter (cfgItem: CfgGameElement): string {
		return cfgItem.prop_31;
	}

	/**
	 * 获取undefined
	 * @param cfgItem 
	 */
	public static lv_inc_31Getter (cfgItem: CfgGameElement): string {
		return cfgItem.lv_inc_31;
	}
}