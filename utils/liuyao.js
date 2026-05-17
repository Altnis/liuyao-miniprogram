/**
 * 六爻核心算法模块
 * 实现起卦、编码、辅助函数
 *
 * 编码规则：
 * 0 = 老阴（阴爻，变爻）
 * 1 = 少阳（阳爻，不变）
 * 2 = 少阴（阴爻，不变）
 * 3 = 老阳（阳爻，变爻）
 */

var guaData = require('./guaData.js');

/**
 * 模拟单枚硬币
 * @returns {number} 0=阴面(背), 1=阳面(字)
 */
function tossCoin() {
  return Math.random() < 0.5 ? 0 : 1;
}

/**
 * 生成单个爻
 * 3枚硬币，统计阳面数量
 * @returns {number} 0=老阴, 1=少阳, 2=少阴, 3=老阳
 */
function generateYao() {
  var c1 = tossCoin();
  var c2 = tossCoin();
  var c3 = tossCoin();
  var yangCount = c1 + c2 + c3;

  switch (yangCount) {
    case 0: return 0; // 0个阳面 = 老阴
    case 1: return 1; // 1个阳面 = 少阳
    case 2: return 2; // 2个阳面 = 少阴
    case 3: return 3; // 3个阳面 = 老阳
    default: return 1;
  }
}

/**
 * 生成完整6爻（从初爻到上爻）
 * @returns {Array<number>} 6个爻结果数组
 */
function generateFullGua() {
  var results = [];
  for (var i = 0; i < 6; i++) {
    results.push(generateYao());
  }
  return results;
}

/**
 * 将爻结果转为二进制字符串
 * @param {Array<number>} yaoResults 爻结果数组
 * @returns {string} 二进制字符串（从初爻到上爻，阳=1, 阴=0）
 */
function yaoToBinary(yaoResults) {
  var binary = '';
  for (var i = 0; i < yaoResults.length; i++) {
    binary += (yaoResults[i] === 1 || yaoResults[i] === 3) ? '1' : '0';
  }
  return binary;
}

/**
 * 根据6爻结果计算卦序号（1-64）
 * 使用 guaData.js 的二进制匹配，带三重fallback
 * @param {Array<number>} yaoResults 爻结果数组
 * @returns {number} 卦序号 (1-64)
 */
function calculateGuaXuhao(yaoResults) {
  var guaInfo = guaData.getGuaByYaoResults(yaoResults);
  if (guaInfo) {
    return guaInfo.xuhao;
  }
  // 极端fallback：返回1（乾为天）
  console.warn('[liuyao] calculateGuaXuhao: 未找到卦象，爻值=', yaoResults);
  return 1;
}

/**
 * 二进制字符串转卦序号
 * @param {string} binaryStr 二进制字符串
 * @returns {number} 卦序号
 */
function binaryStrToXuHao(binaryStr) {
  if (!binaryStr || binaryStr.length !== 6) return 1;
  var yaoResults = [];
  for (var i = 0; i < 6; i++) {
    yaoResults.push(parseInt(binaryStr[i]) ? 3 : 0);
  }
  return calculateGuaXuhao(yaoResults);
}

/**
 * 处理变爻，生成变卦的爻数组
 * 老阴(0)变少阳(1)，老阳(3)变少阴(2)，不变爻保持不变
 * @param {Array<number>} yaoResults 原爻结果
 * @returns {Array<number>} 变卦爻结果
 */
function getBianYao(yaoResults) {
  var result = [];
  for (var i = 0; i < yaoResults.length; i++) {
    if (yaoResults[i] === 0) {
      result.push(1); // 老阴变少阳
    } else if (yaoResults[i] === 3) {
      result.push(2); // 老阳变少阴
    } else {
      result.push(yaoResults[i]); // 不变
    }
  }
  return result;
}

/**
 * 获取爻类型名称
 * @param {number} yao 爻值 0-3
 * @returns {string} 爻类型名称
 */
function getYaoTypeName(yao) {
  switch (yao) {
    case 0: return '老阴';
    case 1: return '少阳';
    case 2: return '少阴';
    case 3: return '老阳';
    default: return '未知';
  }
}

/**
 * 获取爻的阴阳属性
 * @param {number} yao 爻值 0-3
 * @returns {string} '阳' 或 '阴'
 */
function getYaoYinYang(yao) {
  return (yao === 1 || yao === 3) ? '阳' : '阴';
}

/**
 * 判断是否变爻
 * @param {number} yao 爻值 0-3
 * @returns {boolean}
 */
function isYaoChangeable(yao) {
  return yao === 0 || yao === 3;
}

/**
 * 完整起卦 + 解卦
 * @returns {Object} 完整卦象数据
 */
function doDivination() {
  var yaoResults = generateFullGua();
  var binaryStr = yaoToBinary(yaoResults);
  var guaInfo = guaData.getGuaByYaoResults(yaoResults);
  var guaXuhao = guaInfo ? guaInfo.xuhao : 1;

  var bianYaoResults = getBianYao(yaoResults);
  var bianBinary = yaoToBinary(bianYaoResults);
  var bianGuaInfo = guaData.getGuaByBinary(bianBinary);
  var bianGuaXuhao = bianGuaInfo ? bianGuaInfo.xuhao : 1;

  return {
    yaoResults: yaoResults,
    binaryStr: binaryStr,
    guaXuhao: guaXuhao,
    guaName: guaInfo ? guaInfo.name : '未知卦',
    bianYaoResults: bianYaoResults,
    bianBinary: bianBinary,
    bianGuaXuhao: bianGuaXuhao,
    bianGuaName: bianGuaInfo ? bianGuaInfo.name : '未知卦',
    hasBian: yaoResults.some(function(y) { return y === 0 || y === 3; })
  };
}

module.exports = {
  tossCoin: tossCoin,
  generateYao: generateYao,
  generateFullGua: generateFullGua,
  yaoToBinary: yaoToBinary,
  calculateGuaXuhao: calculateGuaXuhao,
  binaryStrToXuHao: binaryStrToXuHao,
  getBianYao: getBianYao,
  doDivination: doDivination,
  getYaoTypeName: getYaoTypeName,
  getYaoYinYang: getYaoYinYang,
  isYaoChangeable: isYaoChangeable
};
