exports.up = function(knex) {
  return knex.schema
    .createTable('students', function(table) {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.json('meta').nullable()
      table.timestamps(true, true)
    })
    .createTable('attendance', function(table) {
      table.increments('id').primary()
      table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE')
      table.date('date').notNullable()
      table.boolean('present').notNullable().defaultTo(true)
      table.string('marked_by').nullable()
      table.timestamp('marked_at').defaultTo(knex.fn.now())
      table.unique(['student_id', 'date'])
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('attendance')
    .dropTableIfExists('students')
}
