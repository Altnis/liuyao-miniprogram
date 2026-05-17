/**
 * 历史记录页逻辑
 * 展示、管理历史占卜记录
 */

Page({
  data: {
    // 历史记录列表
    historyList: [],

    // 是否正在加载
    isLoading: true,

    // 是否处于编辑模式
    isEditing: false,

    // 选中的记录索引
    selectedIndexes: []
  },

  onLoad: function() {
    this.loadHistory();
  },

  onShow: function() {
    // 每次显示页面时重新加载
    this.loadHistory();
  },

  /**
   * 加载历史记录
   */
  loadHistory: function() {
    this.setData({ isLoading: true });

    try {
      var app = getApp();
      var history = app.getHistory() || [];

      // 格式化历史记录用于显示
      var historyList = [];
      for (var i = 0; i < history.length; i++) {
        var record = history[i];
        historyList.push({
          id: record.id || i.toString(),
          date: record.date || this.formatTimestamp(record.timestamp),
          guaName: record.guaName || '未知卦',
          guaXuhao: record.guaXuhao || 0,
          index: i,
          selected: false
        });
      }

      this.setData({
        historyList: historyList,
        isLoading: false
      });
    } catch (e) {
      console.error('加载历史记录失败:', e);
      this.setData({
        historyList: [],
        isLoading: false
      });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  /**
   * 格式化时间戳
   * @param {number} timestamp 时间戳
   * @returns {string} 格式化日期
   */
  formatTimestamp: function(timestamp) {
    if (!timestamp) return '未知时间';

    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hour = String(date.getHours()).padStart(2, '0');
    var minute = String(date.getMinutes()).padStart(2, '0');

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  },

  /**
   * 查看历史记录详情
   */
  onViewDetail: function(e) {
    if (this.data.isEditing) {
      this.toggleSelection(e.currentTarget.dataset.index);
      return;
    }

    var index = e.currentTarget.dataset.index;
    var record = this.data.historyList[index];
    if (!record) return;

    try {
      var app = getApp();
      var fullRecord = app.globalData.history[record.index];

      if (fullRecord && fullRecord.fullGuaData) {
        // 保存到本地存储，让结果页读取
        wx.setStorageSync('currentGuaData', fullRecord.fullGuaData);
        wx.navigateTo({
          url: '/pages/result/result'
        });
      } else {
        wx.showToast({ title: '记录数据不完整', icon: 'none' });
      }
    } catch (e) {
      console.error('查看详情失败:', e);
      wx.showToast({ title: '查看失败', icon: 'none' });
    }
  },

  /**
   * 切换选中状态
   * @param {number} index 记录索引
   */
  toggleSelection: function(index) {
    var historyList = this.data.historyList;
    var selectedIndexes = this.data.selectedIndexes.slice();

    historyList[index].selected = !historyList[index].selected;

    if (historyList[index].selected) {
      selectedIndexes.push(index);
    } else {
      var idx = selectedIndexes.indexOf(index);
      if (idx > -1) {
        selectedIndexes.splice(idx, 1);
      }
    }

    this.setData({
      historyList: historyList,
      selectedIndexes: selectedIndexes
    });
  },

  /**
   * 切换编辑模式
   */
  toggleEditMode: function() {
    var newEditing = !this.data.isEditing;

    // 清空选中状态
    var historyList = this.data.historyList;
    for (var i = 0; i < historyList.length; i++) {
      historyList[i].selected = false;
    }

    this.setData({
      isEditing: newEditing,
      selectedIndexes: [],
      historyList: historyList
    });
  },

  /**
   * 删除选中记录
   */
  deleteSelected: function() {
    if (this.data.selectedIndexes.length === 0) {
      wx.showToast({ title: '请选择要删除的记录', icon: 'none' });
      return;
    }

    var that = this;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除选中的' + that.data.selectedIndexes.length + '条记录吗？',
      success: function(res) {
        if (res.confirm) {
          that.doDeleteSelected();
        }
      }
    });
  },

  /**
   * 执行删除选中记录
   */
  doDeleteSelected: function() {
    try {
      var app = getApp();
      var selectedIndexes = this.data.selectedIndexes.slice();

      // 从后往前删除，避免索引偏移
      selectedIndexes.sort(function(a, b) { return b - a; });
      for (var i = 0; i < selectedIndexes.length; i++) {
        app.globalData.history.splice(selectedIndexes[i], 1);
      }

      // 保存到本地存储
      wx.setStorageSync('liuyao_history', app.globalData.history);

      wx.showToast({ title: '删除成功', icon: 'success' });

      // 重新加载
      this.toggleEditMode();
      this.loadHistory();
    } catch (e) {
      console.error('删除记录失败:', e);
      wx.showToast({ title: '删除失败', icon: 'none' });
    }
  },

  /**
   * 清空所有历史记录
   */
  clearAllHistory: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有历史记录吗？此操作不可恢复。',
      confirmColor: '#e94560',
      success: function(res) {
        if (res.confirm) {
          try {
            var app = getApp();
            app.clearHistory();
            wx.showToast({ title: '已清空', icon: 'success' });
            this.loadHistory();
          } catch (e) {
            console.error('清空历史记录失败:', e);
            wx.showToast({ title: '清空失败', icon: 'none' });
          }
        }
      }.bind(this)
    });
  },

  /**
   * 返回首页
   */
  goBack: function() {
    wx.navigateBack({ delta: 1 });
  },

  /**
   * 分享
   */
  onShareAppMessage: function() {
    return {
      title: '六爻占卜 - 查看历史记录',
      path: '/pages/index/index'
    };
  }
});
