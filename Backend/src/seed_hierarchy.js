const { db } = require('./db');

function seed() {
  console.log('Seeding hierarchical data...');

  const hierarchy = [
    { section: 'Nursery School', grades: ['Nursery 1', 'Nursery 2', 'Nursery 3'] },
    { section: 'Primary School', grades: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'] },
    { section: 'Junior Secondary School', grades: ['JSS 1', 'JSS 2', 'JSS 3'] },
    { section: 'Senior Secondary School', grades: ['SSS 1', 'SSS 2', 'SSS 3'] }
  ];

  for (const item of hierarchy) {
    db.prepare('INSERT OR IGNORE INTO sections (name) VALUES (?)').run(item.section);
    
    const section = db.prepare('SELECT id FROM sections WHERE name = ?').get(item.section);
    const sectionId = section.id;

    for (let i = 0; i < item.grades.length; i++) {
      db.prepare('INSERT OR IGNORE INTO grade_levels (section_id, name, level_order) VALUES (?, ?, ?)')
        .run(sectionId, item.grades[i], i + 1);
    }
  }
  console.log('Hierarchy seeded successfully.');
}

seed();
