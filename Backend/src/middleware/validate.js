function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    Object.keys(schema).forEach(key => {
      const rules = schema[key];
      const value = req.body[key];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${key} is required`);
      } else if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${key} must be a ${rules.type}`);
      }
      
      if (rules.minLen && value && value.length < rules.minLen) {
        errors.push(`${key} must be at least ${rules.minLen} characters`);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    next();
  };
}

module.exports = { validate };
