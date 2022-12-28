
interface WeixinNoticeResponse {
  id: string
  create_time: string
  resource_type: string
  event_type: string
  summary: string
  resource: {
    original_type: string
    algorithm: string
    ciphertext: string
    associated_data: string
    nonce: string
  }
}

export {
  WeixinNoticeResponse
}
