/**
 * 纳甲装配模块
 * 实现天干地支装配到六爻
 * 依据京房纳甲法，完整八宫配置
 *
 * 八纯卦纳甲规则：
 * 乾内甲外壬，坤内乙外癸
 * 坎内戊外戊，离内己外己
 * 震内庚外庚，巽内辛外辛
 * 艮内丙外丙，兑内丁外丁
 *
 * 地支配置：
 * 乾：子寅辰 午申戌
 * 坤：未巳卯 丑亥酉
 * 坎：寅辰午 申戌子
 * 离：卯丑亥 酉未巳
 * 震：子寅辰 午申戌
 * 巽：丑亥酉 未巳卯
 * 艮：辰午戌 寅申子
 * 兑：巳卯未 亥酉丑
 */

var tianganDizhi = require('./tianganDizhi.js');

/**
 * 八宫对应信息
 * key = 八纯卦的序号(按乾1坤2坎3离4震5巽6艮7兑8的传统八宫序)
 * 实际上我们用宫名做key更直观
 *
 * 这里定义每个宫的：
 * - 内卦(下卦)天干、外卦(上卦)天干
 * - 内卦(下卦)地支列表(初爻到三爻)、外卦(上卦)地支列表(四爻到上爻)
 */
var GONG_NAYIYA = {
  // 乾宫：内甲外壬，地支：子寅辰/午申戌
  '乾': {
    innerGan: '甲',
    outerGan: '壬',
    innerZhi: ['子', '寅', '辰'],
    outerZhi: ['午', '申', '戌']
  },
  // 坤宫：内乙外癸，地支：未巳卯/丑亥酉
  '坤': {
    innerGan: '乙',
    outerGan: '癸',
    innerZhi: ['未', '巳', '卯'],
    outerZhi: ['丑', '亥', '酉']
  },
  // 坎宫：内戊外戊，地支：寅辰午/申戌子
  '坎': {
    innerGan: '戊',
    outerGan: '戊',
    innerZhi: ['寅', '辰', '午'],
    outerZhi: ['申', '戌', '子']
  },
  // 离宫：内己外己，地支：卯丑亥/酉未巳
  '离': {
    innerGan: '己',
    outerGan: '己',
    innerZhi: ['卯', '丑', '亥'],
    outerZhi: ['酉', '未', '巳']
  },
  // 震宫：内庚外庚，地支：子寅辰/午申戌
  '震': {
    innerGan: '庚',
    outerGan: '庚',
    innerZhi: ['子', '寅', '辰'],
    outerZhi: ['午', '申', '戌']
  },
  // 巽宫：内辛外辛，地支：丑亥酉/未巳卯
  '巽': {
    innerGan: '辛',
    outerGan: '辛',
    innerZhi: ['丑', '亥', '酉'],
    outerZhi: ['未', '巳', '卯']
  },
  // 艮宫：内丙外丙，地支：辰午戌/寅申子
  '艮': {
    innerGan: '丙',
    outerGan: '丙',
    innerZhi: ['辰', '午', '戌'],
    outerZhi: ['寅', '申', '子']
  },
  // 兑宫：内丁外丁，地支：巳卯未/亥酉丑
  '兑': {
    innerGan: '丁',
    outerGan: '丁',
    innerZhi: ['巳', '卯', '未'],
    outerZhi: ['亥', '酉', '丑']
  }
};

/**
 * 京房八宫世系
 * 每宫8卦，按八纯→一世→二世→三世→四世→五世→游魂→归魂排列
 * 格式：[卦序号, 卦名, 世系类型]
 *
 * 注意：这里用卦的binary来判断卦属于哪一宫
 * 实际上用卦序号来确定宫位更简单
 * 但因为我们的guaData.xuhao可能和传统八宫序不一致
 * 所以通过上下卦来判断宫位
 */

