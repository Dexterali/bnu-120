Page({
    data: {
        date: "",
        loading: false,
        //旧信息集合
        oldUserInfo: {
            
        },
    },
    onLoad: function (e) {
        //修改或者完善信息时可能没有之前的旧的记录，在这里做一下非空判断，如果有
        //旧的信息则设置oldUserInfo
        if (JSON.stringify(e) != "{}") {
            const oldUserInfo = JSON.parse(e.oldUserInfo)
            console.log(oldUserInfo)
            this.setData({
                oldUserInfo
            })
            console.log(this.data.oldUserInfo)
        }
    },

    //上传到数据库
    submit: function (e) {
        //如果缺少信息：
        if (this.data.loading) {
            return;
        }
        let u = e.detail.value;
        if (!u.name) {
            wx.showToast({
                title: "请输入姓名",
                icon: "error",
            });
            return;
        }
        if (!u.gender) {
            wx.showToast({
                title: "请选择性别",
                icon: "error",
            });
            return;
        }
        if (!u.grade) {
            wx.showToast({
                title: "请选择年级",
                icon: "error",
            });
            return;
        }
        if (!u.phone) {
            wx.showToast({
                title: "请输入联系方式",
                icon: "error",
            });
            return;
        }
        //
        this.setData({
            loading: true,
        });
        wx.showLoading({});


        const db = wx.cloud.database()

        db.collection('user')
            .where({
                _openid: e.detail.value.openid
            })
            .get()
            .then(res => {
                if (res.data.length === 0) {
                    db.collection('user')
                        .add({
                            data: {
                                createdate: this.data.date,
                                name: u.name,
                                gender: u.gender,
                                grade: u.grade,
                                phone: u.phone,
                                // _openid: e.openid
                            }
                        })

                        //连接数据库操作完成之后
                        .then((res) => {
                            console.log("调用成功！", res)
                            wx.hideLoading()

                            //对界面进行操作
                            this.setData({
                                loading: false
                            });
                            wx.hideLoading();
                            //如果成功，则返回
                            if (res.errMsg == "collection.add:ok") {
                                wx.showModal({
                                    title: "提示",
                                    content: "信息修改成功",
                                    success: function () {
                                        wx.navigateBack({
                                            delta: 1,
                                        });
                                    },
                                });
                                // wx.navigateBack({
                                //     delta: 1,
                                // });
                            } else {
                                wx.showModal({
                                    title: "提示",
                                    content: "信息修改失败",
                                    success: function () {
                                        wx.navigateBack({
                                            delta: 1,
                                        });
                                    },
                                });
                            }
                        })
                        .catch(err => {
                            console.log("调用失败！！！！", err)
                        })
                } else {
                    db.collection('user')
                        .where({
                            _openid: e.detail.value.openid
                        })
                        .update({
                            data: {
                                createdate: this.data.date,
                                name: u.name,
                                gender: u.gender,
                                grade: u.grade,
                                phone: u.phone,
                                // _openid: e.openid
                            }
                        })

                        //连接数据库操作完成之后
                        .then((res) => {
                            console.log("调用成功！", res)
                            wx.hideLoading()

                            //对界面进行操作
                            this.setData({
                                loading: false
                            });
                            wx.hideLoading();
                            //如果成功，则返回
                            if (res.errMsg == "collection.update:ok") {
                                // wx.switchTab({
                                //     url: "../user/user",
                                // });
                                // wx.navigateBack({
                                //     delta: 1,
                                // });
                                wx.redirectTo({
                                    url: '../home/home',
                                })
                            } else {
                                wx.showModal({
                                    title: "提示",
                                    content: res.result.errorMessage,
                                    success: function () {
                                        // wx.navigateBack({
                                        //     delta: 1,
                                        // });
                                        wx.redirectTo({
                                            url: '../home/home',
                                        })
                                    },
                                });
                            }
                        })
                        .catch(err => {
                            console.log("调用失败！！！！", err)
                        })
                }
            })
            .catch(err => {
                console.log("调用失败！！！！", err)
            })

    },

    //修改日期，调出日期列表
    dateChange: function (e) {
        this.setData({
            date: e.detail.value,
        });
    },

});