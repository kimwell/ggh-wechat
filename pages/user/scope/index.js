const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      title: '种类',
      key: 'ironType',
      arr: [],
    }, {
      title: '材质',
      key: 'material',
      arr: [],
    }, {
      title: '表面',
      key: 'surface',
      arr: [],
    }, {
      title: '产地',
      key: 'proPlace',
      arr: [],
    }],
    apiData: {
      ironType: [],
      material: [],
      surface: [],
      proPlace: []
    },
    checkArr: []
  },
  //  选中
  selectItem(e) {
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    let sub = e.currentTarget.dataset.sub;
    let pid = e.currentTarget.dataset.pid
    let apiArr = this.data.apiData[item.key]
    let listDataArr = this.data.list[pid].arr[index];
    let listArr = this.data.list[pid].arr;
    if (sub.isCheck) {
      apiArr.splice(apiArr.findIndex(v => v.id == item.arr[index].id), 1);
    } else {
      sub.isCheck = !sub.isCheck;
      this.data.apiData[item.key].push(sub);
    }
    listDataArr.isCheck = !listDataArr.isCheck
    this.setData({
      list: this.data.list
    })
    if (apiArr.length == listArr.length) {
      this.data.checkArr[pid] = true
      this.setData({
        checkArr: this.data.checkArr
      })
    } else {
      this.data.checkArr[pid] = false
      this.setData({
        checkArr: this.data.checkArr
      })
    }
  },
  //  全选
  checkAll(e) {
    let idx = e.currentTarget.dataset.index;
    this.data.checkArr[idx] = !this.data.checkArr[idx]
    this.setData({
      checkArr: this.data.checkArr
    })
    let isCheck = this.data.checkArr[idx];
    if (isCheck) {
      this.data.apiData[this.data.list[idx].key] = [];
      this.data.list[idx].arr.forEach(el => {
        el.isCheck = true;
      })
      let data = this.data.list[idx].arr
      data.forEach(el => {
        this.data.apiData[this.data.list[idx].key].push({
          id: el.id,
          name: el.name
        })
      })
    } else {
      this.data.apiData[this.data.list[idx].key] = [];
      this.data.list[idx].arr.forEach(el => {
        el.isCheck = false;
      })
    }
    this.setData({
      list: this.data.list,
      checkArr: this.data.checkArr
    })
  },
  //  保存经营范围
  pbBtn() {
    let params = JSON.parse(JSON.stringify(this.data.apiData));
    Object.keys(params).forEach(function (key) {
      params[key] = JSON.stringify(params[key])
    });
    wx.showModal({
      title: '保存',
      content: '确认保存经营范围？',
      success(res) {
        if (res.confirm) {
          app.api.saveBusinessScope(params).then(res => {
            if (res.code === 1000) {
              wx.showToast({
                title: '保存成功',
                icon: 'none'
              })
              wx.navigateBack({
                delta:1
              })
            }else{
              wx.showToast({
                title: res.message,
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  材质
    app.api.findMaterials().then(res => {
      if (res.code === 1000) {
        res.data.map((n) => {
          return n.isCheck = false
        });
        that.data.list[1].arr = res.data
        that.setData({
          list: that.data.list
        })
      }
    })
    //  种类
    app.api.findIronTypes().then(res => {
      if (res.code === 1000) {
        res.data.map((n) => {
          return n.isCheck = false
        });
        that.data.list[0].arr = res.data
        that.setData({
          list: that.data.list
        })
      }
    })
    // 表面
    app.api.findSurFace().then(res => {
      if (res.code === 1000) {
        res.data.map((n) => {
          return n.isCheck = false
        });
        that.data.list[2].arr = res.data
        that.setData({
          list: that.data.list
        })
      }
    })
    //  产地
    app.api.findProPlaces().then(res => {
      if (res.code === 1000) {
        res.data.map((n) => {
          return n.isCheck = false
        });
        that.data.list[3].arr = res.data
        that.setData({
          list: that.data.list
        })
      }
    })
    //  查询经营范围
    app.api.findBusinessScope().then(res => {
      if (res.code === 1000) {
        this.data.apiData.ironType = res.data.ironType != '' ? res.data.ironType : []
        this.data.apiData.material = res.data.material != '' ? res.data.material : []
        this.data.apiData.surface = res.data.surface != '' ? res.data.surface : []
        this.data.apiData.proPlace = res.data.proPlace != '' ? res.data.proPlace : []
        //  设置已选中高亮
        this.data.list.forEach(el => {
          el.arr.forEach(subEl => {
            this.data.apiData[el.key].forEach(inEl => {
              if (subEl.id == inEl.id) {
                subEl.isCheck = true;
              }
            })
          })
        });
        this.data.list = this.data.list
        this.setData({
          list: this.data.list
        })
        let arr = []
        this.data.list.forEach(el => {
          let check = true;
          el.arr.forEach(sub => {
            if (!sub.isCheck) {
              check = false;
              return false
            }
          })
          arr.push(check)
        })
        this.data.checkArr = arr;
        this.setData({
          checkArr: this.data.checkArr
        })
      }
    })
  }
})