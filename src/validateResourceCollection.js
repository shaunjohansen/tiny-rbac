/**
 * A resource collection describes the resources and associated operations in a system.
 * This is an optional component and could be used to validate role definitions, or to build UIs for
 * administrators to define roles within the system.
 *
 * This function validates that an object is in the proper form to be considered a resource collection.
 *
 * @example
 * const validateResourceCollection = require('validateResourceCollection')
 *
 * validateResourceCollection({
 *   'resourceName': {
 *     operations: {
 *       'operationName': 'truthy-value'
 *     }
 *   }
 * })
 *
 * @param {object} resourceCollection Resource collection object to validate.
 * @throws {Error} throws error when validation fails.
 */
function validateResourceCollection(resourceCollection) {
  if ((!resourceCollection) || typeof resourceCollection !== 'object') {
    throw new Error('resourceCollection is not an object')
  }
  for (const resourceName in resourceCollection) {
    const resource = resourceCollection[resourceName]
    if ((!resource) ||typeof resource !== 'object') {
      throw new Error(`resourceCollection['${resourceName}'] is not an object`)
    }
    if ((!resource.operations) || typeof resource.operations !== 'object') {
      throw new Error(`resourceCollection['${resourceName}'].operations is not an object`)
    }
    for (const operationName in resource.operations) {
      const operation = resource.operations[operationName]
      if (!operation) {
        throw new Error(`resourceCollection['${resourceName}'].operations['${operationName}'] is not truthy`)
      }
    }
  }
}

module.exports = validateResourceCollection
