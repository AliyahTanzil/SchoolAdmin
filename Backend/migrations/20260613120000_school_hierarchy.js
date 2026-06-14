exports.up = function(knex) {
  return knex.schema
    .createTable('school_sections', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.integer('ordinal').notNullable();
    })
    .createTable('school_grades', (table) => {
      table.increments('id').primary();
      table.integer('section_id').notNullable().references('id').inTable('school_sections').onDelete('RESTRICT');
      table.string('name').notNullable();
      table.integer('ordinal').notNullable();
    })
    .createTable('school_arms', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
    })
    .table('students', (table) => {
      table.integer('grade_id').references('id').inTable('school_grades').onDelete('SET NULL');
      table.integer('arm_id').references('id').inTable('school_arms').onDelete('SET NULL');
    })
    .table('classes', (table) => {
      table.integer('grade_id').references('id').inTable('school_grades').onDelete('SET NULL');
      table.integer('arm_id').references('id').inTable('school_arms').onDelete('SET NULL');
      table.integer('academic_period_id').references('id').inTable('academic_periods').onDelete('SET NULL');
    })
    .then(async () => {
      // 1. Seed Sections
      const sections = [
        { name: 'Nursery', ordinal: 1 },
        { name: 'Primary', ordinal: 2 },
        { name: 'Junior Secondary', ordinal: 3 },
        { name: 'Senior Secondary', ordinal: 4 }
      ];
      await knex('school_sections').insert(sections);
      
      const secIds = {};
      const rows = await knex('school_sections').select('id', 'name');
      rows.forEach(r => secIds[r.name] = r.id);

      // 2. Seed Grades
      const grades = [
        { section_id: secIds['Nursery'], name: 'Nursery 1', ordinal: 1 },
        { section_id: secIds['Nursery'], name: 'Nursery 2', ordinal: 2 },
        { section_id: secIds['Nursery'], name: 'Nursery 3', ordinal: 3 },
        { section_id: secIds['Primary'], name: 'Primary 1', ordinal: 4 },
        { section_id: secIds['Primary'], name: 'Primary 2', ordinal: 5 },
        { section_id: secIds['Primary'], name: 'Primary 3', ordinal: 6 },
        { section_id: secIds['Primary'], name: 'Primary 4', ordinal: 7 },
        { section_id: secIds['Primary'], name: 'Primary 5', ordinal: 8 },
        { section_id: secIds['Primary'], name: 'Primary 6', ordinal: 9 },
        { section_id: secIds['Junior Secondary'], name: 'JSS 1', ordinal: 10 },
        { section_id: secIds['Junior Secondary'], name: 'JSS 2', ordinal: 11 },
        { section_id: secIds['Junior Secondary'], name: 'JSS 3', ordinal: 12 },
        { section_id: secIds['Senior Secondary'], name: 'SSS 1', ordinal: 13 },
        { section_id: secIds['Senior Secondary'], name: 'SSS 2', ordinal: 14 },
        { section_id: secIds['Senior Secondary'], name: 'SSS 3', ordinal: 15 }
      ];
      await knex('school_grades').insert(grades);
      
      // 3. Extract unique arms from students and classes to seed school_arms
      const studentArms = await knex('students').distinct('section').whereNotNull('section');
      const classArms = await knex('classes').distinct('section').whereNotNull('section');
      const uniqueArms = new Set([...studentArms, ...classArms].map(a => a.section).filter(Boolean));
      
      if (uniqueArms.size > 0) {
        await knex('school_arms').insert([...uniqueArms].map(name => ({ name })));
      }

      // 4. Data Mapping (Best Effort)
      const allGrades = await knex('school_grades').select('id', 'name');
      const allArms = await knex('school_arms').select('id', 'name');

      // Update Students
      for (const g of allGrades) {
        await knex('students').where('grade_level', g.name).update({ grade_id: g.id });
      }
      for (const a of allArms) {
        await knex('students').where('section', a.name).update({ arm_id: a.id });
      }

      // Update Classes
      for (const g of allGrades) {
        await knex('classes').where('category', g.name).update({ grade_id: g.id });
      }
      for (const a of allArms) {
        await knex('classes').where('section', a.name).update({ arm_id: a.id });
      }
    });
};

exports.down = function(knex) {
  return knex.schema
    .table('classes', (table) => {
      table.dropColumn('grade_id');
      table.dropColumn('arm_id');
      table.dropColumn('academic_period_id');
    })
    .table('students', (table) => {
      table.dropColumn('grade_id');
      table.dropColumn('arm_id');
    })
    .dropTableIfExists('school_arms')
    .dropTableIfExists('school_grades')
    .dropTableIfExists('school_sections');
};
