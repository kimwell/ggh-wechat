let timer = null;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    endTime: String,
    nowTime: String,
    isAction: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: '',
    end: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    countdowm() {
      let that = this;
      let nT = new Date(this.data.nowTime * 1).getTime();
      let eT = new Date(this.data.endTime * 1).getTime();
        timer = setInterval(function () {
          nT += 1000;
          let t = eT - nT;
          if (t > 0) {
            let day = Math.floor(t / 86400000);
            let hour = Math.floor((t / 3600000) % 24);
            let min = Math.floor((t / 60000) % 60);
            let sec = Math.floor((t / 1000) % 60);
            hour = hour < 10 ? "0" + hour : hour;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;
            let format = hour + ':' + min + ':' + sec;
            that.setData({
              content: format
            })
          } else {
            clearInterval(timer)
            that.setData({
              content: '已结束',
              end: true
            })
            that._callback();
          }
        }, 1000)
    },
    _callback() {
      if (this.callback && this.callback instanceof Function) {
        this.callback(...this);
      }
    },
    action() {
      let that = this;
      let nT = new Date(this.data.nowTime * 1).getTime();
      let eT = new Date(this.data.endTime * 1).getTime();
        nT += 1000;
      let t = eT - nT;
      let day = Math.floor(t / 86400000);
      let hour = Math.floor((t / 3600000) % 24);
      let min = Math.floor((t / 60000) % 60);
      let sec = Math.floor((t / 1000) % 60);
      hour = hour < 10 ? "0" + hour : hour;
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      let format = this.data.isAction ? hour + ':' + min + ':' + sec : hour + ':' + min + ':'+sec;
      that.setData({
        content: format
      })
    }
  },
  ready() {
    this.action();
    if(!this.data.isAction)
      this.countdowm();
  }
})
