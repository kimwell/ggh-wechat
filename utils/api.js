export const URI = 'http://192.168.0.251:90'
// export const URI = 'https://gganghao.com'
// const URI = 'https://jiedan8.cn'
const fetch = require('./fetch')

export const uploadImage = URI + '/common/fileUpload/images'

/**
 * 数据获取公共封装
 */
function fetchApi(path, params) {
  return fetch(URI, path, params)
}


export const aliClound = 'http://tbxoss.oss-cn-hangzhou.aliyuncs.com';
/*
 *获取当前服务器时间
 */
export const getServeTime = () => {
  return fetchApi('api/main/getServeTime').then(res => res.data)
}


/**
 * 手机formId 
 */
export const clectionIds = (params) => {
  return fetchApi('demands/wxFormId', params).then(res => res.data)
}


/**
 * 获取openid 
 */
export const getOpenId = (params) => {
  return fetchApi('demands/wx/codeForOpenId', params).then(res => res.data)
}


/** =====================登录接口======================== */

/**
 * 登录
 * 
 */
export const login = (params) => {
  return fetchApi('login/userLogin', params).then(res => res.data)
}



/**
 * 查询当前登录人信息
 * 
 */
export const findCurrentUser = () => {
  return fetchApi('api/user/findCurrentUser').then(res => res.data)
}


/**
 * 修改密码 获取验证码
 * 
 */
export const smsCode = (params) => {
  return fetchApi('login/smsCode', params).then(res => res.data)
}

/**
 * 注册 获取验证码
 * 
 */
export const regsmsCode = (params) => {
  return fetchApi('api/regist/smsCode', params).then(res => res.data)
}

/**
 * 注册 验证使用是否注册
 * 
 */
export const miniSmsCode = (params) => {
  return fetchApi('api/regist/miniSmsCode', params).then(res => res.data)
}


/**
 * 修改密码 
 * 
 */
export const validateMobile = (params) => {
  return fetchApi('login/validateMobile', params).then(res => res.data)
}

/** =====================首页接口======================== */

/**
 * 获取首页轮播图
 */
export const swiperBanners = (params) => {
  return fetchApi('api/ad/findByGroupId', params).then(res => res.data)
}


/**
 * 获取新闻数据
 * @param  {String} articleTypeId   类型，例如：'coming_soon'
 * @param  {Number} currentPage   页码
 * @param  {Number} pageSize  页条数
 * @return {Promise}       包含抓取任务的Promise
 */
export const getNewslist = params => {
  return fetchApi('api/news/newsList', params).then(res => res.data)
}

/**
 * 新闻详情
 */
export const getNewsDetail = params => {
  return fetchApi('api/news/newsDetail', params).then(res => res.data)
}


/**
 * 获取商户广告数据
 * @param  {String} articleTypeId   类型，例如：'coming_soon'
 * @param  {Number} currentPage   页码
 * @param  {Number} pageSize  页条数
 * @return {Promise}       包含抓取任务的Promise
 */
export const getSHopAd = params => {
  return fetchApi('api/findByGroupId', params).then(res => res.data)
}

/**
 * 材质
 */
export const findMaterials = () => {
  return fetchApi('api/query/findMaterials').then(res => res.data)
}

/**
 * 品名
 */
export const findIronTypes = () => {
  return fetchApi('api/query/findIronTypes').then(res => res.data)
}

/**
 * 根据品名查询对应单位
 */
export const findIronAndUnitByIronId = (ironId) => {
  return fetchApi('api/query/findIronAndUnitByIronId', { ironId: ironId }).then(res => res.data)
}

/**
 * 表面
 */
export const findSurFace = () => {
  return fetchApi('api/query/findSurFace').then(res => res.data)
}

/**
 * 产地
 */
export const findProPlaces = () => {
  return fetchApi('api/query/findProPlaces').then(res => res.data)
}

/**
 * 仓库
 */
export const findStoreHouse = () => {
  return fetchApi('api/query/findStoreHouse').then(res => res.data)
}

/**
 * 查询经营范围
 * 
 */
export const findBusinessScope = () => {
  return fetchApi('demands/businessScope/findBusinessScope').then(res => res.data)
}


/** =====================注册======================== */

/**
 * 注册
 */
export const regUser = (params) => {
  return fetchApi('api/regist/registUser', params).then(res => res.data)
}

/** =====================商户认证======================== */

/**
 * 查询专员信息
 */
export const getSaleMan = () => {
  return fetchApi('api/bregist/findSalemanInfo').then(res => res.data)
}

/**
 * 认证商家
 */
