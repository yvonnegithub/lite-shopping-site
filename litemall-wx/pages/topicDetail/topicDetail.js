var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    topic: {},
    topicList: [],
    commentCount: 0,
    commentList: [],
    topicGoods: []
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.setData({
      id: options.id
    });

    util.request(api.TopicDetail, {
      id: that.data.id
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          topic: res.data.topic,
          topicGoods: res.data.goods
        });

        WxParse.wxParse('topicDetail', 'html', res.data.topic.content, that);
      }
    });

    util.request(api.TopicRelated, {
      id: that.data.id
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          topicList: res.data
        });
      }
    });
  },
  // 获取评论列表
  getCommentList() {
    let that = this;
    util.request(api.CommentList, {
      valueId: that.data.id,
      type: 1,
      showType: 0,
      page: 1,
      size: 5
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          commentList: res.data.data,
          commentCount: res.data.count
        });
      }
    });
  },
  // 发表评论
  postComment() {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    } else {
      wx.navigateTo({
        url: '/pages/topicCommentPost/topicCommentPost?valueId=' + this.data.id + '&type=1',
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示时获取评论列表
    this.getCommentList();
  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  }
})