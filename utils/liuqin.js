/**
 * 六亲计算模块
 * 计算地支与日干的六亲关系
 *
 * 六亲关系：
 * - 生我者 = 父母
 * - 我生者 = 子孙
 * - 克我者 = 官鬼
 * - 我克者 = 妻财
 * - 同我者 = 兄弟
 */

var tianganDizhi = require('./tianganDizhi.js');

/**
 * 计算六亲关系
 * @param {string} dizhi 地支
 * @param {string} dayGan 日干
 * @returns {string} 六亲关系
 */
function calculateLiuQin(dizhi, dayGan) {
  var dayGanWuxing = tianganDizhi.getTianGanWuXing(dayGan);
  var dizhiWuxing = tianganDizhi.getDiZhiWuXing(dizhi);

  if (!dayGanWuxing || !dizhiWuxing || dayGanWuxing === '未知' || dizhiWuxing === '未知') {
    return '未知';
  }

  return getLiuQinRelation(dayGanWuxing, dizhiWuxing);
}

/**
 * 根据五行关系确定六亲
 * @param {string} wo 我（日干）的五行
 * @param {string} ta 地支的五行
 * @returns {string} 六亲关系
 */
function getLiuQinRelation(wo, ta) {
  // 生我者 = 父母
  if (tianganDizhi.isSheng(ta, wo)) {
    return '父母';
  }

  // 我生者 = 子孙
  if (tianganDizhi.isSheng(wo, ta)) {
    return '子孙';
  }

  // 克我者 = 官鬼
  if (tianganDizhi.isKe(ta, wo)) {
    return '官鬼';
  }

  // 我克者 = 妻财
  if (tianganDizhi.isKe(wo, ta)) {
    return '妻财';
  }

  // 同我者 = 兄弟
  if (wo === ta) {
    return '兄弟';
  }

  return '兄弟';
}

/**
 * 获取所有六亲关系说明
 * @returns {Object} 六亲关系说明
 */
function getLiuQinDescription() {
  return {
    '父母': '生我者，代表长辈、贵人、文书、学业',
    '兄弟': '同我者，代表朋友、同辈、竞争',
    '妻财': '我克者，代表财富、妻子、物品',
    '官鬼': '克我者，代表职位、上司、压力、疾病',
    '子孙': '我生者，代表子女、晚辈、福德、解忧'
  };
}

/**
 * 根据日干获取五行
 * @param {string} dayGan 日干
 * @returns {string} 五行
 */
function getDayGanWuxing(dayGan) {
  return tianganDizhi.getTianGanWuXing(dayGan);
}

module.exports = {
  calculateLiuQin: calculateLiuQin,
  getLiuQinRelation: getLiuQinRelation,
  getLiuQinDescription: getLiuQinDescription,
  getDayGanWuxing: getDayGanWuxing
};
