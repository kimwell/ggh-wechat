// components/input/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    placeholderShow: {
      type: Boolean,
      value: true
    },
    inType: {
      type: String,
      value: 'text'
    },
    unit: {
      type: String,
      value: ''
    },
    old: {
      type:String,
      value: ''
    },
    disable: {
      type:Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    textIn(e) {
      this.setData({
        value: e.detail.value
      });
      this.triggerEvent('oninput', e.detail.value);
    }
  },
  ready() {
    this.setData({
      value: this.data.old
    })
  }
})
