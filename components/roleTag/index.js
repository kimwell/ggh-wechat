// components/roleTag/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    role: {
      type: String,
      value: '1'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    roleArr: []
  },
  ready() {
    this.setData({
      roleArr: this.data.role.split(',')
    })
  }
})