export const AcUser = (params) => {
  return fetchApi('api/bregist/registUser', params).then(res => res.data)
}

/**
 * 重新提交
 */
export const AcUserAgain = (params) => {
  return fetchApi('api/bregist/registUserAgain', params).then(res => res.data)
}
/**
 * 根据用户编号来查询商户信息
 */
export const getBuserInfoByUserId = (params) => {
  return fetchApi('api/regist/findBuserInfoById', params).then(res => res.data)
}


/*
 * 省信息
 */
export const findProvince = () => {
  return fetchApi('api/query/findProvince').then(res => res.data)
}

/**
 * 市信息
 * @param  {String} id   类型，例如：'340000'
 */
export const findCity = (id) => {
  return fetchApi('api/query/findCity', { id: id }).then(res => res.data)
}

/**
 * 区信息
 * @param  {String} id   类型，例如：'340000'
 */
export const findDistrict = (id) => {
  return fetchApi('api/query/findDistrict', { id: id }).then(res => res.data)
}


/**
 *  查询常用规格
 */
export const findIronAndSurfaceAndSpecificationlist = (params) => {
  return fetchApi('api/query/findIronAndSurfaceAndSpecificationlist', params).then(res => res.data)
}

export const findIronAndSurfaceAndSpecificationHeightAndLength = (params) => {
  return fetchApi('api/query/findIronAndSurfaceAndSpecificationHeightAndLength', params).then(res => res.data)
}

/**
 * 快速发布
 */
export const saveIronBuy = (params) => {
  return fetchApi('demands/ironBuy/saveIronBuy', params).then(res => res.data)
}

/**   
 * 编辑求购
 */
export const updateIronBuy = (params) => {
  return fetchApi('demands/ironBuy/updateIronBuy', params).then(res => res.data)
}

/**
 * 批量发布
 */
export const saveIronBuyList = (params) => {
  return fetchApi('demands/ironBuy/saveIronBuyList', params).then(res => res.data)
}

/**
 * 求购历史
 */
export const ironHistory = () => {
  return fetchApi('demands/ironBuy/queryIronBuyInfo').then(res => res.data)
}


/** =====================个人中心======================== */

/**
 * 查询全部优惠信息
 */
export const findAllPro = () => {
  return fetchApi('/api/query/findAllPro').then(res => res.data)
}


/**
 * 保存优惠信息
 */
export const saveProInfo = (params) => {
  return fetchApi('demands/bInfo/updateBuserProInfo', params).then(res => res.data)
}


/**
 * 经营范围保存
 * 
 */
export const saveBusinessScope = (params) => {
  return fetchApi('demands/businessScope/saveBusinessScope', params).then(res => res.data)
}


/**
 * 买家数据统计
 * 
 */
export const statistical = (params) => {
  return fetchApi('demands/bInfo/statistical', params).then(res => res.data)
}

/**
 * 卖家数据统计
 * 
 */
export const sellerStatistical = (params) => {
  return fetchApi('demands/bInfo/statistical/seller', params).then(res => res.data)
}

/**
 * 分页查询公司子账号列表
 * 
 */
export const subAccount = (params) => {
  return fetchApi('demands/subaccountManagement/findSubaccountManagementPage', params).then(res => res.data)
}


/**
 * 删除子账号
 * 
 */
export const DelsubAccount = (params) => {
  return fetchApi('demands/subaccountManagement/deleteSubaccountManagement', params).then(res => res.data)
}


/**
 * 保存公司子账号
 * 
 */
export const saveAccount = (params) => {
  return fetchApi('demands/subaccountManagement/saveSubaccountManagement', params).then(res => res.data)
}

/**
 * 用户更新子账号账号信息
 * 
 */
export const updateAccount = (params) => {
  return fetchApi('demands/subaccountManagement/updateSubaccountType', params).then(res => res.data)
}

/**
 * 重置密码
 * 
 */
export const accountPassword = (params) => {
  return fetchApi('demands/subaccountManagement/resetPassword', params).then(res => res.data)
}

/**
 * 供应商管理
 * 
 */
export const supplerManager = (params) => {
  return fetchApi('demands/storeOrder/supplerManager', params).then(res => res.data)
}


/**
 * 修改用户密码
 * 
 */
export const updateBaseUsersSafeInfo = (params) => {
  return fetchApi('demands/baseUsers/updateBaseUsersSafeInfo', params).then(res => res.data)
}


/**
 * 用户修改商家信息
 * 
 */
export const updateBInfo = (params) => {
  return fetchApi('demands/bInfo/updateBInfo', params).then(res => res.data)
}





