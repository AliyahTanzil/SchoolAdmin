exports.up = function(knex) {
  return knex.schema
    .createTable('students', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email');
      table.string('grade_level');
      table.string('section');
      table.string('gender');
      table.string('dob');
      table.text('address');
      table.string('parent_name');
      table.string('parent_phone');
      table.string('status').defaultTo('Active');
      table.text('meta');
    })
    .createTable('teachers', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email');
      table.string('phone');
      table.text('qualification');
      table.string('joining_date');
      table.string('status').defaultTo('Active');
      table.text('bio');
      table.string('subject');
    })
    .createTable('classes', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('category');
      table.string('section');
      table.integer('teacher_id').references('id').inTable('teachers').onDelete('SET NULL');
    })
    .createTable('academic_periods', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('start_date');
      table.string('end_date');
      table.string('status').defaultTo('Future');
    })
    .createTable('subjects', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('code').unique();
      table.string('category');
    })
    .createTable('schedules', (table) => {
      table.increments('id').primary();
      table.integer('class_id').notNullable().references('id').inTable('classes').onDelete('CASCADE');
      table.integer('teacher_id').references('id').inTable('teachers').onDelete('SET NULL');
      table.integer('subject_id').notNullable().references('id').inTable('subjects').onDelete('CASCADE');
      table.string('day_of_week').notNullable();
      table.string('start_time').notNullable();
      table.string('end_time').notNullable();
    })
    .createTable('enrollments', (table) => {
      table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
      table.integer('class_id').notNullable().references('id').inTable('classes').onDelete('CASCADE');
      table.primary(['student_id', 'class_id']);
    })
    .createTable('attendance', (table) => {
      table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
      table.integer('class_id').references('id').inTable('classes').onDelete('CASCADE');
      table.string('day').notNullable();
      table.integer('present').notNullable();
      table.string('marked_at');
      table.string('marked_by');
      table.primary(['student_id', 'class_id', 'day']);
    })
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('role').defaultTo('teacher');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('attendance')
    .dropTableIfExists('enrollments')
    .dropTableIfExists('schedules')
    .dropTableIfExists('subjects')
    .dropTableIfExists('academic_periods')
    .dropTableIfExists('classes')
    .dropTableIfExists('teachers')
    .dropTableIfExists('students');
};
