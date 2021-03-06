<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Session][1]
    -   [Parameters][2]
    -   [Examples][3]
    -   [can][4]
        -   [Parameters][5]
-   [validateResourceCollection][6]
    -   [Parameters][7]
    -   [Examples][8]
-   [validateRoleRegistry][9]
    -   [Parameters][10]
    -   [Examples][11]

## Session

Joins a list of roles into a queryable object. This would most commonly be used with the set of roles associated with an authenticated user.

### Parameters

-   `roleRegistry` **[object][12]** An object defining all the roles in the system, or at least those required by rolesList.
-   `rolesList` **[array][13]** Array of roles to construct this session with.
-   `resourceCollection` **[object][12]** Resource collection used to validate roleRegistry and resource operations as they are queries (optional).

### Examples

```javascript
const rbac = require('./index.js')

const session = new rbac.Session(roleRegistry(), [ 'Guest' ], resourceCollection())
if (!session.can('update', 'Documents')) {
  throw new UnauthorizedError('Guests cannot update documents!')
}
```

### can

Inquire if an operation is permitted on a resource in the context of this session.

#### Parameters

-   `operationName`  
-   `resourceName`  

## validateResourceCollection

A resource collection describes the resources and associated operations in a system.
This is an optional component and could be used to validate role definitions, or to build UIs for
administrators to define roles within the system.

This function validates that an object is in the proper form to be considered a resource collection.

### Parameters

-   `resourceCollection` **[object][12]** Resource collection object to validate.

### Examples

```javascript
const validateResourceCollection = require('validateResourceCollection')

validateResourceCollection({
  'resourceName': {
    operations: {
      'operationName': 'truthy-value'
    }
  }
})
```

-   Throws **[Error][14]** throws error when validation fails.

## validateRoleRegistry

A role registry object describes a the set of permitted operations on resources per role.

This function verifies that an object is in the proper form to be considered a role registry.

### Parameters

-   `roleRegistry` **[object][12]** Role registry object to validate.
-   `resourceCollection` **[object][12]** Resource collection to validate permissions against (optional).

### Examples

```javascript
const validateRoleRegistry = require('validateRoleRegistry')

validateRoleRegistry({
  'role-id': {
    // optional role inheritance
    inheritsFrom: [ 'role-id-1', 'role-id-2', 'etc.' ],
    resources: {
      // resources has the same form as ResourceCollection
      'resourceName': {
        operations: {
          'operationName': 'truthy-value',
        },
      },
    },
  },
})
```

-   Throws **[Error][14]** throws error when validation fails.

[1]: #session

[2]: #parameters

[3]: #examples

[4]: #can

[5]: #parameters-1

[6]: #validateresourcecollection

[7]: #parameters-2

[8]: #examples-1

[9]: #validateroleregistry

[10]: #parameters-3

[11]: #examples-2

[12]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[13]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[14]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error
