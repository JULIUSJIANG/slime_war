
import UtilObjPool from "../../basic/UtilObjPool";
import UtilObjPoolType from "../../basic/UtilObjPoolType";

const APP = `CfgEquipmentProps`;

export default class CfgEquipmentProps {

	private constructor () {}

	private static _t = new UtilObjPoolType<CfgEquipmentProps> ({
		instantiate: () => {
			return new CfgEquipmentProps();
		},
		onPop: (t) => {

		},
		onPush: (t) => {

		},
        tag: APP
	});

	static Pop (apply: string, data: any[]) {
		let t = UtilObjPool.Pop(CfgEquipmentProps._t, apply);
		t.id = data[0];
		t.name = data[1];
		t.info = data[2];
		t.props_cost = data[3];
		t.res = data[4];
		t.style = data[5];
		t.icon_ui = data[6];
		t.icon_scene = data[7];
		t.icon_play_view = data[8];
		t.distance_o_to_output = data[9];
		t.arrow = data[10];
		t.logic = data[11];
		t.prop_0 = data[12];
		t.prop_1 = data[13];
		t.prop_2 = data[14];
		t.prop_3 = data[15];
		t.prop_4 = data[16];
		t.prop_5 = data[17];
		t.prop_6 = data[18];
		t.prop_7 = data[19];
		t.prop_8 = data[20];
		t.prop_9 = data[21];
		t.prop_10 = data[22];
		t.prop_11 = data[23];
		t.prop_12 = data[24];
		t.prop_13 = data[25];
		t.prop_14 = data[26];
		t.prop_15 = data[27];
		t.prop_16 = data[28];
		t.prop_17 = data[29];
		t.prop_18 = data[30];
		t.prop_19 = data[31];
		t.prop_20 = data[32];
		t.prop_21 = data[33];
		t.prop_22 = data[34];
		t.prop_23 = data[35];
		t.prop_24 = data[36];
		t.prop_25 = data[37];
		t.prop_26 = data[38];
		t.prop_27 = data[39];
		t.prop_28 = data[40];
		t.prop_29 = data[41];
		t.prop_30 = data[42];
		t.prop_31 = data[43];
		return t;
	}


	/**
	 * ch_temp_bone_a_cd
	 */
	id: number;

	/**
	 * 名称
	 */
	name: string;

	/**
	 * 描述
	 */
	info: string;

	/**
	 * 耗能
	 */
	props_cost: number;

	/**
	 * 展示用的资源路径
	 */
	res: string;

	/**
	 * 对应可视化组件
	 */
	style: number;

	/**
	 * 图标资源-ui专用
	 */
	icon_ui: string;

	/**
	 * 图标资源-奖励发放
	 */
	icon_scene: string;

	/**
	 * 图标资源-战斗场景切换
	 */
	icon_play_view: string;

	/**
	 * 发射的位置偏移
	 */
	distance_o_to_output: number;

	/**
	 * 主弹药的型号
	 */
	arrow: number;

	/**
	 * 逻辑
	 */
	logic: number;

	/**
	 * 参数0
	 */
	prop_0: string;

	/**
	 * 参数1
	 */
	prop_1: string;

	/**
	 * 参数2
	 */
	prop_2: string;

	/**
	 * 参数3
	 */
	prop_3: string;

	/**
	 * 参数4
	 */
	prop_4: string;

	/**
	 * 参数5
	 */
	prop_5: string;

	/**
	 * 参数6
	 */
	prop_6: string;

	/**
	 * 参数7
	 */
	prop_7: string;

	/**
	 * 参数8
	 */
	prop_8: string;

	/**
	 * 参数9
	 */
	prop_9: string;

	/**
	 * 参数10
	 */
	prop_10: string;

	/**
	 * 参数11
	 */
	prop_11: string;

	/**
	 * 参数12
	 */
	prop_12: string;

	/**
	 * 参数13
	 */
	prop_13: string;

	/**
	 * 参数14
	 */
	prop_14: string;

	/**
	 * 参数15
	 */
	prop_15: string;

	/**
	 * 参数16
	 */
	prop_16: string;

	/**
	 * 参数17
	 */
	prop_17: string;

	/**
	 * 参数18
	 */
	prop_18: string;

	/**
	 * 参数19
	 */
	prop_19: string;

	/**
	 * 参数20
	 */
	prop_20: string;

	/**
	 * 参数21
	 */
	prop_21: string;

	/**
	 * 参数22
	 */
	prop_22: string;

	/**
	 * 参数23
	 */
	prop_23: string;

	/**
	 * 参数24
	 */
	prop_24: string;

	/**
	 * 参数25
	 */
	prop_25: string;

	/**
	 * 参数26
	 */
	prop_26: string;

	/**
	 * 参数27
	 */
	prop_27: string;

	/**
	 * 参数28
	 */
	prop_28: string;

	/**
	 * 参数29
	 */
	prop_29: string;

	/**
	 * 参数30
	 */
	prop_30: string;

	/**
	 * 参数31
	 */
	prop_31: string;


	/**
	 * 获取ch_temp_bone_a_cd
	 * @param cfgItem 
	 */
	public static idGetter (cfgItem: CfgEquipmentProps): number {
		return cfgItem.id;
	}

