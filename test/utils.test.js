import assert from 'assert'
import { md5, nonce } from '../src/utils'

describe('utils', () => {

  it('md5', () => {
    const str = md5('raw text')
    assert(typeof str === 'string')
    assert(str.length === 32)
  })

  it('nonce: create random string', () => {
    assert(typeof nonce() === 'string')
    assert(nonce().length === 32)
    assert(nonce(20).length === 20)
  })
})