/**
 * 用户分页查询客户信息
 */

export const findCustomer = (params) => {
  return fetchApi('demands/clientManagement/findClientManagementPage', params).then(res => res.data)
}


/**
 * 根据公司编号查询公司业务员
 */


export const findSalesmanByCompanyId = (params) => {
  return fetchApi('demands/clientManagement/findSalesmanByCompanyId', params).then(res => res.data)
}



/**
 * 用户批量更新公司客户业务员
 */


export const updateClientManagement = (params) => {
  return fetchApi('demands/clientManagement/updateClientManagement', params).then(res => res.data)
}



/** =====================求购、报价======================== */

/**
 * 查询当前用户求购信息
 * 
 */
export const queryBuyerPage = (params) => {
  return fetchApi('demands/ironBuy/queryIronBuyInfoPage', params).then(res => res.data)
}
/**
 * 查询求购信息详情
 * 
 */
export const queryIronSell = (params) => {
  return fetchApi('demands/ironBuy/queryIronSell', params).then(res => res.data)
}

/**
 * 卖家报价列表
 * 
 */
export const querySellerPage = (params) => {
  return fetchApi('demands/ironBuy/queryIronSellerInfoPage', params).then(res => res.data)
}

/**
 * 根据商户编号来查询商户信息(用户)
 * 
 */
export const findBuserInfoById = (params) => {
  return fetchApi('api/regist/findBuserInfoById', params).then(res => res.data)
}

/**
 * 保存报价信息
 * 
 */
export const saveIronSellInfo = (params) => {
  return fetchApi('demands/ironBuy/saveIronSellInfo', params).then(res => res.data)
}

/**
 * 删除报价
 * 
 */
export const deleteIronBuy = (params) => {
  return fetchApi('demands/ironBuy/deleteIronBuy', params).then(res => res.data)
}

/*
 * 忽略报价(用户)
 * 
 */
export const missIronSellInfo = (params) => {
  return fetchApi('demands/ironBuy/missIronSellInfo', params).then(res => res.data)
}

/*
 * 用户中标
 * 
 */
export const getIronSell = (params) => {
  return fetchApi('demands/ironBuy/getIronSell', params).then(res => res.data)
}

/** =====================订单======================== */

/**
 * 卖家订单
 */
export const getBuyerOrder = (params) => {
  return fetchApi('demands/storeOrder/findBuyOrder', params).then(res => res.data)
}


export const getSellerOrder = (params) => {
  return fetchApi('demands/storeOrder/findSellOrder', params).then(res => res.data)
}

/**
 *  取消订单理由
 */
export const cancelRes = (params) => {
  return fetchApi('api/query/findDateDictionary', params).then(res => res.data)
}


/**
*  取消订单
*/
export const cancelOrder = (params) => {
  return fetchApi('demands/storeOrder/cancelStoreOrder', params).then(res => res.data)
}

/**
 * 查询业务员
 */
export const querySalls = (params) => {
  return fetchApi('demands/clientManagement/findSalesmanByCompanyId', params).then(res => res.data)
}

/**
 * 绑定业务员
 */
export const bindSaleman = (params) => {
  return fetchApi('demands/storeOrder/bindOneStoreOrder', params).then(res => res.data)
}

/**
 * 批量绑定业务员
 */
export const bindSalemans = (params) => {
  return fetchApi('demands/storeOrder/bindStoreOrder', params).then(res => res.data)
}


/**
 * 卖家确认订单
 */
export const confirmStore = (params) => {
  return fetchApi('demands/storeOrder/confirmStore', params).then(res => res.data)
}

/**
 * 修改订单
 */
export const updateStoreOrder = (params) => {
  return fetchApi('demands/storeOrder/updateStoreOrder', params).then(res => res.data)
}

/**
 * 订单详情
 */
export const findOrder = (params) => {
  return fetchApi('demands/storeOrder/findOrder', params).then(res => res.data)
}

/**
 * 查询未绑定业务员的公司
 */
export const findBindBuy = (params) => {
  return fetchApi('demands/storeOrder/findBindBuy', params).then(res => res.data)
}

/**
 * 放弃报价
 */
export const sureptlb = (params) => {
  return fetchApi('demands/ironBuy/sureptlb', params).then(res => res.data)
}


/**
 * 放弃报价
 */
export const cancelIronBuy = (params) => {
  return fetchApi('demands/ironBuy/cancelIronBuy', params).then(res => res.data)
}

/**
 * 清理formId
 */
export const cleanFormId = (params) => {
  return fetchApi('demands/wxFormId/clean', params).then(res => res.data)
}