	/**
	 * 获取名称
	 * @param cfgItem 
	 */
	public static nameGetter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.name;
	}

	/**
	 * 获取描述
	 * @param cfgItem 
	 */
	public static infoGetter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.info;
	}

	/**
	 * 获取耗能
	 * @param cfgItem 
	 */
	public static props_costGetter (cfgItem: CfgEquipmentProps): number {
		return cfgItem.props_cost;
	}

	/**
	 * 获取展示用的资源路径
	 * @param cfgItem 
	 */
	public static resGetter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.res;
	}

	/**
	 * 获取对应可视化组件
	 * @param cfgItem 
	 */
	public static styleGetter (cfgItem: CfgEquipmentProps): number {
		return cfgItem.style;
	}

	/**
	 * 获取图标资源-ui专用
	 * @param cfgItem 
	 */
	public static icon_uiGetter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.icon_ui;
	}

	/**
	 * 获取图标资源-奖励发放
	 * @param cfgItem 
	 */
	public static icon_sceneGetter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.icon_scene;
	}

	/**
	 * 获取图标资源-战斗场景切换
	 * @param cfgItem 
	 */
	public static icon_play_viewGetter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.icon_play_view;
	}

	/**
	 * 获取发射的位置偏移
	 * @param cfgItem 
	 */
	public static distance_o_to_outputGetter (cfgItem: CfgEquipmentProps): number {
		return cfgItem.distance_o_to_output;
	}

	/**
	 * 获取主弹药的型号
	 * @param cfgItem 
	 */
	public static arrowGetter (cfgItem: CfgEquipmentProps): number {
		return cfgItem.arrow;
	}

	/**
	 * 获取逻辑
	 * @param cfgItem 
	 */
	public static logicGetter (cfgItem: CfgEquipmentProps): number {
		return cfgItem.logic;
	}

	/**
	 * 获取参数0
	 * @param cfgItem 
	 */
	public static prop_0Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_0;
	}

	/**
	 * 获取参数1
	 * @param cfgItem 
	 */
	public static prop_1Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_1;
	}

	/**
	 * 获取参数2
	 * @param cfgItem 
	 */
	public static prop_2Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_2;
	}

	/**
	 * 获取参数3
	 * @param cfgItem 
	 */
	public static prop_3Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_3;
	}

	/**
	 * 获取参数4
	 * @param cfgItem 
	 */
	public static prop_4Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_4;
	}

	/**
	 * 获取参数5
	 * @param cfgItem 
	 */
	public static prop_5Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_5;
	}

	/**
	 * 获取参数6
	 * @param cfgItem 
	 */
	public static prop_6Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_6;
	}

	/**
	 * 获取参数7
	 * @param cfgItem 
	 */
	public static prop_7Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_7;
	}

	/**
	 * 获取参数8
	 * @param cfgItem 
	 */
	public static prop_8Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_8;
	}

	/**
	 * 获取参数9
	 * @param cfgItem 
	 */
	public static prop_9Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_9;
	}

	/**
	 * 获取参数10
	 * @param cfgItem 
	 */
	public static prop_10Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_10;
	}

	/**
	 * 获取参数11
	 * @param cfgItem 
	 */
	public static prop_11Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_11;
	}

	/**
	 * 获取参数12
	 * @param cfgItem 
	 */
	public static prop_12Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_12;
	}

	/**
	 * 获取参数13
	 * @param cfgItem 
	 */
	public static prop_13Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_13;
	}

	/**
	 * 获取参数14
	 * @param cfgItem 
	 */
	public static prop_14Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_14;
	}

	/**
	 * 获取参数15
	 * @param cfgItem 
	 */
	public static prop_15Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_15;
	}

	/**
	 * 获取参数16
	 * @param cfgItem 
	 */
	public static prop_16Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_16;
	}

	/**
	 * 获取参数17
	 * @param cfgItem 
	 */
	public static prop_17Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_17;
	}

	/**
	 * 获取参数18
	 * @param cfgItem 
	 */
	public static prop_18Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_18;
	}

	/**
	 * 获取参数19
	 * @param cfgItem 
	 */
	public static prop_19Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_19;
	}

	/**
	 * 获取参数20
	 * @param cfgItem 
	 */
	public static prop_20Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_20;
	}

	/**
	 * 获取参数21
	 * @param cfgItem 
	 */
	public static prop_21Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_21;
	}

	/**
	 * 获取参数22
	 * @param cfgItem 
	 */
	public static prop_22Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_22;
	}

	/**
	 * 获取参数23
	 * @param cfgItem 
	 */
	public static prop_23Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_23;
	}

	/**
	 * 获取参数24
	 * @param cfgItem 
	 */
	public static prop_24Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_24;
	}

	/**
	 * 获取参数25
	 * @param cfgItem 
	 */
	public static prop_25Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_25;
	}

	/**
	 * 获取参数26
	 * @param cfgItem 
	 */
	public static prop_26Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_26;
	}

	/**
	 * 获取参数27
	 * @param cfgItem 
	 */
	public static prop_27Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_27;
	}

	/**
	 * 获取参数28
	 * @param cfgItem 
	 */
	public static prop_28Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_28;
	}

	/**
	 * 获取参数29
	 * @param cfgItem 
	 */
	public static prop_29Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_29;
	}

	/**
	 * 获取参数30
	 * @param cfgItem 
	 */
	public static prop_30Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_30;
	}

	/**
	 * 获取参数31
	 * @param cfgItem 
	 */
	public static prop_31Getter (cfgItem: CfgEquipmentProps): string {
		return cfgItem.prop_31;
	}
}