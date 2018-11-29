const { assert } = require('chai')
const rbac = require('./index.js')

describe('Session.test.js', function() {

  it('session.can with resource collection validation', function() {
    const session = new rbac.Session(roleRegistry(), [ 'Guest' ], resourceCollection())

    assert.isTrue(session.can('read', 'Documents'))
    assert.isFalse(session.can('update', 'Documents'))
    assert.throws(function unrecognizedResource() {
      assert.isFalse(session.can('update', 'NotAResourceInCollection'))
    })
    assert.throws(function unrecognizedResource() {
      assert.isFalse(session.can('NotAnOperationInCollection', 'Documents'))
    })
  })

  it('session.can without resource collection validation', function() {
    const session = new rbac.Session(roleRegistry(), [ 'Guest' ])

    assert.isTrue(session.can('read', 'Documents'))
    assert.isFalse(session.can('update', 'Documents'))
    assert.isFalse(session.can('update', 'NotAResourceInCollection'))
    assert.isFalse(session.can('NotAnOperationInCollection', 'Documents'))
  })

  it('session.can respects inheritance', function() {
    const session = new rbac.Session(roleRegistry(), [ 'Admin' ], resourceCollection())

    assert.isTrue(session.can('read', 'Documents'))
    assert.isTrue(session.can('update', 'Documents'))
    assert.isTrue(session.can('read', 'Users'))
    assert.isTrue(session.can('create', 'Users'))
  })

  it('handles circular inheritance (strange, but it could happen)', function() {
    const session = new rbac.Session({
      Role1: {
        inheritsFrom: [ 'Role2' ],
        resources: {
          Documents: {
            operations: {
              read: true,
            },
          },
        },
      },
      Role2: {
        inheritsFrom: [ 'Role1' ],
        resources: {
          Documents: {
            operations: {
              create: true,
              update: true,
              delete: true,
            },
          },
        },
      },
    }, [ 'Role1' ])

    assert.isTrue(session.can('read', 'Documents'))
    assert.isTrue(session.can('create', 'Documents'))
  })

  it('throws with non-object roleRegistry', function() {
    assert.throws(function constructWithUndefined() {
      new rbac.Session()
    })
    assert.throws(function constructWithNull() {
      new rbac.Session(null)
    })
    assert.throws(function constructWithNumber() {
      new rbac.Session(42)
    })
    assert.throws(function constructWithArray() {
      new rbac.Session([ 42 ])
    })
  })

  it('throws with non-array rolesList', function() {
    assert.throws(function constructWithUndefined() {
      new rbac.Session(roleRegistry())
    })
    assert.throws(function constructWithNull() {
      new rbac.Session(roleRegistry(), null)
    })
    assert.throws(function constructWithNumber() {
      new rbac.Session(roleRegistry(), 42)
    })
    assert.throws(function constructWithArray() {
      new rbac.Session(roleRegistry(), [ 42 ])
    })
  })

})

function roleRegistry() {
  return {
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
            create: true,
            update: true,
            delete: true,
          },
        },
      },
    },
    Admin: {
      inheritsFrom: [ 'Employee' ],
      resources: {
        Users: {
          operations: {
            create: true,
            update: true,
            delete: true,
          },
        },
      },
    },
  }
}

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
  }
}
