exports.up = function(knex) {
  return knex.schema
    // 1. Multi-channel Credentials
    .createTable('user_credentials', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('credential_type').notNullable(); // 'email', 'admission_no', 'staff_id', 'mobile', 'username'
      table.string('identifier').notNullable().unique();
      table.boolean('is_primary').defaultTo(false);
      table.timestamps(true, true);
    })
    // 2. Session Tracking
    .createTable('user_sessions', (table) => {
      table.string('id').primary(); // JTI / UUID
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('refresh_token_hash').notNullable();
      table.string('device_fingerprint').notNullable();
      table.string('ip_address');
      table.timestamp('expires_at').notNullable();
      table.timestamp('revoked_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 3. Security Audit Ledger
    .createTable('security_audit_logs', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
      table.string('event_type').notNullable(); // 'LOGIN_SUCCESS', 'MFA_FAILED', etc.
      table.text('metadata'); // JSON string for browser, os, etc.
      table.string('severity').defaultTo('INFO');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .then(async () => {
      // Migrate existing users to user_credentials
      const users = await knex('users').select('id', 'username');
      if (users.length > 0) {
        const credentials = users.map(u => ({
          user_id: u.id,
          credential_type: 'username',
          identifier: u.username,
          is_primary: true
        }));
        await knex('user_credentials').insert(credentials);
      }
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('security_audit_logs')
    .dropTableIfExists('user_sessions')
    .dropTableIfExists('user_credentials');
};
