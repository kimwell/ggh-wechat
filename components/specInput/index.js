// components/specInput/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ironType: {
      type: Object,
      value: { id: '', name: '' },
      observer: function (newVal, oldVal) {
        this.setType();
      }
    },
    surface: {
      type: Object,
      value: { id: '', name: '' }
    },
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
    spec: {
      type: String,
      value: '***',
      observer: function (newVal, oldVal) {
        let spec = newVal.split("*");
        this.setData({
          'params.height': spec[0],
          'params.width': spec[1],
          'params.length': spec[2]
        });
      }
    },
    specnormal: {
      type:String,
      value: '',
      observer: function (newVal, oldVal) {
        this.setData({
          'specifications': newVal
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sepcType: false,  //false普通输入框，true 厚宽长
    specPickshow: false,
    rdList: [],
    specifications: '',
    params: {
      ironType: '',
      surface: '',
      width: '',
      length: '',
      height: ''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置状态，是厚宽长还是字符串
    setType() {
      this.setData({
        sepcType: this.data.ironType.name == '不锈钢板' || this.data.ironType.name == '不锈钢卷'
      })
    },
    showPicke() {
      this.setData({
        'specPickshow': true,
        'params.ironType': this.data.ironType.id,
        'params.surface': this.data.surface.id
      });
      let pages = getCurrentPages();
      let nowPage = pages[pages.length - 1];
      nowPage.setData({
        textareaHide: !this.data.specPickshow
      });
      this.getBy5();
    },
    close() {
      this.setData({ specPickshow: false });
      let pages = getCurrentPages();
      let nowPage = pages[pages.length - 1];
      nowPage.setData({
        textareaHide: !this.data.specPickshow
      })
    },
    // 根据多想参数获取推荐
    fillData(event) {
      let index = event.target.dataset.index;
      let data = app.utils.copyData(this.data.rdList[index]);
      if (data.height) {
        this.setData({
          'params.width': data.width,
          'params.length': data.length,
          'params.height': data.height,
          'specifications': ''
        })
      } else {
        this.setData({
          'params.width': data.width,
          'params.length': data.length,
          'specifications': ''
        })
      }
    },
    getBy5() {
      app.api.findIronAndSurfaceAndSpecificationlist(this.data.params).then(res => {
        if (res.code === 1000) {
          this.setData({
            'rdList': res.data
          })
        }
      })
    },
    getBy2() {
      app.api.findIronAndSurfaceAndSpecificationHeightAndLength({
        surface: this.data.params.surface,
        ironType: this.data.params.ironType
      }).then(res => {
        if (res.code === 1000) {
          this.setData({
            'rdList': res.data
          })
        }
      })
    },
    textIn(e){
      this.setData({
        'specifications': e.detail.value,
        'params.width': '',
        'params.height': '',
        'params.length': ''
      });
      this.emitData();
    },
    // 输入参数厚
    bindHeight(e) {
      this.setData({
        'params.height': e.detail.value,
        'specifications': ''
      });
      this.getBy5();
      this.emitData();
    },
    bindWidth(e) {
      this.setData({
        'params.width': e.detail.value,
        'specifications': ''
      });
      if (this.data.params.height != '') {
        this.getBy2();
      } else {
        this.getBy5();
      }
      this.emitData();
    },
    bindLength(e) {
      this.setData({
        'params.length': e.detail.value,
        'specifications': ''
      });
      if (this.data.params.height != '') {
        this.getBy2();
      } else {
        this.getBy5();
      }
      this.emitData();
    },
    emitData(){
      this.triggerEvent('onchange', {
        width: this.data.params.width,
        height: this.data.params.height,
        length: this.data.params.length,
        specifications: this.data.specifications
      });
    },
    save(){
      this.close();
      this.emitData();
    }
  }
})
