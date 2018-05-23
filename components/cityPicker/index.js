// components/cityPicker/index.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String,
            value: ''
        },
        level: {
            type: Number,
            value: 1
        },
        old: {
          type:String,
          value:''
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
        plh:'请选择',
        show: false,
        tabs: [{
            label: '请选择',
            active: null,
            api: 'findProvince',
            list: []
        }, {
            label: '请选择',
            active: null,
            api: 'findCity',
            list: []
        }, {
            label: '请选择',
            active: null,
            api: 'findDistrict',
            list: []
        }],
        activeTab: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        openPicker() {
            this.setData({ show: true });
            let pages = getCurrentPages();
            let nowPage = pages[pages.length - 1];
            nowPage.setData({
                textareaHide: !this.data.show
            })
            if (this.data.tabs[0].list.length == 0 && this.data.show)
                this.getList()
        },
        // 切换tab
        switchTab(event) {
            let index = event.target.dataset.index;
            if (this.data.activeTab == index) return
            this.setData({
                activeTab: index
            });
        },
        // 获取列表，根据activeTab
        getList() {
            let apiMethod = this.data.tabs[this.data.activeTab].api;
            let pId = "";
            if (this.data.activeTab > 0) {
                let parent = this.data.tabs[this.data.activeTab - 1];
                pId = parent.list[parent.active].id;
            }

            let targetList = 'tabs[' + this.data.activeTab + '].list';
            app.api[apiMethod](pId).then(res => {
                if (res.code === 1000) {
                    // console.log(res)
                    this.setData({
                        [targetList]: res.data
                    })
                }
            })
        },
        // 选择省市
        pick(event) {
            // 当前点击对象下标
            let index = event.target.dataset.index;
            // 当前操作的list
            let activeList = this.data.tabs[this.data.activeTab];
            // 当前选中的数据
            let pickItem = activeList.list[index];
            let listActive = 'tabs[' + this.data.activeTab + '].active';
            let lsitActiveName = 'tabs[' + this.data.activeTab + '].label';

            // 判断是否选中完毕？activeTab是否等于level
            if (this.data.activeTab < this.data.level) {
                // 跳转下一级操作
                // 要更新的数据的key
                let updateTabIndex = this.data.activeTab + 1;
                let nextActive = 'tabs[' + updateTabIndex + '].active';
                let nextActiveName = 'tabs[' + updateTabIndex + '].label';
                this.setData({
                    activeTab: updateTabIndex,
                    [listActive]: index,
                    [lsitActiveName]: pickItem.shortName,
                    [nextActive]: null,
                    [nextActiveName]: '请选择'
                });
                this.getList();
            } else {
                // 完成选择操作
                this.setData({
                    [listActive]: index,
                    [lsitActiveName]: pickItem.shortName
                });

                let pickArr = [];
                this.data.tabs.forEach((item, i) => {
                    if (item.active != null) {
                        pickArr.push({
                            id: item.list[item.active].id,
                            name: item.list[item.active].name
                        })
                    }
                })
                let item = app.utils.copyData({
                    id: pickItem.id,
                    name: pickItem.shortName,
                    pickArr: pickArr
                });
                this.triggerEvent('onpick', item);
                this.close();
            }
        },
        close() {
            this.setData({
                'show': false
            });
            let pages = getCurrentPages();
            let nowPage = pages[pages.length - 1];
            nowPage.setData({
                textareaHide: !this.data.show
            })
        }
    },
    ready(){
      if (this.data.old != '') {
        this.setData({
          plh: this.data.old
        })
      }
    }
})