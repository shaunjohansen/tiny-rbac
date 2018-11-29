const validateRoleRegistry = require('./validateRoleRegistry.js')

/**
 * A mapping between a user and an activated subset of roles that are assigned to the user.
 *
 * @param {object} roleRegistry An object defining all the roles in the system, or at least those required by rolesList.
 * @param {array} rolesList Array of roles to construct this session with.
 * @param {object} resourceCollection Resource collection used to validate roleRegistry and resource operations as they are queries (optional).
 */
function Session(roleRegistry, rolesList, resourceCollection) {
  validateRoleRegistry(roleRegistry, resourceCollection)
  if (!(rolesList instanceof Array)) {
    throw new Error('rolesList param must be an array')
  }

  // result of addPermissionsForRole, in the form: `{
  //   resourceName1: { oerationName1: true, oerationName2: true },
  //   resourceName2: { oerationName3: true, oerationName4: true }
  // }`
  const _sessionPermissionGrants = {}

  // used in addPermissionsForRole, in the form: `{ resourceName1: true, resourceName2: true }`
  const _visitedRoles = {}

  for (const roleId of rolesList) {
    _addPermissionsForRole(roleId)
  }

  function _addPermissionsForRole(roleId) {
    if (_visitedRoles[roleId]) {
      // don't repeat ourselves - also saves from infinite recursion in looped inheritance
      return
    }

    const roleDefinition = roleRegistry[roleId]
    if (!roleDefinition) {
      throw new Error(`role '${roleId}' does not exist in roleRegistry`)
    }
    _visitedRoles[roleId] = true

    if (roleDefinition.inheritsFrom) {
      for (const inheritedRoleId of roleDefinition.inheritsFrom) {
        _addPermissionsForRole(inheritedRoleId)
      }
    }

    for (const resourceName in roleDefinition.resources) {
      const resource = roleDefinition.resources[resourceName]
      if (resource) {
        let resourceGrants = _sessionPermissionGrants[resourceName]
        if (!resourceGrants) {
          _sessionPermissionGrants[resourceName] = resourceGrants = {}
        }

        for (const operationName in resource.operations) {
          if (resource.operations[operationName]) {
            resourceGrants[operationName] = true
          }
        }
      }
    }
  }

  /**
   * Inquire if an operation is permitted on a resource in the context of this session.
   */
  this.can = function(operationName, resourceName) {
    if (typeof operationName !== 'string') {
      throw new Error('operation param must be a string')
    }
    if (typeof resourceName !== 'string') {
      throw new Error('resource param must be a string')
    }

    if (resourceCollection) {
      // validate resource operation exists in master collection
      const resourceDefinition = resourceCollection[resourceName]
      if (!resourceDefinition) {
        throw new Error(`Invalid resource name '${resourceName}'`)
      }
      if (!resourceDefinition.operations[operationName]) {
        throw new Error(`Invalid operation '${operationName}' on resource '${resourceName}'`)
      }
    }

    return !!(_sessionPermissionGrants[resourceName] && _sessionPermissionGrants[resourceName][operationName])
  }
}

module.exports = Session
