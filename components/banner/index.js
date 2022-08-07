// components/banner/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    carouselList:[
      {
        "id": "101",
        "img": "/images/login/1202.png",
        "title": "",
        "url": ""
    },
    {
        "id": "102",
        "img": "/images/zhufu.jpg",
        "title": "",
        "url": ""
    }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击了轮播图
    chomeCarouselClick: function (event) {
      var urlStr = event.currentTarget.dataset.url;
      console.log("点击了轮播图：" + urlStr);
      wx.navigateTo({
        url: urlStr
      })
    }
  }
})
