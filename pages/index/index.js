// pages/index/index.js
// 首页逻辑 - 起卦页
// 实现龟壳点击动画、6次起卦流程、摇一摇起卦、跳转结果页

var liuyao = require('../../utils/liuyao.js');
var guaData = require('../../utils/guaData.js');
var tianganDizhi = require('../../utils/tianganDizhi.js');

// 摇一摇检测参数
var SHAKE_THRESHOLD = 15; // 加速度阈值（适当降低以提高灵敏度）
var SHAKE_INTERVAL = 400; // 两次摇动最小间隔(ms)

Page({
  data: {
    isDivining: false,       // 是否正在起卦
    currentYaoIndex: 0,      // 当前爻位(0-5, 对应初爻到上爻)
    yaoResults: [],          // 爻结果数组
    yaoDisplay: [],          // 爻显示数据
    showResult: false,       // 是否显示当前爻结果
    currentYaoResult: null,  // 当前爻结果值
    progress: 0,             // 进度百分比
    progressText: '点击龟壳开始排盘', // 进度文字
    canClick: true,          // 是否可点击
    turtleShaking: false,    // 龟壳是否在摇晃
    showRitual: false        // 是否显示起卦仪式提示
  },

  // 摇一摇相关状态
  _lastShakeTime: 0,
  _lastAccel: { x: 0, y: 0, z: 0 },
  // 仪式是否已完成（内部标记，不在data中以避免不必要渲染）
  _ritualDone: false,

  onLoad: function() {
    this.initDivination();
  },

  onShow: function() {
    // 开启加速度计，用于摇一摇
    var that = this;
    try {
      // 先停止再启动，避免重复注册
      wx.stopAccelerometer();
      wx.onAccelerometerChange(function(res) {
        that.onAccelerometerChange(res);
      });
      wx.startAccelerometer({
        interval: 'game',
        success: function() {
          console.log('[摇一摇] 加速度计已启动(game模式)');
        },
        fail: function(err) {
          console.warn('[摇一摇] game模式失败，尝试ui模式:', err);
          wx.startAccelerometer({
            interval: 'ui',
            success: function() {
              console.log('[摇一摇] 加速度计已启动(ui模式)');
            },
            fail: function(err2) {
              console.warn('[摇一摇] ui模式失败，尝试normal模式:', err2);
              wx.startAccelerometer({
                interval: 'normal',
                fail: function(err3) {
                  console.error('[摇一摇] 加速度计完全不可用:', err3);
                }
              });
            }
          });
        }
      });
    } catch (e) {
      console.error('[摇一摇] 加速度计初始化异常:', e);
    }
  },

  onHide: function() {
    // 停止加速度计
    try {
      wx.stopAccelerometer();
    } catch (e) {
      // 忽略
    }
  },

  onUnload: function() {
    try {
      wx.stopAccelerometer();
    } catch (e) {
      // 忽略
    }
  },

  /**
   * 加速度变化回调 - 检测摇一摇
   */
  onAccelerometerChange: function(res) {
    // 不在可排盘状态时忽略
    if (!this.data.canClick || this.data.isDivining || this.data.currentYaoIndex >= 6) {
      return;
    }

    var now = Date.now();
    if (now - this._lastShakeTime < SHAKE_INTERVAL) {
      return;
    }

    // 计算加速度变化量
    var deltaX = Math.abs(res.x - this._lastAccel.x);
    var deltaY = Math.abs(res.y - this._lastAccel.y);
    var deltaZ = Math.abs(res.z - this._lastAccel.z);

    this._lastAccel = { x: res.x, y: res.y, z: res.z };

    // 判断是否达到摇一摇阈值
    if (deltaX + deltaY + deltaZ > SHAKE_THRESHOLD) {
      this._lastShakeTime = now;
      console.log('[摇一摇] 检测到摇动，加速度变化:', (deltaX + deltaY + deltaZ).toFixed(1));

      // 震动反馈
      try {
        wx.vibrateShort({ type: 'medium' });
      } catch (e) {}

      // 关闭仪式弹窗（如果正在显示）
      if (this.data.showRitual) {
        this._ritualDone = true;
        this.setData({ showRitual: false });
      }

      // 直接触发排盘
      this.startDivination();
    }
  },

  /**
   * 初始化起卦状态
   */
  initDivination: function() {
    this._ritualDone = false;
    this.setData({
      isDivining: false,
      currentYaoIndex: 0,
      yaoResults: [],
      yaoDisplay: [],
      showResult: false,
      currentYaoResult: null,
      progress: 0,
      progressText: '点击龟壳开始排盘',
      canClick: true,
      turtleShaking: false,
      showRitual: false
    });
  },

  /**
   * 点击仪式提示层 - 关闭浮层并自动开始起卦
   */
  onRitualTap: function() {
    this._ritualDone = true;
    this.setData({ showRitual: false });
    // 震动反馈
    try {
      wx.vibrateShort({ type: 'light' });
    } catch (e) {}
    // 仪式完成，自动开始第一爻
    this.startDivination();
  },

  /**
   * 点击龟壳
   */
  onTurtleTap: function() {
    // 已完成6爻，优先处理重新开始
    if (this.data.currentYaoIndex >= 6) {
      this.initDivination();
      return;
    }

    if (!this.data.canClick) return;

    // 首次起卦显示仪式提示
    if (this.data.currentYaoIndex === 0 && !this._ritualDone && !this.data.isDivining) {
      this.setData({ showRitual: true });
      return;
    }

    this.startDivination();
  },

  /**
   * 开始一次摇卦
   */
  startDivination: function() {
    var that = this;
    var currentIndex = this.data.currentYaoIndex;

    // 防止重复触发
    if (!this.data.canClick || this.data.isDivining) return;

    // 播放龟壳摇晃动画
    this.setData({
      isDivining: true,
      canClick: false,
      turtleShaking: true,
      progressText: '正在排第' + (currentIndex + 1) + '爻...',
      showResult: false
    });

    // 动画持续0.8秒后显示结果
    setTimeout(function() {
      try {
        var yaoResult = liuyao.generateYao();

        var newResults = that.data.yaoResults.concat([yaoResult]);
        var newDisplay = that.data.yaoDisplay.concat([{
          position: currentIndex + 1,
          value: yaoResult,
          typeName: liuyao.getYaoTypeName(yaoResult),
          yinYang: liuyao.getYaoYinYang(yaoResult),
          isChange: liuyao.isYaoChangeable(yaoResult)
        }]);

        var newProgress = Math.round((currentIndex + 1) / 6 * 100);
        var newProgressText = currentIndex < 5
          ? '第' + (currentIndex + 1) + '爻成，还剩' + (5 - currentIndex) + '爻'
          : '排盘完成！';

        that.setData({
          currentYaoIndex: currentIndex + 1,
          yaoResults: newResults,
          yaoDisplay: newDisplay,
          currentYaoResult: yaoResult,
          showResult: true,
          progress: newProgress,
          progressText: newProgressText,
          isDivining: false,
          turtleShaking: false,
          canClick: true
        });

        // 震动反馈（轻）
        try {
          wx.vibrateShort({ type: 'light' });
        } catch (e) {
          // 忽略
        }

        // 如果6爻全部完成
        if (currentIndex >= 5) {
          that.setData({
            canClick: false,
            progressText: '排盘完成！正在生成结果...',
            showRitual: false
          });
          setTimeout(function() {
            that.onDivinationComplete();
          }, 1000);
        }
      } catch (e) {
        console.error('[起卦] 生成爻失败:', e);
        wx.showToast({ title: '排盘失败，请重试', icon: 'none' });
        that.setData({
          isDivining: false,
          turtleShaking: false,
          canClick: true,
          progressText: '排盘失败，请重试'
        });
      }
    }, 800);
  },

  /**
   * 起卦完成，构建完整数据并跳转
   */
  onDivinationComplete: function() {
    try {
      var yaoResults = this.data.yaoResults;

      // 方法1: 使用 guaData.getGuaByYaoResults
      var guaInfo = guaData.getGuaByYaoResults(yaoResults);

      // 方法2 (后备): 使用 calculateGuaXuhao
      if (!guaInfo) {
        var guaXuhao = liuyao.calculateGuaXuhao(yaoResults);
        guaInfo = guaData.getGuaByXuhao(guaXuhao);
      }

      // 方法3 (最后后备): 直接遍历 binary 字段
      if (!guaInfo) {
        var yangYinStr = liuyao.yaoToBinary(yaoResults);
        var allGua = guaData.getAllGuaData();
        for (var i = 0; i < allGua.length; i++) {
          var g = allGua[i];
          if (!g.binary || g.binary.length !== 6) continue;
          if (yangYinStr === g.binary || yangYinStr === g.binary.split('').reverse().join('')) {
            guaInfo = g;
            break;
          }
        }
      }

      if (!guaInfo) {
        wx.showToast({ title: '未知卦例，请重试', icon: 'none' });
        this.setData({ canClick: true });
        return;
      }

      // 构建完整卦象数据
      var fullGuaData = this.buildGuaData(guaInfo);

      // 保存到本地存储
      try {
        wx.setStorageSync('currentGuaData', fullGuaData);
      } catch (e) {
        console.error('[起卦完成] 保存数据失败:', e);
        wx.showToast({ title: '数据保存失败', icon: 'none' });
        return;
      }

      // 保存到历史记录
      this.saveToHistory(fullGuaData);

      // 跳转到结果页
      wx.navigateTo({
        url: '/pages/result/result',
        fail: function(e) {
          console.error('[起卦完成] 跳转失败:', e);
          wx.showToast({ title: '跳转失败', icon: 'none' });
        }
      });
    } catch (e) {
      console.error('[起卦完成] 处理失败:', e);
      wx.showToast({ title: '处理失败: ' + (e.message || e), icon: 'none' });
      this.setData({ canClick: true });
    }
  },

  /**
   * 构建完整卦象数据对象
   * @param {Object} guaInfo 卦基本信息
   * @returns {Object} 完整卦象数据
   */
  buildGuaData: function(guaInfo) {
    return {
      guaName: guaInfo.name,
      guaXuhao: guaInfo.xuhao,
      guaType: '本卦',
      yaoResults: this.data.yaoResults,
      yaoDisplay: this.data.yaoDisplay,
      guaci: guaInfo.guaci,
      tuanci: guaInfo.tuanci || '',
      xiangci: guaInfo.xiangci || guaInfo.da_xiang || '',
      yaoci: guaInfo.yaoci || [],
      xiaoxiang: guaInfo.xiaoxiang || [],
      explanations: guaInfo.explanations,
      binary: guaInfo.binary,
      divinationTime: this.getFormattedTime(),
      dayGanZhi: this.getDayGanZhi()
    };
  },

  /**
   * 获取格式化的当前时间
   * @returns {string} 格式化日期
   */
  getFormattedTime: function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    var hour = String(now.getHours()).padStart(2, '0');
    var minute = String(now.getMinutes()).padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  },

  /**
   * 获取当日的天干地支
   * @returns {Object} {tiangan, dizhi}
   */
  getDayGanZhi: function() {
    var now = new Date();
    var result = tianganDizhi.getDayGanZhi(now.getFullYear(), now.getMonth() + 1, now.getDate());
    return {
      tiangan: result.tiangan,
      dizhi: result.dizhi
    };
  },

  /**
   * 保存到历史记录
   * @param {Object} guaObj 卦象数据
   */
  saveToHistory: function(guaObj) {
    try {
      var app = getApp();
      var record = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        date: guaObj.divinationTime,
        guaName: guaObj.guaName,
        guaXuhao: guaObj.guaXuhao,
        yaoResults: guaObj.yaoResults,
        fullGuaData: guaObj
      };
      app.saveHistory(record);
    } catch (e) {
      console.error('保存历史记录失败:', e);
    }
  },

  /**
   * 查看历史记录
   */
  onViewHistory: function() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  /**
   * 分享
   */
  onShareAppMessage: function() {
    return {
      title: '周易学习 - 六爻排盘',
      path: '/pages/index/index'
    };
  }
});
