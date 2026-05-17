// app.js - 小程序入口
App({
  onLaunch: function() {
    console.log('六爻占卜小程序启动');

    // 获取系统信息
    try {
      var systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
    } catch (e) {
      console.error('获取系统信息失败:', e);
    }

    // 读取历史记录
    try {
      var history = wx.getStorageSync('liuyao_history') || [];
      this.globalData.history = history;
    } catch (e) {
      this.globalData.history = [];
    }
  },

  globalData: {
    systemInfo: null,
    history: []
  },

  /**
   * 保存历史记录
   * @param {Object} record 历史记录
   * @returns {boolean} 是否保存成功
   */
  saveHistory: function(record) {
    try {
      this.globalData.history.unshift(record);
      // 最多保存100条
      if (this.globalData.history.length > 100) {
        this.globalData.history = this.globalData.history.slice(0, 100);
      }
      wx.setStorageSync('liuyao_history', this.globalData.history);
      console.log('[App] 历史记录已保存', record.guaName);
      return true;
    } catch (e) {
      console.error('[App] 保存历史记录失败:', e);
      return false;
    }
  },

  /**
   * 获取历史记录
   * @returns {Array} 历史记录数组
   */
  getHistory: function() {
    return this.globalData.history || [];
  },

  /**
   * 清空历史记录
   * @returns {boolean} 是否清空成功
   */
  clearHistory: function() {
    try {
      this.globalData.history = [];
      wx.removeStorageSync('liuyao_history');
      console.log('[App] 历史记录已清空');
      return true;
    } catch (e) {
      console.error('[App] 清空历史记录失败:', e);
      return false;
    }
  }
});
