exports.up = function(knex) {
  return knex.schema
    // 1. Roles Definition
    .createTable('rbac_roles', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique(); // 'super_admin', 'nursery_admin', etc.
      table.text('description');
      table.integer('parent_role_id').references('id').inTable('rbac_roles').onDelete('SET NULL');
      table.timestamps(true, true);
    })
    // 2. Permissions Registry
    .createTable('rbac_permissions', (table) => {
      table.increments('id').primary();
      table.string('slug').notNullable().unique(); // 'sis:student:write'
      table.text('description');
      table.timestamps(true, true);
    })
    // 3. Role-Permissions Mapping (M:N)
    .createTable('rbac_role_permissions', (table) => {
      table.integer('role_id').notNullable().references('id').inTable('rbac_roles').onDelete('CASCADE');
      table.integer('permission_id').notNullable().references('id').inTable('rbac_permissions').onDelete('CASCADE');
      table.primary(['role_id', 'permission_id']);
    })
    // 4. User-Roles Assignment (M:N)
    .createTable('rbac_user_roles', (table) => {
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('role_id').notNullable().references('id').inTable('rbac_roles').onDelete('CASCADE');
      table.text('scope_json'); // JSON string: {"sections": [1], "classes": [5]}
      table.primary(['user_id', 'role_id']);
    })
    .then(async () => {
      // Seed Initial Roles
      const roles = [
        { name: 'super_admin', description: 'Global root privileges' },
        { name: 'nursery_admin', description: 'Administrative scope for Nursery section' },
        { name: 'primary_admin', description: 'Administrative scope for Primary section' },
        { name: 'jss_admin', description: 'Administrative scope for Junior Secondary section' },
        { name: 'sss_admin', description: 'Administrative scope for Senior Secondary section' },
        { name: 'teacher', description: 'Classroom and student management' },
        { name: 'parent', description: 'Parental access to linked students' },
        { name: 'student', description: 'Personal student portal access' }
      ];
      await knex('rbac_roles').insert(roles);

      // Seed Core Permissions
      const permissions = [
        { slug: 'system:config:manage', description: 'Manage global school settings' },
        { slug: 'sis:student:read', description: 'View student profiles' },
        { slug: 'sis:student:write', description: 'Create/Update student profiles' },
        { slug: 'sis:teacher:read', description: 'View teacher profiles' },
        { slug: 'sis:teacher:write', description: 'Manage staff records' },
        { slug: 'ais:attendance:read', description: 'View attendance records' },
        { slug: 'ais:attendance:write', description: 'Mark and update attendance' },
        { slug: 'ams:grades:write', description: 'Manage academic results and grades' },
        { slug: 'fms:invoice:read', description: 'View financial records and invoices' }
      ];
      await knex('rbac_permissions').insert(permissions);

      // Map Super Admin to all permissions
      const superAdmin = await knex('rbac_roles').where('name', 'super_admin').first();
      const allPerms = await knex('rbac_permissions').select('id', 'slug');
      if (superAdmin && allPerms.length > 0) {
        await knex('rbac_role_permissions').insert(
          allPerms.map(p => ({ role_id: superAdmin.id, permission_id: p.id }))
        );
      }

      // Map Teacher to basic permissions
      const teacher = await knex('rbac_roles').where('name', 'teacher').first();
      if (teacher) {
        const teacherPermSlugs = ['sis:student:read', 'sis:teacher:read', 'ais:attendance:read', 'ais:attendance:write'];
        const teacherPerms = allPerms.filter(p => teacherPermSlugs.includes(p.slug));
        await knex('rbac_role_permissions').insert(
          teacherPerms.map(p => ({ role_id: teacher.id, permission_id: p.id }))
        );
      }
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('rbac_user_roles')
    .dropTableIfExists('rbac_role_permissions')
    .dropTableIfExists('rbac_permissions')
    .dropTableIfExists('rbac_roles');
};
