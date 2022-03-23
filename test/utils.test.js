import assert from 'assert'
import { nonce } from '../src/utils'

describe('utils', () => {

  it('nonce: create random string', () => {
    assert(typeof nonce() === 'string')
    assert(nonce().length === 32)
    assert(nonce(20).length === 20)
  })
})
