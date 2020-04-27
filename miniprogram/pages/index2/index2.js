// pages/index2/index2.js
var e = require("../../utils/util.js"), time = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TaskId: '',
    video_hidden: true,
    video_url: '',
    button_change: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  submit: function (e) {
    console.log(e.detail.value)
    let now = new Date()
    let timestamp = now.getTime()
    console.log("语音自编id:",timestamp)
    wx.cloud.callFunction({
      name: 'video_edit',
      data: {
        subject: e.detail.value.subject,
        event: e.detail.value.event,
        event2: e.detail.value.event2,
        id:timestamp
      }
    }).then(res => {
      console.log("taskid:", res.result)

      this.setData({
        TaskId: res.result.TaskId,
        button_change: true
      })
    })


  },
  query: function () {
    wx.cloud.callFunction({
      name: 'video_query',
      data: {
        TaskId: this.data.TaskId
      }
    }).then(res => {
      console.log('查询视频生成进度', res.result)
      if (res.result.Status == 'FINISH') {
        console.log(res.result.ComposeMediaTask.Output.FileUrl)
        this.setData({
          video_url: res.result.ComposeMediaTask.Output.FileUrl,
          video_hidden: false
        })
        wx.setClipboardData({
          data: 'res.result.ComposeMediaTask.Output.FileUrl',
        })

      } else {
        wx.showModal({
          title: '提示',
          content: '任务已提交,请耐心等待',
          showCancel: false
        })
      }

    })
  }
})