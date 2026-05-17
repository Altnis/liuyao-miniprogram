/**
 * 世应定位模块
 * 根据京房纳甲法确定世爻和应爻位置
 *
 * 规则：
 * - 八纯卦：世在6爻(上爻)，应在3爻
 * - 一世卦：世在1爻(初爻)，应在4爻
 * - 二世卦：世在2爻，应在5爻
 * - 三世卦：世在3爻，应在6爻(上爻)
 * - 四世卦：世在4爻，应在1爻
 * - 五世卦：世在5爻，应在2爻
 * - 游魂卦：世在4爻，应在1爻
 * - 归魂卦：世在3爻，应在6爻(上爻)
 */

/**
 * 完整的64卦世应配置表
 * key = 卦序号(1-64), value = {shi: 世爻位置, ying: 应爻位置}
 * 爻位编号：1=初爻, 2=二爻, 3=三爻, 4=四爻, 5=五爻, 6=上爻
 */
var SHI_YING_TABLE = {
  // 乾宫八卦
  1:  {shi: 6, ying: 3},  // 乾为天（八纯）
  44: {shi: 1, ying: 4},  // 天风姤（一世）
  33: {shi: 2, ying: 5},  // 天山遁（二世）
  12: {shi: 3, ying: 6},  // 天地否（三世）
  20: {shi: 4, ying: 1},  // 风地观（四世）
  23: {shi: 5, ying: 2},  // 山地剥（五世）
  35: {shi: 4, ying: 1},  // 火地晋（游魂）
  14: {shi: 3, ying: 6},  // 火天大有（归魂）

  // 兑宫八卦
  58: {shi: 6, ying: 3},  // 兑为泽（八纯）
  47: {shi: 1, ying: 4},  // 泽水困（一世）
  45: {shi: 2, ying: 5},  // 泽地萃（二世）
  31: {shi: 3, ying: 6},  // 泽山咸（三世）
  39: {shi: 4, ying: 1},  // 水山蹇（四世）
  15: {shi: 5, ying: 2},  // 地山谦（五世）
  62: {shi: 4, ying: 1},  // 雷山小过（游魂）
  54: {shi: 3, ying: 6},  // 雷泽归妹（归魂）

  // 离宫八卦
  30: {shi: 6, ying: 3},  // 离为火（八纯）
  56: {shi: 1, ying: 4},  // 火山旅（一世）
  50: {shi: 2, ying: 5},  // 火风鼎（二世）
  64: {shi: 3, ying: 6},  // 火水未济（三世）
  4:  {shi: 4, ying: 1},  // 山水蒙（四世）
  59: {shi: 5, ying: 2},  // 风水涣（五世）
  6:  {shi: 4, ying: 1},  // 天水讼（游魂）
  13: {shi: 3, ying: 6},  // 天火同人（归魂）

  // 震宫八卦
  51: {shi: 6, ying: 3},  // 震为雷（八纯）
  16: {shi: 1, ying: 4},  // 雷地豫（一世）
  40: {shi: 2, ying: 5},  // 雷水解（二世）
  32: {shi: 3, ying: 6},  // 雷风恒（三世）
  46: {shi: 4, ying: 1},  // 地风升（四世）
  48: {shi: 5, ying: 2},  // 水风井（五世）
  28: {shi: 4, ying: 1},  // 泽风大过（游魂）
  17: {shi: 3, ying: 6},  // 泽雷随（归魂）

  // 巽宫八卦
  57: {shi: 6, ying: 3},  // 巽为风（八纯）
  9:  {shi: 1, ying: 4},  // 风天小畜（一世）
  37: {shi: 2, ying: 5},  // 风火家人（二世）
  42: {shi: 3, ying: 6},  // 风雷益（三世）
  25: {shi: 4, ying: 1},  // 天雷无妄（四世）
  21: {shi: 5, ying: 2},  // 火雷噬嗑（五世）
  27: {shi: 4, ying: 1},  // 山雷颐（游魂）
  18: {shi: 3, ying: 6},  // 山风蛊（归魂）

  // 坎宫八卦
  29: {shi: 6, ying: 3},  // 坎为水（八纯）
  60: {shi: 1, ying: 4},  // 水泽节（一世）
  3:  {shi: 2, ying: 5},  // 水雷屯（二世）
  63: {shi: 3, ying: 6},  // 水火既济（三世）
  49: {shi: 4, ying: 1},  // 泽火革（四世）
  55: {shi: 5, ying: 2},  // 雷火丰（五世）
  36: {shi: 4, ying: 1},  // 地火明夷（游魂）
  7:  {shi: 3, ying: 6},  // 地水师（归魂）

  // 艮宫八卦
  52: {shi: 6, ying: 3},  // 艮为山（八纯）
  22: {shi: 1, ying: 4},  // 山火贲（一世）
  26: {shi: 2, ying: 5},  // 山天大畜（二世）
  41: {shi: 3, ying: 6},  // 山泽损（三世）
  38: {shi: 4, ying: 1},  // 火泽睽（四世）
  10: {shi: 5, ying: 2},  // 天泽履（五世）
  61: {shi: 4, ying: 1},  // 风泽中孚（游魂）
  53: {shi: 3, ying: 6},  // 风山渐（归魂）

  // 坤宫八卦
  2:  {shi: 6, ying: 3},  // 坤为地（八纯）
  24: {shi: 1, ying: 4},  // 地雷复（一世）
  19: {shi: 2, ying: 5},  // 地泽临（二世）
  11: {shi: 3, ying: 6},  // 地天泰（三世）
  34: {shi: 4, ying: 1},  // 雷天大壮（四世）
  43: {shi: 5, ying: 2},  // 泽天夬（五世）
  5:  {shi: 4, ying: 1},  // 水天需（游魂）
  8:  {shi: 3, ying: 6}   // 水地比（归魂）
};

/**
 * 计算世爻和应爻位置
 * @param {number} guaXuhao 卦序号 (1-64)
 * @returns {Object} {shi: 世爻位置(1-6), ying: 应爻位置(1-6)}
 */
function calculateShiYing(guaXuhao) {
  var result = SHI_YING_TABLE[guaXuhao];
  if (result) {
    return {shi: result.shi, ying: result.ying};
  }
  // 默认返回八纯卦配置
  return {shi: 6, ying: 3};
}

/**
 * 获取世爻位置
 * @param {number} guaXuhao 卦序号
 * @returns {number} 世爻位置 (1-6)
 */
function getShiYao(guaXuhao) {
  return calculateShiYing(guaXuhao).shi;
}

/**
 * 获取应爻位置
 * @param {number} guaXuhao 卦序号
 * @returns {number} 应爻位置 (1-6)
 */
function getYingYao(guaXuhao) {
  return calculateShiYing(guaXuhao).ying;
}

module.exports = {
  calculateShiYing: calculateShiYing,
  getShiYao: getShiYao,
  getYingYao: getYingYao,
  SHI_YING_TABLE: SHI_YING_TABLE
};
