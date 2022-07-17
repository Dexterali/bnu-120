Page({
    data: {
        day: "",
    },
    call: function() {
        let today=new Date();
        let endtime=new Date('2022-9-9 00:00:00');
        let res=endtime-today;
        let day=parseInt(res/1000/60/60/24);
        this.setData({
            day
        })
    },
    onLoad: function(opitons) {
        setInterval(this.call,1000)
    }
})

