// components/ajaxPicker/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    api: {
      type: String,
      value: ''
    },
    multi: {
      type: Boolean,
      value: false
    },
    old: {
      type: String,
      value: ''
    },
    className:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    list: [],
    active: null,
    resoutList: [],
    multiValue: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    togglePicker() {
      if (!this.data.show && this.data.list.length == 0)
        this.getList();
      this.setData({ show: !this.data.show });
      let pages = getCurrentPages();
      let nowPage = pages[pages.length - 1];
      nowPage.setData({
        textareaHide: !this.data.show
      })
    },
    close() {
      if (this.data.multi) return
      this.togglePicker();
    },
    getList(func) {
      if (this.data.api == '') return
      app.api[this.data.api]().then(res => {
        if (res.code === 1000) {
          let list = res.data;
          if (this.data.multi)
            list = list.map(item => {
              item.selected = false;
              return item
            })
          this.setData({
            'list': list
          })
          if (func) func()
        }
      })
    },
    initSelected(newVal) {
      setTimeout(() => {
        // 多选、单选
        if (this.data.multi) {
          let selectItems = newVal.split(',');
          let str = ''
          let newList = this.data.list.map(item => {
            if (selectItems.findIndex(el => el == item.name) > -1) {
              item.selected = true;
              str += item.name + ';'
            }
            return item
          })
          
          this.setData({
            list: newList,
            multiValue: str
          })
        } else {
          this.setData({
            active: this.data.list.findIndex(item => item.name == newVal)
          })
        }
      }, 500)
    },
    picke(event) {
      let index = event.target.dataset.index;
      if (this.data.multi) {
        // 如果是不限、选中的时候把其他的都取消
        if (this.data.list[index].name == '不限' && !this.data.list[index].selected) {
          let newList = this.data.list.map(item => {
            item.selected = false;
            return item
          });
          this.setData({
            list: newList
          })
        } else {
          let bxIndex = this.data.list.findIndex(item => item.name == '不限');
          if (bxIndex >= 0)
            this.setData({
              [`list[${bxIndex}].selected`]: false
            })
        }

        let pickeItem = `list[${index}].selected`;
        this.setData({
          [pickeItem]: !this.data.list[index].selected
        });
      } else {
        this.setData({
          active: index
        });
        let item = app.utils.copyData({ id: this.data.list[index].id, name: this.data.list[index].name });
        this.triggerEvent('onpick', item);
        this.togglePicker();
      }
    },
    pickOk() {
      let str = '', selectList = [];
      this.data.list.map(item => {
        if (item.selected) {
          str += item.name + ';';
          selectList.push(item);
        }
      });
      this.setData({
        resoutList: selectList,
        multiValue: str
      })
      this.triggerEvent('onpick', selectList);
      this.togglePicker();
    }
  },
  ready() {
    if (this.data.old != '') {
      if (this.data.list.length == 0) {
        this.getList(this.initSelected(this.data.old));
      } else {
        this.initSelected(this.data.old)
      }
    }
  }
})
