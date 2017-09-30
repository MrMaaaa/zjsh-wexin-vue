const imgUrl = 'https://copen.zhujiash.com/Web/detail-page/images/';

module.exports = {
	imgUrl,
	// 小时工
	'2': {
		title: '小时工',
		headImg: imgUrl + 'header-xsg.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [
			[{
				title: '家具表面擦拭无尘',
				img: imgUrl + 'standard-xsg-1.png'
			}, {
				title: '家电厨电表面无尘',
				img: imgUrl + 'standard-xsg-2.png'
			}], [{
				title: '物品分类整理归位',
				img: imgUrl + 'standard-xsg-3.png'
			}, {
				title: '地面洁净无水渍',
				img: imgUrl + 'standard-xsg-4.png'
			}], [{
				title: '卫生间干爽无污渍',
				img: imgUrl + 'standard-xsg-5.png'
			}, {
				title: '门窗洁净光亮',
				img: imgUrl + 'standard-xsg-6.png'
			}]
		],
		price: '',
		process: '',
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 新房开荒
	'3': {
		title: '新房开荒',
		headImg: imgUrl + 'header-xfkh.png',
		standard: '新房开荒着重处理新居装修后遗留下的污渍、胶点、灰尘等问题。助家生活专业技师，经过专业培训，配备专业工具，为您的新家提供全方位的清洁方案',
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'xfkh.png',

		// 注意事项
		warn: ['1.新房开荒时间计价为每人每小时收费，如服务时长为4小时，特殊情况安排2位保洁人员则每人服务2个小时；', '2.取消或者修改订单信息请提前8小时致电客服，若客户自身原因临时取消订单，需收取一定上门费用；'],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 沙发清洗
	'4': {
		title: '沙发清洗',
		headImg: imgUrl + 'header-sfqx.png',
		standard: ['彻底清洁布艺/皮质沙发的污垢，焕然一新；用天然护理剂对沙发进行保养，让沙发整体光洁；养护师经专业培训，为您制定科学的养护计划，延长沙发的使用寿命', '友情提示：贵妃座按两座计算'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'sfqx_1.png',
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 月嫂
	'5': {
		title: '月嫂',
		headImg: imgUrl + 'header-ys.png',
		standard: [],
		introduce: {
			title: '经助家认证的月嫂，依托专业辅导团队、既为产妇提供健康膳食、起居护理、形体恢复、心理疏导等服务，也为新生儿提供身体护理、健康喂养、日常物品清洁等服务。选择专业月嫂，呵护母婴，体贴放心。',
			img: imgUrl + 'header-ys-info.png',
		},
		range: [
			[{
				title: '新生儿生活护理',
				img: imgUrl + 'range-ys-1.png'
			}, {
				title: '产妇生活护理',
				img: imgUrl + 'range-ys-2.png'
			}],
			[{
				title: '健康指导',
				img: imgUrl + 'range-ys-3.png'
			}, {
				title: '日常服务',
				img: imgUrl + 'range-ys-4.png'
			}]
		],
		price: imgUrl + 'price-bg-ys.png',
		process: imgUrl + 'process-ys.png',
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 育儿嫂
	'6': {
		title: '育儿嫂',
		headImg: imgUrl + 'header-yes.png',
		standard: [],
		introduce: {
			title: '经助家认证的育儿嫂，依托专业辅导团队、不仅为用户提供婴幼儿日常料理，健康膳食、用品清洁等专业护理，还提供潜能开发，学前教育和行为培养等成长服务，选择专业育儿嫂，帮助宝宝快乐成长。',
			img: imgUrl + 'yuersao_1.png',
		},
		range: [
			[{
				title: '',
				img: imgUrl + 'yuersao_2.png'
			}]
		],
		price: imgUrl + 'yuersao_3.png',
		process: imgUrl + 'process-ys.png',
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 保姆
	'7': {
		title: '保姆',
		headImg: imgUrl + 'header-bm.png',
		standard: [],
		introduce: {
			title: '经助家认证的保姆，拥有丰富的工作经验，为用户提供日常保洁、洗衣、做饭等全方位生活服务。用户可以更加家庭需求，灵活选择住家型和不住家型保姆。专业管家服务，尽享品质生活！',
			img: '',
		},
		range: [
			[{
				title: '',
				img: imgUrl + 'baomu_2.png'
			}]
		],
		price: imgUrl + 'baomu_3.png',
		process: imgUrl + 'process-ys.png',
		warn: ['1.上门试用满意后确定人选；', '2.第一天免费上门面试，超出时长，按约定日薪收取费用；', '3.未找到适用阿姨，订金将全额退款（若有试用工资未结算的将扣除）；'],
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 老人看护
	'8': {
		title: '老人看护',
		headImg: imgUrl + 'header_lrkh.png',
		standard: [],
		introduce: {
			title: '经助家认证的专业陪护保姆，拥有丰富的护理经验，不仅提供老人餐饮照顾、身体、卫生护理、心理疏导等服务，还提供居室清洁、环境整理等服务，给予老人全方位的关怀。选择助家生活呵护服务，更专业，更贴心。',
			img: imgUrl + 'laorenkanhu_1.png',
		},
		range: [
			[{
				title: '',
				img: imgUrl + 'laorenkanhu_2.png'
			}]
		],
		price: imgUrl + 'laorenkanhu_3.png',
		process: imgUrl + 'process-ys.png',
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 病患看护
	'9': {
		title: '病患看护',
		headImg: imgUrl + 'header-bhkh.png',
		standard: [],
		introduce: {
			title: '满足医院或者居家的短期护理需求，主要包括住院期间护理、出院回家康复护理或者突发状况需要的临时看护服务。',
			img: imgUrl + 'binghuankanhu_1.png',
		},
		range: [
			[{
				title: '',
				img: imgUrl + 'binghuankanhu_2.png'
			}]
		],
		price: imgUrl + 'binghuankanhu_3.png',
		process: imgUrl + 'process-ys.png',
		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 油烟机清洗
	'12': {
		title: '油烟机清洗',
		headImg: imgUrl + 'header-yyjqx.png',
		standard: '油烟机内外表面洁净光亮，油盒、油网和止回阀无油无痕消毒，涡轮壳、涡轮除油消毒，工作区域干净。',
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'yyjqx_1.png',

		// 注意事项
		warn: ['1.侧吸、集成等特殊油烟机清洗需收取一定额外费用；', '2.7天内，如有清洗造成的故障，助家将协助负责售后服务；', '3.取消或者修改订单信息请提前8小时致电客服，若客户自身原因临时取消订单，需收取一定上门费用；'],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 空调清洗
	'13': {
		title: '空调清洗',
		headImg: imgUrl + 'header-kt.png',
		standard: '空调内积累的灰尘、细菌吹向室内，威胁您和家人的健康。专业的换热器深层清洁，保障健康，还可以节电15%-20%，延长使用寿命，建议每3个月清洗一次',
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-ktqx.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 冰箱清洗
	'14': {
		title: '冰箱清洗',
		headImg: imgUrl + 'header-bx.png',
		standard: ['1、冰箱无异味，内部无霜无冰', '2、零部件及冰箱内外洁净无菌'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'bx_1.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 洗衣机清洗
	'15': {
		title: '洗衣机清洗',
		headImg: imgUrl + 'header-xyj.png',
		standard: ['1、洗衣机内筒、外壁、排水口、洗衣机显示器干净光亮；', '2、密封圈、线屑过滤器、分配器、接水管、排水管等洁无污；', '3、工作区域干净，物品归位。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'xyj_1.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 微波炉清洗
	'16': {
		title: '微波炉清洗',
		headImg: imgUrl + 'header-wbl.png',
		standard: ['1. 除垢除味：百洁布配合专业清洗剂，不放过任何死角。', '2.三洗: 分别对内部、外部、零件进行清洗、消毒。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'wbl_1.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 饮水机清洗
	'17': {
		title: '饮水机清洗',
		headImg: imgUrl + 'header-ysj.png',
		standard: ['1. 彻底冲洗：五放五排彻底冲洗管道中的污渍和异味。', '2.无缝洗尘: 全方位无死角的深度表面清洁，光亮如新'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'ysj_1.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 地板保养
	'18': {
		title: '地板保养',
		headImg: imgUrl + 'header-dbby.png',
		standard: ['地板保养是延长地板使用寿命的重要措施。可以通过打蜡是地板本身与空气隔绝，减少因氧化对地板造成的损害。工人师傅使用专业设备，打蜡更均匀，保护更持久。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 地毯保养
	'19': {
		title: '地毯保养',
		headImg: imgUrl + 'header-dtby.png',
		standard: ['地毯长期不洗，表面吸附灰尘较多，易滋生细菌和螨虫，造成呼吸道疾病及皮肤病，不利于家人健康。助家生活地毯洗护业务，采用专业地毯清洗设备，配合一线洗涤品牌，有效去污除螨，延长地毯使用寿命。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: ['1.最低上门费家用地毯480元，办公地毯400元；', '2.取消或者修改订单信息请提前8小时致电客服，若客户自身原因临时取消订单，需收取一定上门费用；'],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 石材保养
	'20': {
		title: '石材保养',
		headImg: imgUrl + 'header-scby.png',
		standard: ['从业多年的专业工人，专业设备，深层清洁保养'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-scby.png',

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 鲜花
	'22': {
		title: '鲜花',
		headImg: imgUrl + 'header-xh.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 自定义内容的secton
		custom: [{
			title: '珍宠自己  值得拥有',
			content: ['多种鲜花搭配出繁复之美', '插瓶鉴赏体会出精致之感', imgUrl + 'header-xh1.png'],
		}, {
			title: '专业花艺师  精心设计',
			content: ['品种多样、配色丰富、层次鲜明',  imgUrl + 'Range-xh.png'],
		}],

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056！'
		}]
	},

	// 鞋包维修
	'23': {
		title: '鞋包维修',
		headImg: imgUrl + 'header-xbwx.png',
		standard: ['专业针对各种鞋包进行修理、补色、上色、修饰、美容、清洗、定型、保养'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		custom: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 送水
	'24': {
		title: '送水',
		headImg: imgUrl + 'header-ss.png',
		standard: ['为您提供便捷的送水服务信息,优质送水商家!助家生活让您快捷的喝上放心水！'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 开锁
	'25': {
		title: '开锁',
		headImg: imgUrl + 'header-ks.png',
		standard: ['找开锁服务就上助家生活，专业开锁,换锁,修锁服务商家,全部认证,安全可靠!'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 搬家搬运
	'26': {
		title: '搬家搬运',
		headImg: imgUrl + 'header-bjby.png',
		standard: ['传统搬家行业服务不规范， 要价不透明，售后无保障。助家生活搬家服务，补单解决大件物品的搬运和家具的拆装问题，而且价格便宜、收费透明、售后有保障。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 洗衣
	'27': {
		title: '洗衣',
		headImg: imgUrl + 'header-xy.png',
		standard: ['我们会寻找一线品牌中的优秀洗衣店、洗衣工厂进行合作，您的衣服会送到距您家较近的其中一家。除了基本的资质、品牌、店面面积要求外，我们对加工商使用的设备，技师的等级水平、工作年限，店内员工数量，清洗流程等均有着严格的要求，保证了您每件衣物的洗护品质。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056！'
		}]
	},

	// 按摩
	'28': {
		title: '按摩',
		headImg: imgUrl + 'header-am.png',
		standard: ['响应迅速,上门服务有保障。助家生活上门按摩,100%技师认证,安全、专业!旨在提供更好的上门按摩服务。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 厨师
	'29': {
		title: '厨师',
		headImg: imgUrl + 'header-cs.png',
		standard: ['致力于打造健康的饮食理念，改变传统的饮食方式，让您在家就可以享受到星级厨师为您制作的各式菜系的美味佳肴。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 废品回收
	'30': {
		title: '废品回收',
		headImg: imgUrl + 'header-fphs.png',
		standard: ['由专业正规的废品回收站或公司进行收购。之后对废品的科学处理及分类达到再次循环利用的标准，废品回收这项服务对保护环境、节约能源和带动社会效益起着积极的作用。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 灯饰安装
	'31': {
		title: '灯饰安装',
		headImg: imgUrl + 'header-dsaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 卫浴安装
	'32': {
		title: '卫浴安装',
		headImg: imgUrl + 'header-wyaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 热水器安装
	'33': {
		title: '热水器安装',
		headImg: imgUrl + 'header-rsqaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 空调安装
	'34': {
		title: '空调安装',
		headImg: imgUrl + 'header-ktaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz1.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 复合地板安装
	'35': {
		title: '复合地板安装',
		headImg: imgUrl + 'header-fhdbaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 强化地板安装
	'36': {
		title: '强化地板安装',
		headImg: imgUrl + 'header-qhdbaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 实木地板安装
	'37': {
		title: '实木地板安装',
		headImg: imgUrl + 'header-smdbaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 实木门安装
	'38': {
		title: '实木门安装',
		headImg: imgUrl + 'header-smmaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 实木复合门安装
	'39': {
		title: '实木复合门安装',
		headImg: imgUrl + 'header-smfhmaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 免漆门安装
	'40': {
		title: '免漆门安装',
		headImg: imgUrl + 'header-mqmaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 家具安装
	'41': {
		title: '家具安装',
		headImg: imgUrl + 'header-jjaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 门窗安装
	'42': {
		title: '门窗安装',
		headImg: imgUrl + 'header-mcaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 弱电安装
	'43': {
		title: '弱电安装',
		headImg: imgUrl + 'header-rdaz.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-mcaz.png',

		// 注意事项
		warn: ['安装、维修类服务，上门后未服务的将收取一定的上门费用，具体情况可以咨询客服或我们的安装师傅'],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 墙面铺贴
	'44': {
		title: '墙面铺贴',
		headImg: imgUrl + 'header-qmpt.png',
		standard: ['彻底清洁布艺/皮质沙发的污垢，焕然一新；', '用天然护理剂对沙发进行保养，让沙发整体光洁；', '养护师经专业培训，为您制定科学的养护计划，延长沙发的使用寿命'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 水电工
	'45': {
		title: '水电工',
		headImg: imgUrl + 'header-sdg.png',
		standard: ['承接木工、油漆工、水电工、泥工、瓷砖美缝、室内设计、建筑垃圾清运等各类装修服务。工程不转包，施工规范，全程监控。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 泥工
	'46': {
		title: '泥工',
		headImg: imgUrl + 'header-ng.png',
		standard: ['承接木工、油漆工、水电工、泥工、瓷砖美缝、室内设计、建筑垃圾清运等各类装修服务。工程不转包，施工规范，全程监控。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 油漆工
	'47': {
		title: '油漆工',
		headImg: imgUrl + 'header-yqg.png',
		standard: ['承接木工、油漆工、水电工、泥工、瓷砖美缝、室内设计、建筑垃圾清运等各类装修服务。工程不转包，施工规范，全程监控。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 木工
	'48': {
		title: '木工',
		headImg: imgUrl + 'header-mg.png',
		standard: ['处理墙壁，无尘打磨，涂刷底漆，专业的施工方案，全方位保护，完全不用您自己动手。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 瓷砖美缝
	'49': {
		title: '瓷砖美缝',
		headImg: imgUrl + 'header-czmf.png',
		standard: ['承接木工、油漆工、水电工、泥工、瓷砖美缝、室内设计、建筑垃圾清运等各类装修服务。工程不转包，施工规范，全程监控。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '健康保障',
			c: '服务人员均通过健康认证，每年进行2次健康检查，保障雇主家庭健康安全！'
		}, {
			t: '隐私保障',
			c: '服务过程中，未经客户允许，不擅自翻动衣柜、抽屉等个人隐私范围，不泄露客户个人隐私！'
		}]
	},

	// 垃圾清运
	'50': {
		title: '垃圾清运',
		headImg: imgUrl + 'header-ljqy.png',
		standard: ['承接木工、油漆工、水电工、泥工、瓷砖美缝、室内设计、建筑垃圾清运等各类装修服务。工程不转包，施工规范，全程监控。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 室内设计
	'51': {
		title: '室内设计',
		headImg: imgUrl + 'header-snsj.png',
		standard: ['承接木工、油漆工、水电工、泥工、瓷砖美缝、室内设计、建筑垃圾清运等各类装修服务。工程不转包，施工规范，全程监控。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 电脑维修
	'52': {
		title: '电脑维修',
		headImg: imgUrl + 'header-dnwx.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-dnwx.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 手机维修
	'53': {
		title: '手机维修',
		headImg: imgUrl + 'header-sjwx.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-sjwx.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 大家电维修
	'54': {
		title: '大家电维修',
		headImg: imgUrl + 'header-djdwx.png',
		standard: [],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: imgUrl + 'process-djdwx.png',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 充氟利昂
	'55': {
		title: '充氟利昂',
		headImg: imgUrl + 'header-cfla.png',
		standard: ['空调加氟，品牌不限', '', '', '服务保障:', '', '1.保修90天', '', '2.助家生活所有服务明码标价，请放心使用'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 管道疏通
	'56': {
		title: '管道疏通',
		headImg: imgUrl + 'header-gdst.png',
		standard: ['专业承接管道疏通、下水道疏通、马桶堵塞等各种疑难问题，彻底清除掉管道内积存多年的污垢。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 墙面维修
	'57': {
		title: '墙面维修',
		headImg: imgUrl + 'header-qmwx.png',
		standard: ['处理墙面，无尘打磨。涂刷底漆，专业的施工方案，全方位保护，完全不用您自己动手。'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},

	// 空气检测处理
	'58': {
		title: '空气检测处理',
		headImg: imgUrl + 'header-kqjccl.png',
		standard: ['室内空气检测、治理,全新环净,打造健康新空间,造福万千家庭'],
		introduce: {
			title: '',
			img: ''
		},
		range: [],
		price: '',
		process: '',

		// 注意事项
		warn: [],

		assurance: [{
			t: '服务专业',
			c: '金牌专家在技术上、服务上无可挑剔，为您带来更好的服务体验！'
		}, {
			t: '隐私保障',
			c: '用户致电助家生活，提交申请事由与事实，助家生活参与事件调查，并协助处理如有疑问，请提前咨询客服4008-262-056'
		}]
	},
}