/**
 * 结果页逻辑
 * 展示卦象详细信息、卦辞象辞、各方向解释
 */

var nayiya = require('../../utils/nayiya.js');
var shiying = require('../../utils/shiying.js');
var liuqin = require('../../utils/liuqin.js');
var liushen = require('../../utils/liushen.js');
var bianyao = require('../../utils/bianyao.js');
var wuxing = require('../../utils/wuxing.js');
var guaData = require('../../utils/guaData.js');
var tianganDizhi = require('../../utils/tianganDizhi.js');
var guaInterpretation = require('../../utils/guaInterpretation.js');

Page({
  data: {
    // 卦象数据
    guaData: null,
    guaName: '',
    guaXuhao: 0,
    guaType: '',

    // 六爻详情
    yaoDetails: [],

    // 世应位置
    shiPosition: 0,
    yingPosition: 0,

    // 变卦
    hasBianGua: false,
    biangua: null,

    // 变爻分析
    bianyaoAnalysis: null,

    // Tab切换
    currentTab: 'baihua',
    tabList: [
      {key: 'baihua', name: '白话文'},
      {key: 'yaoci', name: '爻辞'},
      {key: 'guaci', name: '卦辞'},
      {key: 'shaoyong', name: '邵雍解'},
      {key: 'fupeirong', name: '傅佩荣'},
      {key: 'zhangmingren', name: '张铭仁'},
      {key: 'duanyitianji', name: '断易天机'}
    ],

    // 日干（用于六亲和六神计算）
    dayGan: '甲',
    dayZhi: '子',

    // 五行分析
    wuxingAnalysis: null,

    // 显示变爻详情
    showBianyaoDetail: false,

    // 占卜时间
    divinationTime: '',

    // 解卦数据
    interpretation: null,

    // 当前展开的爻辞解卦
    expandedYaoIdx: -1
  },

  onLoad: function(options) {
    try {
      // 从本地存储读取卦象数据
      var guaDataObj = wx.getStorageSync('currentGuaData');
      if (guaDataObj) {
        this.processGuaData(guaDataObj);
        return;
      }
    } catch (e) {
      console.error('从本地存储读取失败:', e);
    }

    // 如果没有数据，提示用户
    wx.showToast({
      title: '未找到卦例数据',
      icon: 'none'
    });
  },

  /**
   * 处理卦象数据
   * @param {Object} guaDataObj 卦象数据
   */
  processGuaData: function(guaDataObj) {
    try {
      var guaXuhao = guaDataObj.guaXuhao;
      var yaoResults = guaDataObj.yaoResults;

      // 获取日干支
      var dayGan = '甲';
      var dayZhi = '子';
      if (guaDataObj.dayGanZhi) {
        dayGan = guaDataObj.dayGanZhi.tiangan;
        dayZhi = guaDataObj.dayGanZhi.dizhi;
      }

      // 获取世应位置
      var shiYing = shiying.calculateShiYing(guaXuhao);

      // 构建六爻详情
      var yaoDetails = this.buildYaoDetails(guaXuhao, yaoResults, shiYing, dayGan);

      // 构建爻辞列表（从guaData中获取）
      var yaociList = this.buildYaociList(guaDataObj, yaoResults);

      // 处理变爻
      var biangua = bianyao.processBianYao(yaoResults, guaDataObj);
      var hasBianGua = biangua !== null;

      // 构建变卦六爻详情
      var bianguaYaoDetails = [];
      if (hasBianGua && biangua.yaoResults) {
        var bianShiYing = shiying.calculateShiYing(biangua.guaXuhao);
        bianguaYaoDetails = this.buildYaoDetails(biangua.guaXuhao, biangua.yaoResults, bianShiYing, dayGan);
      }

      // 变爻分析
      var bianyaoAnalysis = bianyao.analyzeBianYao(yaoResults, shiYing);

      // 五行分析
      var wuxingAnalysis = null;
      try {
        wuxingAnalysis = wuxing.analyzeWuXingShengKe(yaoDetails, dayGan, dayZhi);
      } catch (e) {
        console.error('五行分析失败:', e);
      }

      // 加载解卦数据
      var interpretation = guaInterpretation[guaXuhao] || null;

      // 构建传统解卦数据（独立区块 + 子 tab）
      var chuantongSummaryText = '';
      var chuantongDaXiang = '';
      var chuantongTabRows = [];
      if (interpretation && interpretation.guaci_interpretation && interpretation.guaci_interpretation.chuantong) {
        var ct = interpretation.guaci_interpretation.chuantong;
        chuantongSummaryText = ct['summary'] || '';
        chuantongDaXiang = ct['大象'] || '';
        var fieldDefs = [
          {key: 'yunShi', label: '运势'},
          {key: 'shiYe', label: '事业'},
          {key: 'jingShang', label: '经商'},
          {key: 'qiuMing', label: '求名'},
          {key: 'hunLian', label: '婚恋'},
          {key: 'jueCe', label: '决策'}
        ];
        for (var fi = 0; fi < fieldDefs.length; fi++) {
          var fd = fieldDefs[fi];
          var val = ct[fd.label];
          if (val) {
            chuantongTabRows.push({key: fd.key, label: fd.label, value: val});
          }
        }
      }
      var defaultChuantongTab = chuantongTabRows.length > 0 ? chuantongTabRows[0].key : '';

      this.setData({
        guaData: guaDataObj,
        guaName: guaDataObj.guaName,
        guaXuhao: guaXuhao,
        guaType: guaDataObj.guaType || '本卦',
        yaoDetails: yaoDetails,
        yaociList: yaociList,
        shiPosition: shiYing.shi,
        yingPosition: shiYing.ying,
        hasBianGua: hasBianGua,
        biangua: biangua,
        bianguaYaoDetails: bianguaYaoDetails,
        bianyaoAnalysis: bianyaoAnalysis,
        dayGan: dayGan,
        dayZhi: dayZhi,
        wuxingAnalysis: wuxingAnalysis,
        divinationTime: guaDataObj.divinationTime || '',
        interpretation: interpretation,
        chuantongSummaryText: chuantongSummaryText,
        chuantongDaXiang: chuantongDaXiang,
        chuantongTabRows: chuantongTabRows,
        currentChuantongTab: defaultChuantongTab
      });
    } catch (e) {
      console.error('处理卦象数据失败:', e);
      wx.showToast({ title: '数据处理失败', icon: 'none' });
    }
  },

  /**
   * 构建爻辞展示列表
   * @param {Object} guaDataObj 卦象数据（含yaoci和xiaoxiang）
   * @param {Array} yaoResults 爻结果
   * @returns {Array} 爻辞列表
   */
  buildYaociList: function(guaDataObj, yaoResults) {
    var yaociArr = guaDataObj.yaoci || [];
    var xiaoxiangArr = guaDataObj.xiaoxiang || [];
    var list = [];

    for (var i = 0; i < 6; i++) {
      var yaoValue = yaoResults[i];
      var isChange = (yaoValue === 0 || yaoValue === 3);
      var yaoText = yaociArr[i] || '';
      var xiaoText = xiaoxiangArr[i] || '';

      // 提取爻辞标题（如"初九："、"六二："等）
      var yaociTitle = '';
      var yaociContent = yaoText;
      var colonIdx = yaoText.indexOf('：');
      if (colonIdx > 0 && colonIdx < 6) {
        yaociTitle = yaoText.substring(0, colonIdx);
        yaociContent = yaoText.substring(colonIdx + 1);
      } else {
        yaociTitle = this.getPositionName(i + 1);
      }

      list.push({
        position: i + 1,
        yaociTitle: yaociTitle,
        yaociContent: yaociContent,
        xiaoxiangContent: xiaoText,
        isChange: isChange,
        yaoValue: yaoValue
      });
    }

    return list;
  },

  /**
   * 构建六爻详情
   * @param {number} guaXuhao 卦序号
   * @param {Array} yaoResults 爻结果
   * @param {Object} shiYing 世应位置
   * @param {string} dayGan 日干
   * @returns {Array} 六爻详情列表
   */
  buildYaoDetails: function(guaXuhao, yaoResults, shiYing, dayGan) {
    var yaoDetails = [];

    // 从初爻(1)到上爻(6)
    for (var pos = 1; pos <= 6; pos++) {
      var yaoIndex = pos - 1;
      var yaoValue = yaoResults[yaoIndex];

      // 获取纳甲（天干地支）
      var nayiyaInfo = nayiya.getNayiya(guaXuhao, pos);

      // 计算六亲
      var liuqinResult = liuqin.calculateLiuQin(nayiyaInfo.dizhi, dayGan);

      // 计算六神
      var liushenResult = liushen.calculateLiuShen(dayGan, pos);

      // 获取五行
      var wuxingResult = wuxing.getYaoWuxing(nayiyaInfo.dizhi);

      yaoDetails.push({
        position: pos,
        positionName: this.getPositionName(pos),
        yaoValue: yaoValue,
        yaoType: this.getYaoType(yaoValue),
        yinYang: this.getYinYang(yaoValue),
        isChange: yaoValue === 0 || yaoValue === 3,
        tiangan: nayiyaInfo.tiangan,
        dizhi: nayiyaInfo.dizhi,
        wuxing: wuxingResult,
        liuqin: liuqinResult,
        liushen: liushenResult,
        isShi: pos === shiYing.shi,
        isYing: pos === shiYing.ying
      });
    }

    return yaoDetails;
  },

  /**
   * 获取爻位名称
   * @param {number} position 爻位 (1-6)
   * @returns {string} 爻位名称
   */
  getPositionName: function(position) {
    var names = ['', '初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
    return names[position] || '第' + position + '爻';
  },

  /**
   * 获取爻类型
   * @param {number} yaoValue 爻值
   * @returns {string} 爻类型
   */
  getYaoType: function(yaoValue) {
    var types = ['老阴', '少阳', '少阴', '老阳'];
    return types[yaoValue] || '未知';
  },

  /**
   * 获取阴阳属性
   * @param {number} yaoValue 爻值
   * @returns {string} 阴阳
   */
  getYinYang: function(yaoValue) {
    return (yaoValue === 1 || yaoValue === 3) ? '阳' : '阴';
  },

  /**
   * Tab切换
   */
  onTabChange: function(e) {
    var tabKey = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tabKey
    });
  },

  /**
   * 传统解卦子Tab切换
   */
  onChuantongTabChange: function(e) {
    var tabKey = e.currentTarget.dataset.tab;
    this.setData({
      currentChuantongTab: tabKey
    });
  },

  /**
   * 切换变爻详情显示
   */
  toggleBianyaoDetail: function() {
    this.setData({
      showBianyaoDetail: !this.data.showBianyaoDetail
    });
  },

  /**
   * 展开/收起爻辞解卦
   */
  onYaoExpand: function(e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      expandedYaoIdx: this.data.expandedYaoIdx === idx ? -1 : idx
    });
  },

  /**
   * 重新占卜
   */
  onRestart: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 查看历史记录
   */
  onViewHistory: function() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  /**
   * 分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.guaName + ' - 周易学习解读',
      path: '/pages/index/index'
    };
  }
});
