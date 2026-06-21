const db = require('../db');

/**
 * Context-aware Authorization Middleware
 * @param {string} permission - The permission slug required (e.g., 'sis:student:write')
 * @param {function} contextGetter - Optional. A function (req) => { key: value } to extract required context.
 */
const authorize = (permission, contextGetter = null) => {
  return (req, res, next) => {
    const userId = req.user.id;
    const userPerms = db.getUserPermissions(userId);
    
    // 1. Super Admin Override
    if (userPerms.includes('super_admin')) {
      return next();
    }

    // 2. Basic Permission Check
    if (!userPerms.includes(permission)) {
      const err = new Error(`Forbidden: Missing permission ${permission}`);
      err.status = 403;
      throw err;
    }

    // 3. Context/Scope Check
    if (contextGetter) {
      const requiredContext = contextGetter(req);
      const userRoles = db.getUserRoles(userId);

      // Check if ANY of the user's roles that grant this permission also cover the context
      const hasValidScope = userRoles.some(role => {
        // If the role has no scope defined, it is globally authorized for its permissions
        if (!role.scope || Object.keys(role.scope).length === 0) return true;
        
        // Ensure all required context keys match the role's scope
        return Object.keys(requiredContext).every(key => {
          // If the role scope doesn't even have this key, it doesn't cover this context
          if (role.scope[key] === undefined) return false;
          // Match the value
          return String(role.scope[key]) === String(requiredContext[key]);
        });
      });

      if (!hasValidScope) {
        const err = new Error('Forbidden: Access denied for this specific scope/resource context');
        err.status = 403;
        throw err;
      }
    }

    next();
  };
};

module.exports = { authorize };