/**
 * 根据卦的上下卦确定宫位
 * 八纯卦属于各自的宫，其他卦需要通过变爻关系确定宫位
 *
 * 简化方案：通过卦的上下卦组合来确定
 * 乾宫八卦：乾为天、天风姤、天山遁、天地否、风地观、山地剥、火地晋、火天大有
 * 兑宫八卦：兑为泽、泽水困、泽地萃、泽山咸、水山蹇、地山谦、雷山小过、雷泽归妹
 * 离宫八卦：离为火、火山旅、火风鼎、火水未济、山水蒙、风水涣、天水讼、天火同人
 * 震宫八卦：震为雷、雷地豫、雷水解、雷风恒、地风升、水风井、泽风大过、泽雷随
 * 巽宫八卦：巽为风、风天小畜、风水涣、风雷益、天雷无妄、火雷噬嗑、山雷颐、山风蛊
 * 坎宫八卦：坎为水、水泽节、水雷屯、水火既济、泽火革、雷火丰、地火明夷、地水师
 * 艮宫八卦：艮为山、山火贲、山天大畜、山泽损、火泽睽、天泽履、风泽中孚、风山渐
 * 坤宫八卦：坤为地、地雷复、地泽临、地天泰、雷天大壮、泽天夬、水天需、水地比
 */

// 每个卦所属的宫位（按卦序号1-64索引）
// 宫位: '乾','兑','离','震','巽','坎','艮','坤'
var GUA_GONG_MAP = {
  // 乾宫 (1-8按传统序)
  1: '乾',   // 乾为天
  2: '巽',   // 坤为地 - 属巽宫？不对

  // 用卦名来映射更可靠
};

// 更可靠的方式：直接用卦序号映射到宫位
// 按照京房八宫的传统排列
// 这里用卦序号 → 宫名 的完整映射
var GUA_TO_GONG = {};

// 按传统京房八宫序号来定义（与文王64卦序不同）
// 但我们的guaData用的是文王序，所以需要建立映射
(function() {
  // 乾宫八卦
  var qianGong = [1, 44, 33, 12, 20, 23, 35, 14]; // 乾为天、天风姤、天山遁、天地否、风地观、山地剥、火地晋、火天大有
  // 兑宫八卦
  var duiGong = [58, 47, 45, 31, 39, 15, 62, 54]; // 兑为泽、泽水困、泽地萃、泽山咸、水山蹇、地山谦、雷山小过、雷泽归妹
  // 离宫八卦
  var liGong = [30, 56, 50, 64, 4, 59, 6, 13]; // 离为火、火山旅、火风鼎、火水未济、山水蒙、风水涣、天水讼、天火同人
  // 震宫八卦
  var zhenGong = [51, 16, 40, 32, 46, 48, 28, 17]; // 震为雷、雷地豫、雷水解、雷风恒、地风升、水风井、泽风大过、泽雷随
  // 巽宫八卦
  var xunGong = [57, 9, 37, 42, 25, 21, 27, 18]; // 巽为风、风天小畜、风火家人、风雷益、天雷无妄、火雷噬嗑、山雷颐、山风蛊
  // 坎宫八卦
  var kanGong = [29, 60, 3, 63, 49, 55, 36, 7]; // 坎为水、水泽节、水雷屯、水火既济、泽火革、雷火丰、地火明夷、地水师
  // 艮宫八卦
  var genGong = [52, 22, 26, 41, 38, 10, 61, 53]; // 艮为山、山火贲、山天大畜、山泽损、火泽睽、天泽履、风泽中孚、风山渐
  // 坤宫八卦
  var kunGong = [2, 24, 19, 11, 34, 43, 5, 8]; // 坤为地、地雷复、地泽临、地天泰、雷天大壮、泽天夬、水天需、水地比

  var gongMap = {
    '乾': qianGong,
    '兑': duiGong,
    '离': liGong,
    '震': zhenGong,
    '巽': xunGong,
    '坎': kanGong,
    '艮': genGong,
    '坤': kunGong
  };

  for (var gong in gongMap) {
    var guaList = gongMap[gong];
    for (var i = 0; i < guaList.length; i++) {
      GUA_TO_GONG[guaList[i]] = gong;
    }
  }
})();

