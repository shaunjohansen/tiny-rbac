const { assert } = require('chai')
const rbac = require('./index.js')

describe('validateRoleRegistry.test.js', function() {

  it('passes vanilla role registry', function() {
    rbac.validateRoleRegistry({
      Guest: {
        resources: {
          Documents: {
            operations: {
              read: true,
            },
          },
        },
      },
      Employee: {
        inheritsFrom: [ 'Guest' ],
        resources: {
          Users: {
            operations: {
              read: true,
            },
          },
          Documents: {
            operations: {
              update: true,
            },
          },
          FinancialInfo: {
            operations: {
              read: true,
            },
          },
        },
      },
    })
  })

  it('extra properties ignored', function() {
    rbac.validateRoleRegistry({
      Guest: {
        description: 'can describe Guest for the UI here',
        resources: {
          Documents: {
            resourceDatabaseId: 1234,
            operations: {
              read: true,
            },
          },
        },
      },
    })
  })

  it('validates successfully', function() {
    rbac.validateRoleRegistry({
      Guest: {
        resources: {
          Documents: {
            operations: {
              read: true,
            },
          },
        },
      },
      Employee: {
        inheritsFrom: [ 'Guest' ],
        resources: {
          Users: {
            operations: {
              read: true,
            },
          },
          Documents: {
            operations: {
              update: true,
            },
          },
          FinancialInfo: {
            operations: {
              read: true,
            },
          },
        },
      },
    }, resourceCollection())
  })

  it('throws when resource does not match', function() {
    assert.throws(function unmatchedResource() {
      rbac.validateRoleRegistry({
        Guest: {
          resources: {
            DoesNotExist: {
              operations: {
                read: true,
              },
            },
          },
        },
      }, resourceCollection())
    })
  })

  it('throws when operation does not match', function() {
    assert.throws(function unmatchedResource() {
      rbac.validateRoleRegistry({
        Guest: {
          resources: {
            Documents: {
              operations: {
                doesNotExist: true,
              },
            },
          },
        },
      }, resourceCollection())
    })
  })

  it('empty resource objects', function() {
    rbac.validateRoleRegistry({
      Guest: {
        resources: {
        },
      },
    })
  })

  it('throws with non-objects', function() {
    assert.throws(function constructWithUndefined() {
      rbac.validateRoleRegistry()
    })
    assert.throws(function constructWithNull() {
      rbac.validateRoleRegistry(null)
    })
    assert.throws(function constructWithNumber() {
      rbac.validateRoleRegistry(42)
    })
    assert.throws(function constructWithArray() {
      rbac.validateRoleRegistry([ 42 ])
    })
  })

  it('throws with non-object role definitions', function() {
    assert.throws(function undefinedValue() {
      rbac.validateRoleRegistry({
        roleId1: undefined,
      })
    })
    assert.throws(function nullValue() {
      rbac.validateRoleRegistry({
        roleId1: null,
      })
    })
    assert.throws(function numberValue() {
      rbac.validateRoleRegistry({
        roleId1: 123,
      })
    })
  })

  it('throws with poorly formatted role definitions', function() {
    assert.throws(function noOperationsKey() {
      rbac.validateRoleRegistry({
        roleId1: {
          resources: {
            unrecognizedKey: 'ignored',
          },
        },
      })
    })
    assert.throws(function nullOperationsValue() {
      rbac.validateRoleRegistry({
        roleId1: {
          resources: {
            operations: null,
          },
        },
      })
    })
    assert.throws(function falseyOperationValue() {
      rbac.validateRoleRegistry({
        roleId1: {
          resources: {
            operations: {
              view: false,
            },
          },
        },
      })
    })
  })

})

function resourceCollection() {
  return {
    Users: {
      operations: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
    Documents: {
      operations: {
        create: true,
        read: true,
        update: true,
        delete: true,
      },
    },
    FinancialInfo: {
      operations: {
        read: true,
        update: true,
      },
    },
  }
}
