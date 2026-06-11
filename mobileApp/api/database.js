import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = "SchoolAdmin.db";

const initDB = async () => {
  let db;
  try {
    db = await SQLite.openDatabase({ name: database_name, location: 'default' });
    console.log("Database opened");

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        grade_level TEXT,
        status TEXT,
        sync_status TEXT DEFAULT 'synced'
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        class_id INTEGER,
        day TEXT NOT NULL,
        present INTEGER NOT NULL,
        sync_status TEXT DEFAULT 'synced'
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
        table_name TEXT NOT NULL,
        data TEXT, -- JSON string of the payload
        record_id INTEGER, -- Local ID if applicable
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return db;
  } catch (error) {
    console.log(error);
    throw Error("Failed to initialize database");
  }
};

let dbInstance = null;

export const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
};
