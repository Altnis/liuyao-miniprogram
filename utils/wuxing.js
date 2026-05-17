/**
 * 五行生克分析模块
 * 分析卦象中的五行生克关系
 */

var tianganDizhi = require('./tianganDizhi.js');

/**
 * 分析五行生克关系
 * @param {Array} yaoList 六爻详细列表
 * @param {string} dayGan 日干
 * @param {string} dayZhi 日支
 * @returns {Object} 生克分析结果
 */
function analyzeWuXingShengKe(yaoList, dayGan, dayZhi) {
  // 统计各五行数量
  var wuxingCount = countWuxing(yaoList);

  // 分析生克关系
  var shengKeRelations = analyzeShengKeRelations(yaoList);

  // 找出旺衰
  var wangShuai = analyzeWangShuai(wuxingCount, dayGan);

  // 用神分析
  var yongShen = analyzeYongShen(yaoList, dayGan);

  return {
    wuxingCount: wuxingCount,
    shengKeRelations: shengKeRelations,
    wangShuai: wangShuai,
    yongShen: yongShen,
    summary: generateSummary(wuxingCount, shengKeRelations, wangShuai)
  };
}

/**
 * 统计各五行数量
 * @param {Array} yaoList 六爻列表
 * @returns {Object} 五行数量统计
 */
function countWuxing(yaoList) {
  var count = {
    '金': 0,
    '木': 0,
    '水': 0,
    '火': 0,
    '土': 0
  };

  for (var i = 0; i < yaoList.length; i++) {
    var wuxing = tianganDizhi.getDiZhiWuXing(yaoList[i].dizhi);
    if (count.hasOwnProperty(wuxing)) {
      count[wuxing]++;
    }
  }

  return count;
}

/**
 * 分析生克关系
 * @param {Array} yaoList 六爻列表
 * @returns {Array} 生克关系列表
 */
function analyzeShengKeRelations(yaoList) {
  var relations = [];

  for (var i = 0; i < yaoList.length - 1; i++) {
    var yao1 = yaoList[i];
    var yao2 = yaoList[i + 1];

    var wx1 = tianganDizhi.getDiZhiWuXing(yao1.dizhi);
    var wx2 = tianganDizhi.getDiZhiWuXing(yao2.dizhi);

    var relation = '';
    if (tianganDizhi.isSheng(wx1, wx2)) {
      relation = wx1 + '生' + wx2;
    } else if (tianganDizhi.isKe(wx1, wx2)) {
      relation = wx1 + '克' + wx2;
    } else {
      relation = wx1 + '与' + wx2 + '比和';
    }

    relations.push({
      from: i + 1,
      to: i + 2,
      relation: relation
    });
  }

  return relations;
}

/**
 * 分析旺衰
 * @param {Object} wuxingCount 五行数量
 * @param {string} dayGan 日干
 * @returns {Object} 旺衰分析
 */
function analyzeWangShuai(wuxingCount, dayGan) {
  var dayWuxing = tianganDizhi.getTianGanWuXing(dayGan);

  var maxCount = 0;
  var wangWuxing = '';
  for (var wx in wuxingCount) {
    if (wuxingCount[wx] > maxCount) {
      maxCount = wuxingCount[wx];
      wangWuxing = wx;
    }
  }

  var minCount = 6;
  var shuaiWuxing = '';
  for (var wx2 in wuxingCount) {
    if (wuxingCount[wx2] < minCount) {
      minCount = wuxingCount[wx2];
      shuaiWuxing = wx2;
    }
  }

  return {
    dayWuxing: dayWuxing,
    wangWuxing: wangWuxing,
    shuaiWuxing: shuaiWuxing,
    description: '日干属' + dayWuxing + '，' + wangWuxing + '最旺，' + shuaiWuxing + '最衰'
  };
}

/**
 * 分析用神
 * @param {Array} yaoList 六爻列表
 * @param {string} dayGan 日干
 * @returns {Object} 用神分析
 */
function analyzeYongShen(yaoList, dayGan) {
  var shiYao = null;
  for (var i = 0; i < yaoList.length; i++) {
    if (yaoList[i].isShi) {
      shiYao = yaoList[i];
      break;
    }
  }

  if (!shiYao) {
    return {
      yongShen: '未知',
      description: '世爻未找到'
    };
  }

  return {
    yongShen: shiYao.liuqin,
    position: shiYao.position,
    description: '世爻为' + shiYao.liuqin + '（' + shiYao.dizhi + '），为用神'
  };
}

/**
 * 生成总结
 * @param {Object} wuxingCount 五行数量
 * @param {Array} relations 生克关系
 * @param {Object} wangShuai 旺衰
 * @returns {string} 总结文字
 */
function generateSummary(wuxingCount, relations, wangShuai) {
  var summary = '【五行分析】\n';

  summary += '五行分布：';
  for (var wx in wuxingCount) {
    if (wuxingCount[wx] > 0) {
      summary += wx + wuxingCount[wx] + ' ';
    }
  }
  summary += '\n\n';

  summary += '旺衰分析：' + wangShuai.description + '\n\n';

  summary += '生克关系：\n';
  for (var i = 0; i < relations.length; i++) {
    summary += '第' + relations[i].from + '爻与第' + relations[i].to + '爻：' + relations[i].relation + '\n';
  }

  return summary;
}

/**
 * 获取爻的五行
 * @param {string} dizhi 地支
 * @returns {string} 五行
 */
function getYaoWuxing(dizhi) {
  return tianganDizhi.getDiZhiWuXing(dizhi);
}

module.exports = {
  analyzeWuXingShengKe: analyzeWuXingShengKe,
  countWuxing: countWuxing,
  analyzeShengKeRelations: analyzeShengKeRelations,
  analyzeWangShuai: analyzeWangShuai,
  analyzeYongShen: analyzeYongShen,
  getYaoWuxing: getYaoWuxing
};
