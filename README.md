# tiny-rbac

A role-based access control (RBAC) library for JavaScript - client and server.

The intent with this library is to define a simple, straightforward, immediate mode implementation of ANSI RBAC using plain JavaScript objects. Storage of the models is outside the scope of this library. In UNIX tradition, this allows us to do one thing well.

RBAC is relatively straightfoward:

> It is the principle of controlling access entirely through "roles" created in the system that align to job functions (such as bank teller), assigning permissions to those roles, and then assigning those roles to employees. - [NIST 2010 RBAC Final Report](https://csrc.nist.gov/publications/detail/white-paper/2010/12/19/economic-analysis-of-rbac-final-report/final)

When a user signs in to an application a "session" is constructed that combines the permissions of their roles. Access to resources can simply check the session to see if the user has permission to perform the operation.

This library provides a helper function for combining roles into sessions, allowing a simple mechanism for permission checking. For example:

```javascript
const rbac = require('./index.js')

const session = new rbac.Session(roleRegistry(), [ 'Guest' ], resourceCollection())
if (!session.can('update', 'Documents')) {
  throw new UnauthorizedError('Guests cannot update documents!')
}
```

## A little about RBAC

Information on role-based access control can be found on numerous web sites. However, I find it best to go to the source - there is a lot of confusion out there. Here is some of the background information I used to create this library:

- The spec: [ANSI INCITS 359-2004](https://profsandhu.com/journals/tissec/ANSI+INCITS+359-2004.pdf)
- NIST White Paper 2010: [Economic Analysis of Role-Based Access Control: Final Report](https://csrc.nist.gov/publications/detail/white-paper/2010/12/19/economic-analysis-of-rbac-final-report/final)
- A chapter in the Apache Fortress User's Guide: [An Introduction to Role-Based Access Control ANSI INCITS 359-2004¶](https://directory.apache.org/fortress/user-guide/1-intro-rbac.html)

### Definitions

resource: A part of the system subject to access control. Such as UserAccounts, FinancialDetails, Documents, etc. (Resources are referred to as "objects" in the RBAC spec, I'm renaming here to prevent terminology conflict with JavaScript objects.)

operation: An action that can be performed on a specific resource. Such as create, read, update, delete, etc. Different resources can have different operations, that is up to the design of the system. For example, UserAccounts may have create, read, update, and delete, but FinancialDetails may have only read and update.

permission: An approval to perform an operation on a resource. Such as "can edit FinancialDetails", "can create Documents", etc.

role: A named collection of permissions granted in the system. Typically these are closely linked with job function in an organization. For example a FinancialController would have permission to read and update FinancialDetails.

role hierarchies: Defines an inheritance relationship between roles. When a role inherits from another role, it gains all the permissions defined in that other role. For example, if a Guest role can view documents, you might define an Employee role that can edit documents and inherit from Guest (meaning an Employee can do whatever Guest can do, plus the new permissions granted in the Employee role). Described as optional in [ANSI INCITS 359-2004](https://profsandhu.com/journals/tissec/ANSI+INCITS+359-2004.pdf).

user: An account on the system. This can be used to represent a human being, or another application accessing the system. A user is assigned a set of roles within the system.

session: A user-authenticated point of access to the system. For example a web connection to an HTTPS API, a person signed in to an application - the UI would be guided by the session to hide or disable operations they do not have access to.

## Not included in tiny-rbac

These parts of RBAC are outside the scope of this library, but may be included in a later version:

Static/Dynamic Separation of Duties: Rules for limiting which operations can be granted together. This is an optional part of the RBAC spec that prevents users from being given conflicting responsibilities. For example, if one user was a "Purchase Order Maker" and a "Purchase Order Approver" they could approve their own purchase orders, which might be bad for business - this could be disallowed by the system using constraint relations. Described as optional in [ANSI INCITS 359-2004](https://profsandhu.com/journals/tissec/ANSI+INCITS+359-2004.pdf).

Adding Attributes to RBAC: A later paper proposes combining RBAC and attribute-based access control (ABAC), which allows rules to specify conditions under which access is granted and denied. For example a bank teller might be denied access to the system outside their working hours. See [D. Richard Kuhn, Edward J. Coyne, Timothy R. Weil - Published 2010 in Computer - DOI:10.1109/MC.2010.155](https://csrc.nist.gov/CSRC/media/Publications/journal-article/2010/adding-attributes-to-role-based-access-control/documents/kuhn-coyne-weil-10.pdf) for details.
