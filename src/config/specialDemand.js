/**
 * 特殊服务品类保姆、育儿嫂、保姆、老人看护、病患看护的要求
 */

function getMonths(interval = 0) {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if(month + interval > 12) {
    year += 1;
    month += (interval - 12);
  } else {
    month += interval;
  }
  return year + '-' + month;
}

export default {
  // 月嫂
  '5': {
    demand: [{
      title: '您的预产期',
      mtitle: '预产期',
      contentList: [{
        name: getMonths(),
        isDatetime: true,
        isSelected: false
      }, {
        name: getMonths(1),
        isDatetime: true,
        isSelected: false
      }, {
        name: getMonths(2),
        isDatetime: true,
        isSelected: false
      }, {
        name: getMonths(3),
        isDatetime: true,
        isSelected: false
      }, {
        name: getMonths(4),
        isDatetime: true,
        isSelected: false
      }, {
        name: '待定',
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '您希望月嫂有几年工作经验：',
      mtitle: '工作经验',
      contentList: [{
        name: '3-5年',
        isDatetime: false,
        isSelected: false
      }, {
        name: '6-7年',
        isDatetime: false,
        isSelected: false
      }, {
        name: '8-10年',
        isDatetime: false,
        isSelected: false
      }, {
        name: '10年以上',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }],
    remarks: '若您有其他特殊要求（如服务特别要求、月嫂籍贯、年龄、学历等）可在此填写。'
  },

  // 育儿嫂
  '6': {
    demand: [{
      title: '您的宝宝年龄：',
      mtitle: '宝宝年龄',
      contentList: [{
        name: '一岁以内',
        isDatetime: false,
        isSelected: false
      }, {
        name: '1-3岁',
        isDatetime: false,
        isSelected: false
      }, {
        name: '3岁以上',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '您的要求（可多选）：',
      mtitle: '要求',
      contentList: [{
        name: '生活照料',
        isDatetime: false,
        isSelected: false
      }, {
        name: '保健护理',
        isDatetime: false,
        isSelected: false
      }, {
        name: '启蒙教育',
        isDatetime: false,
        isSelected: false
      }, {
        name: '适量家务劳动',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: true
    }, {
      title: '您希望育婴师住家还是不住家：',
      mtitle: '是否住家',
      contentList: [{
        name: '住家',
        isDatetime: false,
        isSelected: false
      }, {
        name: '不住家',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }],
    remarks: '若您有其他特殊要求（如育婴师籍贯、学历、年龄等）可在此填写。'
  },

  // 保姆
  '7': {
    demand: [{
      title: '您希望获得的服务内容是（可多选）：',
      mtitle: '服务内容',
      contentList: [{
        name: '做饭',
        isDatetime: false,
        isSelected: false
      }, {
        name: '打扫卫生',
        isDatetime: false,
        isSelected: false
      }, {
        name: '洗衣服',
        isDatetime: false,
        isSelected: false
      }, {
        name: '照顾小孩',
        isDatetime: false,
        isSelected: false
      }, {
        name: '照顾老人',
        isDatetime: false,
        isSelected: false
      }, {
        name: '饲养宠物',
        isDatetime: false,
        isSelected: false
      }, {
        name: '照顾病人',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: true
    }, {
      title: '服务面积：',
      mtitle: '服务面积',
      contentList: [{
        name: '0-60平方',
        isDatetime: false,
        isSelected: false
      }, {
        name: '61-150平方',
        isDatetime: false,
        isSelected: false
      }, {
        name: '150平方以上',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '服务时长：',
      mtitle: '服务时长',
      contentList: [{
        name: '1-3个月',
        isDatetime: false,
        isSelected: false
      }, {
        name: '4-6个月',
        isDatetime: false,
        isSelected: false
      }, {
        name: '6个月以上',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }],
    remarks: '若您有其他特殊要求（如保姆籍贯、年龄、每天工作时间等）可在此填写。'
  },

  // 老人看护
  '8': {
    demand: [{
      title: '您需要的陪护人员是住家的吗？',
      mtitle: '是否住家',
      contentList: [{
        name: '住家',
        isDatetime: false,
        isSelected: false
      }, {
        name: '不住家',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '您希望陪护人员的性别为：',
      mtitle: '陪护人员性别',
      contentList: [{
        name: '男',
        isDatetime: false,
        isSelected: false
      }, {
        name: '女',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '老人身体状况：',
      mtitle: '老人身体状况',
      contentList: [{
        name: '能自理',
        isDatetime: false,
        isSelected: false
      }, {
        name: '半自理',
        isDatetime: false,
        isSelected: false
      }, {
        name: '不能自理',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '您希望陪护人员有几年工作经验：',
      mtitle: '陪护人员工作经验',
      contentList: ['1-3年', '4-6年', '7-10年', '10年以上', '面谈'],
      contentList: [{
        name: '1-3年',
        isDatetime: false,
        isSelected: false
      }, {
        name: '4-6年',
        isDatetime: false,
        isSelected: false
      }, {
        name: '7-10年',
        isDatetime: false,
        isSelected: false
      }, {
        name: '10年以上',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }],
    remarks: '若您有其他特殊要求（如服务特别要求、长期还是短期陪护等）可在此填写。'
  },

  // 病患看护
  '9': {
    demand: [{
      title: '您需要哪种陪护类型？',
      mtitle: '陪护类型',
      contentList: [{
        name: '重症陪护',
        isDatetime: false,
        isSelected: false
      }, {
        name: '偏瘫陪护',
        isDatetime: false,
        isSelected: false
      }, {
        name: '住院陪护',
        isDatetime: false,
        isSelected: false
      }, {
        name: '术后陪护',
        isDatetime: false,
        isSelected: false
      }, {
        name: '其他',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '您希望陪护人员的性别为：',
      mtitle: '陪护人员性别',
      contentList: [{
        name: '男',
        isDatetime: false,
        isSelected: false
      }, {
        name: '女',
        isDatetime: false,
        isSelected: false
      }, {
        name: '面谈',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '病人在什么时间需要陪护：',
      mtitle: '陪护时间',
      contentList: [{
        name: '白天',
        isDatetime: false,
        isSelected: false
      }, {
        name: '夜间',
        isDatetime: false,
        isSelected: false
      }, {
        name: '24小时',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }, {
      title: '病人的年龄是：',
      mtitle: '病人年龄',
      contentList: [{
        name: '30岁以内',
        isDatetime: false,
        isSelected: false
      }, {
        name: '30-60岁',
        isDatetime: false,
        isSelected: false
      }, {
        name: '60岁以上',
        isDatetime: false,
        isSelected: false
      }],
      isMultiple: false
    }],
    remarks: '若您有其他特殊要求（如服务特别要求、长期还是短期陪护等）可在此填写。'
  },
}