var appInstance = getApp()
// console.log("werweadsfargfavadfv",appInstance.globalData) 
let menuButtonObject = wx.getMenuButtonBoundingClientRect()

Page({
    data: {
        //
        videoList: [],
        // 
        videoInfo: false,
        openId: '',

        // 下拉菜单的数据
        tabType: 'tab1',
        key: 'tab1',
        conditionList: [
            {
                title: '管理员登陆',
                id: '2'
            },
            {
                title: '联系我们',
                id: '3'
            },
            // {
            //     title: '退出登录',
            //     id: '4'
            // },
        ],

        choosedCondition: {
            title: '选项1',
            id: '1'
        },
        conditionVisible: false,

        // 胶囊的数据
        navHeight: '',
        top: '',
        nav: '',
    },

    // 是否展开列表
    showCondition() {
        console.log("展开展开")
        this.setData({
            conditionVisible: !this.data.conditionVisible
        })
    },
    // 根据查询项跳转
    onChnageCondition(e) {
        // console.log("currentTarget.dataset.id::",e.currentTarget.dataset)
        if (e.currentTarget.dataset.id === "2") {
            //管理员登录
            wx.redirectTo({
                url: '../login/login'
            })
        } else if (e.currentTarget.dataset.id === "3") {
            //联系我们
            wx.redirectTo({
                url: '../about/about'
            })
        }
        // else if (e.currentTarget.dataset.id === "4") {
        //     //退出登录
        //     wx.exitMiniProgram({
        //         success: function () {
        //             console.log("bye")
        //         }
        //     })
        // } 
    },
    // ----

    // 上传视频
    gotoUpdate: function () {
        // 跳转至uploadVideo页面
        wx.redirectTo({
            url: '../uploadVideo/uploadVideo'
        })
    },
    //证书
    gotoCertificate: function () {
        /* 
          * 之前的问题在这里就不需要解决了，
          * 因为当用户上传的视频清空时我在下面把videoinfo设置为了false，
          * 这样就不显示生成证书按钮了  
        */
        wx.redirectTo({
            url: '../Certificate/Certificate'
        })
    },
    exit: function (e) {
        wx.showModal({
            title: '提示',
            content: '是否确认退出',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('student');
                    //页面跳转
                    wx.redirectTo({
                        url: '../login/login',
                    })
                } else if (res.cancel) { }
            }
        })
    },
    onLoad: function () {

        this.setData({
            navHeight: appInstance.globalData.navHeight,
            nav: appInstance.globalData.nav,
            top: menuButtonObject.top
        })
        console.log("this.data:", this.data)

        // 数据库，用户信息
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            data: {
                type: 'get_openid_wj'
            }
        }).then((resp) => {
            console.log("调用成功", resp)
            this.setData({
                openId: resp.result.openid
            })
        }).catch((e) => {
            console.log("调用失败")
        });

    },
    onShow() {
        this.getvideolist();
    },
    getvideolist() {
        const that = this
        wx.cloud.database().collection('video').where({
            _openid: that.data.openId
        }).get().then(res => {
            console.log(res)
            //在这里需要判断一下，我们是否拿到了视频数据，而不是看是否调用get成功
            if (res.data.length !== 0) {
                that.setData({
                    videoList: res.data,
                    videoInfo: true
                })
            } else {
                // 如果从数据库没有获得视频则清理一下之前的就记录
                that.setData({
                    videoList: [],
                    videoInfo: false,
                })
            }
        }).catch(res => {
            console.log('fail')
        })
    },
    del(e) {
        const that = this;
        wx.showModal({
            title: '提示',
            content: '确认删除？',
            confirmColor: '#FF0000',
            success(res) {
                if (res.confirm) {
                    that.delvideo(e)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    delvideo(e) {
        console.log("wwwwwwwwwww", e)

        const that = this;
        //改变传入参数e
        e = e.currentTarget.dataset.id
        wx.cloud.callFunction({
            // name: 'delete_video_wj',
            name: 'delvideo',
            data: {
                e
            },
            success(res) {
                console.log(res);
                that.getvideolist();
            },
            fail(err) {
                console.log("false", err)
            }
        })
    },
})