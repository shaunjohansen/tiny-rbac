const validateResourceCollection = require('./validateResourceCollection.js')

/**
 * A role registry object describes a the set of permitted operations on resources per role.
 *
 * This function verifies that an object is in the proper form to be considered a role registry.
 *
 * @example
 * const validateRoleRegistry = require('validateRoleRegistry')
 *
 * validateRoleRegistry({
 *   'role-id': {
 *     // optional role inheritance
 *     inheritsFrom: [ 'role-id-1', 'role-id-2', 'etc.' ],
 *     resources: {
 *       // resources has the same form as ResourceCollection
 *       'resourceName': {
 *         operations: {
 *           'operationName': 'truthy-value',
 *         },
 *       },
 *     },
 *   },
 * })
 *
 * @param {object} roleRegistry Role registry object to validate.
 * @param {object} resourceCollection Resource collection to validate permissions against (optional).
 * @throws {Error} throws error when validation fails.
 */
function validateRoleRegistry(roleRegistry, resourceCollection) {
  if (resourceCollection) {
    validateResourceCollection(resourceCollection)
  }

  if ((!roleRegistry) || typeof roleRegistry !== 'object') {
    throw new Error('roleRegistry is not an object')
  }
  for (const roleId in roleRegistry) {
    const roleDefinition = roleRegistry[roleId]
    if ((!roleDefinition) || typeof roleDefinition !== 'object') {
      throw new Error(`roleRegistry['${roleId}'] is not an object`)
    }
    if (roleDefinition.inheritsFrom) {
      if (!(roleDefinition.inheritsFrom instanceof Array)) {
        throw new Error(`roleRegistry['${roleId}'].inheritsFrom is not an array`)
      }
      for (const inheritedRoleId of roleDefinition.inheritsFrom) {
        if (!roleRegistry[inheritedRoleId]) {
          throw new Error(`role '${roleId}' inherits from role that doesn't exist: '${inheritedRoleId}'`)
        }
      }
    }
    if (roleDefinition.resources) {
      validateResourceCollection(roleDefinition.resources)

      if (resourceCollection) {
        for (const resourceName in roleDefinition.resources) {
          const resourceValue = roleDefinition.resources[resourceName]
          for (const operationName in resourceValue.operations) {
            const resource = resourceCollection[resourceName]
            if (!resource) {
              throw new Error(`Invalid resource name '${resourceName}' in role '${roleId}'`)
            }
            if (!resource.operations[operationName]) {
              throw new Error(`Invalid operation '${operationName}' on resource '${resourceName}' defined in role '${roleId}'`)
            }
          }
        }
      }
    }
  }
}

module.exports = validateRoleRegistry
