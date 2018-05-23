// components/grade/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    level: {
      type: String,
      value: '',
      observer: function (newVal, oldVal) {
        let levelData = newVal;
        if (levelData === "50万") {
          this.setData({ className: 'grade1' })
        } else if (levelData === "100万") {
          this.setData({ className: 'grade2' })
        } else if (levelData === "500万") {
          this.setData({ className: 'grade3' })
        }
      }
    },
    empty: {// 是否显示暂无
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    className: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
