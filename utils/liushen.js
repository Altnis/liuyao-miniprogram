/**
 * 六神计算模块
 * 根据日干确定六神配置
 *
 * 六神：青龙、朱雀、勾陈、螣蛇、白虎、玄武
 *
 * 六神起始规则（以日干定青龙起始位置）：
 * - 甲乙 → 青龙起初爻
 * - 丙丁 → 朱雀起初爻
 * - 戊 → 勾陈起初爻
 * - 己 → 螣蛇起初爻
 * - 庚辛 → 白虎起初爻
 * - 壬癸 → 玄武起初爻
 */

// 六神列表（按顺序循环）
var LIUSHEN_LIST = ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'];

// 日干对应的六神起始索引
var DAYGAN_LIUSHEN_START = {
  '甲': 0,  // 青龙
  '乙': 0,  // 青龙
  '丙': 1,  // 朱雀
  '丁': 1,  // 朱雀
  '戊': 2,  // 勾陈
  '己': 3,  // 螣蛇
  '庚': 4,  // 白虎
  '辛': 4,  // 白虎
  '壬': 5,  // 玄武
  '癸': 5   // 玄武
};

/**
 * 计算指定爻位的六神
 * @param {string} dayGan 日干
 * @param {number} position 爻位 (1-6, 初爻=1)
 * @returns {string} 六神名称
 */
function calculateLiuShen(dayGan, position) {
  var startIdx = DAYGAN_LIUSHEN_START[dayGan];

  if (startIdx === undefined) {
    return '青龙'; // 默认
  }

  var liushenIdx = (startIdx + (position - 1)) % 6;
  return LIUSHEN_LIST[liushenIdx];
}

/**
 * 获取完整的六神配置（6个爻位）
 * @param {string} dayGan 日干
 * @returns {Array<string>} 6个爻位的六神列表
 */
function getCompleteLiuShen(dayGan) {
  var liushenList = [];
  for (var i = 1; i <= 6; i++) {
    liushenList.push(calculateLiuShen(dayGan, i));
  }
  return liushenList;
}

/**
 * 获取六神的含义说明
 * @param {string} liushen 六神名称
 * @returns {string} 含义说明
 */
function getLiuShenDescription(liushen) {
  var descriptions = {
    '青龙': '代表喜庆、吉祥、官贵、酒席',
    '朱雀': '代表口舌、文书、信息、争议',
    '勾陈': '代表田土、房产、阻滞、缓慢',
    '螣蛇': '代表虚惊、怪异、梦境、纠缠',
    '白虎': '代表凶丧、血光、疾病、损伤',
    '玄武': '代表盗贼、暗昧、隐私、暧昧'
  };

  return descriptions[liushen] || '';
}

/**
 * 获取六神对应的五行
 * @param {string} liushen 六神名称
 * @returns {string} 五行
 */
function getLiuShenWuxing(liushen) {
  var wuxingMap = {
    '青龙': '木',
    '朱雀': '火',
    '勾陈': '土',
    '螣蛇': '土',
    '白虎': '金',
    '玄武': '水'
  };

  return wuxingMap[liushen] || '土';
}

module.exports = {
  calculateLiuShen: calculateLiuShen,
  getCompleteLiuShen: getCompleteLiuShen,
  getLiuShenDescription: getLiuShenDescription,
  getLiuShenWuxing: getLiuShenWuxing,
  LIUSHEN_LIST: LIUSHEN_LIST,
  DAYGAN_LIUSHEN_START: DAYGAN_LIUSHEN_START
};
