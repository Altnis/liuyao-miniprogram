/**
 * 变爻处理模块
 * 处理老阴、老阳变爻，生成变卦
 *
 * 变爻规则：
 * - 老阳(3) → 变为阴爻(少阴)
 * - 老阴(0) → 变为阳爻(少阳)
 * - 少阳(1)/少阴(2) → 不变
 */

var liuyao = require('./liuyao.js');
var guaData = require('./guaData.js');

/**
 * 处理变爻，生成变卦
 * @param {Array<number>} yaoResults 原爻结果数组（初爻到上爻）
 * @param {Object} originalGua 本卦对象
 * @returns {Object|null} 变卦对象，如无变爻则返回null
 */
function processBianYao(yaoResults, originalGua) {
  // 检查是否有变爻
  var hasBianYao = false;
  for (var i = 0; i < yaoResults.length; i++) {
    if (yaoResults[i] === 0 || yaoResults[i] === 3) {
      hasBianYao = true;
      break;
    }
  }

  if (!hasBianYao) {
    return null;
  }

  // 生成变卦的爻结果
  var bianGuaYaoResults = [];
  for (var j = 0; j < yaoResults.length; j++) {
    if (yaoResults[j] === 0) {
      bianGuaYaoResults.push(1); // 老阴变少阳
    } else if (yaoResults[j] === 3) {
      bianGuaYaoResults.push(2); // 老阳变少阴
    } else {
      bianGuaYaoResults.push(yaoResults[j]); // 不变
    }
  }

  // 计算变卦序号
  var bianGuaXuhao = liuyao.calculateGuaXuhao(bianGuaYaoResults);

  // 获取变卦信息
  var bianGuaInfo = guaData.getGuaByXuhao(bianGuaXuhao);

  if (!bianGuaInfo) {
    console.error('变卦信息未找到:', bianGuaXuhao);
    return null;
  }

  // 构建变卦对象
  var bianGua = {
    guaName: bianGuaInfo.name,
    guaXuhao: bianGuaInfo.xuhao,
    guaType: '变卦',
    yaoResults: bianGuaYaoResults,
    guaci: bianGuaInfo.guaci,
    xiangci: bianGuaInfo.xiangci,
    explanations: bianGuaInfo.explanations,
    yaoDetails: null
  };

  return bianGua;
}

/**
 * 获取变爻的位置列表
 * @param {Array<number>} yaoResults 爻结果数组
 * @returns {Array<number>} 变爻位置数组（1-6）
 */
function getBianYaoPositions(yaoResults) {
  var positions = [];
  for (var i = 0; i < yaoResults.length; i++) {
    if (yaoResults[i] === 0 || yaoResults[i] === 3) {
      positions.push(i + 1);
    }
  }
  return positions;
}

/**
 * 判断指定爻位是否为变爻
 * @param {number} yaoValue 爻值
 * @returns {boolean} 是否为变爻
 */
function isBianYao(yaoValue) {
  return yaoValue === 0 || yaoValue === 3;
}

/**
 * 获取变爻类型说明
 * @param {number} yaoValue 爻值
 * @returns {string} 变爻说明
 */
function getBianYaoDescription(yaoValue) {
  if (yaoValue === 0) {
    return '老阴变少阳（阴极生阳）';
  } else if (yaoValue === 3) {
    return '老阳变少阴（阳极生阴）';
  } else {
    return '不变';
  }
}

/**
 * 分析变爻的影响
 * @param {Array<number>} yaoResults 爻结果
 * @param {Object} shiYing 世应位置 {shi, ying}
 * @returns {Object} 变爻分析结果
 */
function analyzeBianYao(yaoResults, shiYing) {
  var bianPositions = getBianYaoPositions(yaoResults);

  var analysis = {
    hasBian: bianPositions.length > 0,
    bianCount: bianPositions.length,
    bianPositions: bianPositions,
    isShiBian: bianPositions.indexOf(shiYing.shi) !== -1,
    isYingBian: bianPositions.indexOf(shiYing.ying) !== -1,
    description: ''
  };

  if (analysis.hasBian) {
    var desc = '共有' + analysis.bianCount + '个变爻：';
    var posNames = [];
    for (var i = 0; i < bianPositions.length; i++) {
      posNames.push('第' + bianPositions[i] + '爻');
    }
    desc += posNames.join('、');

    if (analysis.isShiBian && analysis.isYingBian) {
      desc += '。世爻和应爻都发生变动，事态变化较大。';
    } else if (analysis.isShiBian) {
      desc += '。世爻变动，自身状态或态度将发生变化。';
    } else if (analysis.isYingBian) {
      desc += '。应爻变动，外部环境或对方态度将发生变化。';
    }

    analysis.description = desc;
  }

  return analysis;
}

module.exports = {
  processBianYao: processBianYao,
  getBianYaoPositions: getBianYaoPositions,
  isBianYao: isBianYao,
  getBianYaoDescription: getBianYaoDescription,
  analyzeBianYao: analyzeBianYao
};
