const { assert } = require('chai')
const rbac = require('./index.js')

describe('validateResourceCollection.test.js', function() {

  it('passes vanilla resource collections', function() {
    rbac.validateResourceCollection({
      resource1: {
        operations: {
          view: true,
        },
      },
      resource2: {
        operations: {
          view: true,
          edit: true,
        },
      },
    })
  })

  it('extra properties ignored', function() {
    rbac.validateResourceCollection({
      resource1: {
        description: 'can have extra properties',
        operations: {
          view: {
            description: 'for operations too',
          },
        },
      },
    })
  })

  it('empty operations objects', function() {
    rbac.validateResourceCollection({
      resource1: {
        operations: {
        },
      },
      resource2: {
        operations: {
        },
      },
    })
  })

  it('throws with non-objects', function() {
    assert.throws(function constructWithUndefined() {
      rbac.validateResourceCollection()
    })
    assert.throws(function constructWithNull() {
      rbac.validateResourceCollection(null)
    })
    assert.throws(function constructWithNumber() {
      rbac.validateResourceCollection(42)
    })
    assert.throws(function constructWithArray() {
      rbac.validateResourceCollection([ 42 ])
    })
  })

  it('throws with non-object resources', function() {
    assert.throws(function undefinedValue() {
      rbac.validateResourceCollection({
        resource1: undefined,
      })
    })
    assert.throws(function nullValue() {
      rbac.validateResourceCollection({
        resource1: null,
      })
    })
    assert.throws(function numberValue() {
      rbac.validateResourceCollection({
        resource1: 123,
      })
    })
    assert.throws(function arrayValue() {
      rbac.validateResourceCollection({
        resource1: [ 1, 2, 3 ],
      })
    })
  })

  it('throws with poorly formatted resources', function() {
    assert.throws(function emptyValue() {
      rbac.validateResourceCollection({
        resource1: {},
      })
    })
    assert.throws(function noOperationsKey() {
      rbac.validateResourceCollection({
        resource1: {
          unrecognizedKey: 'ignored',
        },
      })
    })
    assert.throws(function nullOperationsValue() {
      rbac.validateResourceCollection({
        resource1: {
          operations: null,
        },
      })
    })
    assert.throws(function falseyOperationValue() {
      rbac.validateResourceCollection({
        resource1: {
          operations: {
            view: false,
          },
        },
      })
    })
  })

})
