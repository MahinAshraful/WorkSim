export const initSqlJs = async () => {
  // Use dynamic import to avoid SSR issues
  const SQL = await import('sql.js');
  
  // Configure sql.js for browser environment
  const sqlWasm = await SQL.default({
    locateFile: (file: string) => {
      // Use CDN for WASM file to avoid bundling issues
      if (file.endsWith('.wasm')) {
        return `https://sql.js.org/dist/${file}`;
      }
      return file;
    }
  });
  
  return new sqlWasm.Database();
};

export const setupDatabase = async (db: any, schema: string, data: string) => {
  try {
    // Execute schema
    db.run(schema);
    
    // Insert data
    const statements = data.split(';').filter(s => s.trim());
    statements.forEach((statement: string) => {
      if (statement.trim()) {
        db.run(statement + ';');
      }
    });
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

export const executeQuery = (db: any, query: string) => {
  try {
    const result = db.exec(query);
    if (result.length === 0) {
      return { success: true, data: [], columns: [] };
    }
    
    const { columns, values } = result[0];
    const data = values.map((row: any[]) => 
      columns.reduce((acc: any, col: string, idx: number) => ({
        ...acc,
        [col]: row[idx]
      }), {})
    );
    
    return { success: true, data, columns };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};