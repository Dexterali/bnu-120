var appInstance = getApp()
// console.log("werweadsfargfavadfv",appInstance.globalData) 
let menuButtonObject = wx.getMenuButtonBoundingClientRect()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        // 头像
        avatarUrl: defaultAvatarUrl,
        //
        videoList: [],
        // 
        userList: [],
        // 
        info: false,
        videoInfo: false,
        openId: '',

        // 下拉菜单的数据
        tabType: 'tab1',
        key: 'tab1',
        conditionList: [
            {
                title: '修改信息',
                id: '1'
            },
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
            {
                title: '注销账户',
                id: '5'
            },
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

    // ----
    //完善个人信息界面
    upInfo: function () {
        const that = this
        //提示用户先完善个人信息
        wx.showModal({
            title: "提示",
            content: "这将收集你的信息！是否继续？点击取消将为你生成预设信息",
            success: function (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '../message/message',
                    }).then(res => {
                        console.log(res)
                        if (res.errMsg === 'navigateTo:ok') {
                            that.onShow()
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                    let createtime = new Date()
                    createtime = createtime.toLocaleDateString()
                    let autoUserInfo = {
                        createdate: createtime,
                        name: "校友",
                        grade: "2019",
                        phone: "12345",
                    }
                    wx.cloud.database()
                        .collection('user')
                        .add({
                            data: autoUserInfo
                        }).then(res => {
                            console.log("成功")
                            that.onShow()
                        })
                        .catch(err => {
                            console.log("失败")
                        })
                }
            }
            // ,
            // fail: function() {

            // }
        });
        // wx.navigateTo({
        //     url: '../message/message',
        // }).then(res => {
        //     console.log(res)
        //     if (res.errMsg === 'navigateTo:ok') {
        //         // this.setData({
        //         //     info: true
        //         // })
        //         this.onShow()
        //     }
        // })
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

        if (e.currentTarget.dataset.id === "1") {
            const that = this
            //如果之前没有改用户，则不应该让用户修改个人信息，在这里加以限制
            if (this.data.userList.length != 0) {
                const oldUserInfo = JSON.stringify(this.data.userList[0]);
                console.log(oldUserInfo)
                wx.redirectTo({
                    url: '../message/message?oldUserInfo=' + oldUserInfo,
                })
            } else {
                //提示用户先完善个人信息
                wx.showModal({
                    title: "提示",
                    content: "请先完善信息",
                    success: function () {
                        that.setData({
                            conditionVisible: !that.data.conditionVisible
                        })
                    },
                });
            }

        } else if (e.currentTarget.dataset.id === "2") {
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
        else if (e.currentTarget.dataset.id === "5") {
            //注销登录
            const that = this
            //询问用户是否注销账户
            wx.showModal({
                title: "提示",
                content: "这将删除你的个人信息和上传的视频！是否继续？",
                success: function (res) {
                    if (res.confirm) {
                        wx.cloud.database()
                            .collection('user')
                            .where({
                                _openid: that.data.openId
                            })
                            .remove()
                            .then(res => {
                                console.log("成功")
                                that.showCondition()
                                that.onShow()
                            })
                            .catch(err => {
                                console.log("失败")
                            })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
        }


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
        // if (this.data.userList.length === 0) {
        //     wx.showModal({
        //         title: "提示",
        //         content: "请先上传视频！",
        //     });
        // } else {
        // wx.redirectTo({
        //     url: '../Certificate/Certificate'
        // })
        // }
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

    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail
        this.setData({
            avatarUrl,
        })
    },
    getUserInfo() {
        //进行数据库操作
        console.log("openid：", this.data.openId)
        const db = wx.cloud.database()
        db.collection('user')
            .where({
                _openid: this.data.openId
            })
            .get()
            .then(res => {
                console.log("ahahhahh", res)
                console.log(this.data.openId)
                //在这里需要判断一下，我们是否拿到了用户数据，而不是看是否调用get成功
                if (res.data.length !== 0) {
                    this.setData({
                        userList: res.data,
                        info: true
                    })
                    console.log(this.data.userList)
                } else {
                    //如果没有数据，为了保障不出错，清空一下之前的记录
                    this.setData({
                        userList: '',
                        info: false
                    })
                }
            })
            .catch(err => {
                console.log(err + "请求失败")
            })

    },
    onShow() {
        this.getUserInfo();
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
    // delvideo(e) {
    //     const that = this;
    //     console.log(e);
    //     wx.cloud.deleteFile({
    //         fileList: [e.currentTarget.dataset.id.videourl],
    //     }).then(res => {
    //         // console.log("del file success")
    //     }).catch(err => {
    //         console.error("del file fail")
    //     });
    //     wx.cloud.database().collection('video').doc(e.currentTarget.dataset.id._id).remove({
    //         success(res) {
    //             that.getvideolist()
    //         },
    //         fail(res) {
    //             console.log("del fail")
    //         }
    //     });

    // }
})