//index.js
//获取应用实例
const app = getApp()
let flag = true;
Page({
  data: {
    motto: 'Pull down to create',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    createList: false,
    myTask: '',
    myTaskList: []
  },
  //事件处理函数
  bindAvatarTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  catchMottoTap: function() {
    if(flag) {
      this.setData({
        motto: '下拉新建事项'
      });
      flag = false;
    } else {
      this.setData({
        motto: 'Pull down to create'
      });
      flag = true;
    }
  },

  onPullDownRefresh: function() {
    this.setData({ createList: true })
  },

  bindToCreate: function(event) {
    this.setData({myTask: event.detail.value});
  },

  bindToConfirm: function () {
    if(this.data.myTask.length === 0) {
      this.setData({createList: false});
    } else {
      let newList = this.data.myTaskList;
      newList.unshift({
        id: Date.now(),
        text: this.data.myTask,
        done: false
      })
      this.setData({
        myTaskList: newList,
        myTask: "",
        createList: false
      });
      wx.setStorageSync('myTaskList', newList);
    }
  },

  bindToFinish: function(e) {
    const myTaskList = this.data.myTaskList;
    const indexToFinish = myTaskList.findIndex(element => element.id == e.currentTarget.id);
    myTaskList[indexToFinish].done = !myTaskList[indexToFinish].done
    
    this.setData({
      myTaskList
    });
    wx.setStorageSync('myTaskList', myTaskList);
  },

  bindToEdit: function(e) {
    const myTaskList = this.data.myTaskList;
    const indexToEdit = myTaskList.findIndex(element => element.id == e.currentTarget.id);
    const updatedTaskList = [...myTaskList];
    updatedTaskList.splice(indexToEdit, 1)
   
    this.setData({
      createList:true,
      myTask: myTaskList[indexToEdit].text,
      myTaskList: updatedTaskList
    });
  },

  bindToRemove: function(e) {  
    var that = this;
    wx.showModal({
      content: 'Are you sure remove the task ?',
      cancelText: 'Cancel',
      cancelColor: '#808080',
      confirmText: 'Confirm',
      confirmColor: '#000000',
      success (res) {
        if (res.confirm) {  
          const myTaskList = that.data.myTaskList;
          const indexToRemove = myTaskList.findIndex(element => element.id == e.currentTarget.id);
          const updatedTaskList = [...myTaskList];
          updatedTaskList.splice(indexToRemove, 1) 

          that.setData({
            myTaskList: updatedTaskList
          });
          wx.setStorageSync('myTaskList', updatedTaskList);

        }
      }
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onShow: function() {
    this.setData({
      myTaskList: wx.getStorageSync('myTaskList') || []
  });
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
