const varuint = require('varuint-bitcoin')
const assert = require('assert')
const {
  bufferInt32,
  bufferUInt64,
  bufferVarInt,
  bufferVarSlice
} = require('../src/buffer-build')
const {
  buildTx,
  bufferInput,
  bufferOutput,
  bufferHash
} = require('../src/tx-builder')
const fixture = require('./fixture')

describe('buffer-write utils', function () {
  describe('bufferInt32', function () {
    const buffer = bufferInt32(25)
    it('should create a buffer with 32bit integer', function () {
      assert.equal(buffer.readInt32LE(0), 25)
    })
  })
  describe('bufferUInt32', function () {
    const buffer = bufferInt32(123)
    it('should create a buffer with unsigned 32bit integer', function () {
      assert.equal(buffer.readUInt32LE(0), 123)
    })
  })
  describe('bufferUInt64', function () {
    it('should create a buffer with unsigned 64bit integer', function () {
      const num = 456
      const buffer = bufferUInt64(num)
      const a = buffer.readUInt32LE(0)
      let b = buffer.readUInt32LE(4)
      b *= 0x100000000
      assert.equal(a + b, num)
    })
  })
  describe('bufferVarInt', function () {
    const num = 253
    const buffer = bufferVarInt(num)
    it('should create a buffer with varint', function () {
      const value = varuint.decode(buffer, 0)
      const length = varuint.decode.bytes
      assert.equal(value, num)
      assert.equal(length, 3)
    })
  })
  describe('bufferVarSlice', function () {
    const hex = '2d7a9f05'
    const buffer = bufferVarSlice(hex)
    it('should create a variable length buffer', function () {
      assert.equal(buffer.toString('hex'), '04' + hex)
    })
  })
})

describe('tx-build', function () {
  describe('bufferHash', function () {
    it('should create a buffer with hash', function () {
      const hash = '2d7a9f0534ddac231ef1978bda388791c32321f7e14e18e7df3bbed261615f54'
      assert.equal(bufferHash(hash).reverse().toString('hex'), hash)
    })
  })
  describe('bufferInput', function () {
    it('should build vin', function () {
      const buffer = bufferInput(fixture.decoded.vin[0])
      assert.equal(buffer.toString('hex'), fixture.hexItems.vin)
    })
  })
  describe('bufferOutput', function () {
    it('should build vout-1', function () {
      const buffer = bufferOutput(fixture.decoded.vout[0])
      assert.equal(buffer.toString('hex'), fixture.hexItems.vout1)
    })
  })
  describe('buildTx', function () {
    it('should build the whole transaction', function () {
      const buffer = buildTx(fixture.decoded)
      assert.equal(buffer.toString('hex'), fixture.hex)
    })
  })
})