/**
 * 获取卦的宫位名称
 * @param {number} guaXuhao 卦序号 (1-64)
 * @returns {string} 宫位名称
 */
function getGuaGong(guaXuhao) {
  return GUA_TO_GONG[guaXuhao] || '乾'; // 默认乾宫
}

/**
 * 获取卦的宫位信息
 * @param {number} guaXuhao 卦序号
 * @returns {Object} {gong: 宫位名, position: 在宫中的位置(0-7)}
 */
function getGuaGongInfo(guaXuhao) {
  var gong = getGuaGong(guaXuhao);
  var position = 0;

  // 找到在宫中的位置
  var gongMap = {
    '乾': [1, 44, 33, 12, 20, 23, 35, 14],
    '兑': [58, 47, 45, 31, 39, 15, 62, 54],
    '离': [30, 56, 50, 64, 4, 59, 6, 13],
    '震': [51, 16, 40, 32, 46, 48, 28, 17],
    '巽': [57, 9, 37, 42, 25, 21, 27, 18],
    '坎': [29, 60, 3, 63, 49, 55, 36, 7],
    '艮': [52, 22, 26, 41, 38, 10, 61, 53],
    '坤': [2, 24, 19, 11, 34, 43, 5, 8]
  };

  var list = gongMap[gong];
  if (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i] === guaXuhao) {
        position = i;
        break;
      }
    }
  }

  return {
    gong: gong,
    position: position, // 0=八纯, 1=一世, 2=二世, 3=三世, 4=四世, 5=五世, 6=游魂, 7=归魂
    positionName: ['八纯', '一世', '二世', '三世', '四世', '五世', '游魂', '归魂'][position]
  };
}

/**
 * 获取指定卦、指定爻位的天干
 * 根据京房纳甲法
 * @param {number} guaXuhao 卦序号
 * @param {number} position 爻位 (1-6, 初爻=1)
 * @returns {string} 天干
 */
function getNayiyaTiangan(guaXuhao, position) {
  var gong = getGuaGong(guaXuhao);
  var nayiyaConfig = GONG_NAYIYA[gong];
  if (!nayiyaConfig) return '甲';

  // 内卦(1-3爻)用innerGan，外卦(4-6爻)用outerGan
  if (position <= 3) {
    return nayiyaConfig.innerGan;
  } else {
    return nayiyaConfig.outerGan;
  }
}

/**
 * 获取指定卦、指定爻位的地支
 * @param {number} guaXuhao 卦序号
 * @param {number} position 爻位 (1-6)
 * @returns {string} 地支
 */
function getNayiyaDizhi(guaXuhao, position) {
  var gong = getGuaGong(guaXuhao);
  var nayiyaConfig = GONG_NAYIYA[gong];
  if (!nayiyaConfig) return '子';

  if (position <= 3) {
    // 内卦：初爻=0, 二爻=1, 三爻=2
    return nayiyaConfig.innerZhi[(position - 1) % 3];
  } else {
    // 外卦：四爻=0, 五爻=1, 上爻=2
    return nayiyaConfig.outerZhi[(position - 4) % 3];
  }
}

/**
 * 获取完整的纳甲信息
 * @param {number} guaXuhao 卦序号
 * @param {number} position 爻位 (1-6)
 * @returns {Object} {tiangan, dizhi}
 */
function getNayiya(guaXuhao, position) {
  return {
    tiangan: getNayiyaTiangan(guaXuhao, position),
    dizhi: getNayiyaDizhi(guaXuhao, position)
  };
}

module.exports = {
  getNayiya: getNayiya,
  getNayiyaDizhi: getNayiyaDizhi,
  getNayiyaTiangan: getNayiyaTiangan,
  getGuaGong: getGuaGong,
  getGuaGongInfo: getGuaGongInfo,
  GONG_NAYIYA: GONG_NAYIYA,
  GUA_TO_GONG: GUA_TO_GONG
};
