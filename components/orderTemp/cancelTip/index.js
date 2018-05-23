// components/orderTemp/cancelTip/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        this.init();
      }
    },
    apiUrl: {
      type: String,
      value: 'BuyerCancelReason'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selfShow: false,
    resons: [],
    active: null,
    resout: '',
    other: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getres() {
      app.api.cancelRes({ code: this.data.apiUrl }).then(res => {
        if (res.code === 1000) {
          let arr = [...res.data.vals.split(','), '其他'];
          this.setData({
            resons: arr,
            active: 0
          })
        }
      })
    },
    pick(e) {
      let i = e.currentTarget.dataset.i;
      this.setData({ active: i, resout: this.data.resons[i] });
    },
    asyncOther(e) {
      this.setData({ other: e.detail.value })
    },
    // 取消
    hide() {
      this.setData({ selfShow: false });
      this.triggerEvent('onhide', false);
    },
    // 确定
    sure() {
      let resout = this.data.resons[this.data.active] == '其他' ? this.data.other : this.data.resons[this.data.active];
      this.triggerEvent('onpick', resout);
      this.hide();
    },
    init() {
      this.setData({ selfShow: this.data.show });
      this.getres();
    }
  }
})
