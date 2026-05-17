/**
 * 天干地支数据模块
 * 包含天干、地支、五行等基础数据
 */

// 天干
var TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
var DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 地支对应五行
var DIZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 天干对应五行
var TIANGAN_WUXING = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火',
  '戊': '土', '己': '土', '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 五行相生关系：金生水、水生木、木生火、火生土、土生金
var WUXING_SHENG = {
  '金': '水', '水': '木', '木': '火', '火': '土', '土': '金'
};

// 五行相克关系：金克木、木克土、土克水、水克火、火克金
var WUXING_KE = {
  '金': '木', '木': '土', '土': '水', '水': '火', '火': '金'
};

// 地支对应数字（用于计算）
var DIZHI_NUM = {
  '子': 1, '丑': 2, '寅': 3, '卯': 4,
  '辰': 5, '巳': 6, '午': 7, '未': 8,
  '申': 9, '酉': 10, '戌': 11, '亥': 12
};

// 天干对应数字
var TIANGAN_NUM = {
  '甲': 1, '乙': 2, '丙': 3, '丁': 4, '戊': 5,
  '己': 6, '庚': 7, '辛': 8, '壬': 9, '癸': 10
};

/**
 * 获取天干
 * @param {number} index 索引 (1-10)
 * @returns {string} 天干
 */
function getTianGan(index) {
  var idx = ((index - 1) % 10 + 10) % 10;
  return TIANGAN[idx];
}

/**
 * 获取地支
 * @param {number} index 索引 (1-12)
 * @returns {string} 地支
 */
function getDiZhi(index) {
  var idx = ((index - 1) % 12 + 12) % 12;
  return DIZHI[idx];
}

/**
 * 获取地支的五行
 * @param {string} dizhi 地支
 * @returns {string} 五行
 */
function getDiZhiWuXing(dizhi) {
  return DIZHI_WUXING[dizhi] || '未知';
}

/**
 * 获取天干的五行
 * @param {string} tiangan 天干
 * @returns {string} 五行
 */
function getTianGanWuXing(tiangan) {
  return TIANGAN_WUXING[tiangan] || '未知';
}

/**
 * 检查五行相生
 * @param {string} wuxing1 五行1
 * @param {string} wuxing2 五行2
 * @returns {boolean} wuxing1是否生wuxing2
 */
function isSheng(wuxing1, wuxing2) {
  return WUXING_SHENG[wuxing1] === wuxing2;
}

/**
 * 检查五行相克
 * @param {string} wuxing1 五行1
 * @param {string} wuxing2 五行2
 * @returns {boolean} wuxing1是否克wuxing2
 */
function isKe(wuxing1, wuxing2) {
  return WUXING_KE[wuxing1] === wuxing2;
}

/**
 * 根据日期计算天干地支
 * @param {number} year 年
 * @param {number} month 月 (1-12)
 * @param {number} day 日
 * @returns {Object} {tiangan, dizhi, tianganIndex, dizhiIndex}
 */
function getDayGanZhi(year, month, day) {
  // 简化的日干支计算（使用基准日推算）
  // 基准日：2000年1月1日 = 甲子日（实际为庚辰，这里简化处理）
  // 更精确的做法需要查万年历，这里用一个近似算法

  var baseDate = new Date(2000, 0, 7); // 2000年1月7日为甲子日
  var targetDate = new Date(year, month - 1, day);
  var diffDays = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));

  // 天干：10天一循环
  var tianganIndex = ((diffDays % 10) + 10) % 10;
  // 地支：12天一循环
  var dizhiIndex = ((diffDays % 12) + 12) % 12;

  return {
    tiangan: TIANGAN[tianganIndex],
    dizhi: DIZHI[dizhiIndex],
    tianganIndex: tianganIndex + 1,
    dizhiIndex: dizhiIndex + 1
  };
}

module.exports = {
  TIANGAN: TIANGAN,
  DIZHI: DIZHI,
  DIZHI_WUXING: DIZHI_WUXING,
  TIANGAN_WUXING: TIANGAN_WUXING,
  WUXING_SHENG: WUXING_SHENG,
  WUXING_KE: WUXING_KE,
  DIZHI_NUM: DIZHI_NUM,
  TIANGAN_NUM: TIANGAN_NUM,
  getTianGan: getTianGan,
  getDiZhi: getDiZhi,
  getDiZhiWuXing: getDiZhiWuXing,
  getTianGanWuXing: getTianGanWuXing,
  isSheng: isSheng,
  isKe: isKe,
  getDayGanZhi: getDayGanZhi
};
