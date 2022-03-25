import WeixinRequest, { WeixinRequestParams } from './request'

class WeixinPayment extends WeixinRequest {
  constructor(params: WeixinRequestParams) {
    super(params)
  }

  // 创建交易单 (JSAPI/H5/App/Native)
  async makeTransaction({ type, params }) {
    params = {
      ...params,
      appid: this.params.appId,
      mchid: this.params.mchId
    }
    return this.request('POST', `/v3/pay/transactions/${type}`, params)
  }

  // 查询交易
  async queryTransaction(txnId) {
    return this.request('GET', `/v3/pay/transactions/id/${txnId}?mchid=${this.params.mchId}`)
  }

  // 关闭交易
  async closeTransaction(outTradeNo) {
    return this.request('POST', `/v3/pay/transactions/out-trade-no/${outTradeNo}/close`, {
      mchid: this.params.mchId
    })
  }

  // 调起支付
  async invokePayment() {}

  // 响应平台通知
  async processNotice() {
    return {
      code: 'SUCCESS',
      message: '成功'
    }
  }

  // 申请退款
  async applyRefund() {}

  // 查询单笔退款
  async queryRefund() {}

  // 申请交易账单
  async applyTradeBill() {}

  // 申请资金账单
  async applyFundBill() {}

  // 下载账单
  async downloadBill() {}

  // 获取商户当前可用的平台证书
  async certificates() {
    return this.request('GET', '/v3/certificates')
  }

}

export default WeixinPayment
