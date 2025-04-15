interface fieldParameters {
  type: "integer" | "text";
  primaryKey?: boolean;
  autoIncrement?: boolean;
  notNull?: boolean;
}

interface schemaType {
  [key: string]: fieldParameters;
}

type GetType<T extends schemaType> = {
  [K in keyof T as T[K]["notNull"] extends true
    ? K
    : never]: T[K]["type"] extends "integer"
    ? number
    : T[K]["type"] extends "text"
    ? string
    : never;
} & {
  [K in keyof T as T[K]["notNull"] extends false
    ? K
    : never]?: T[K]["type"] extends "integer"
    ? number
    : T[K]["type"] extends "text"
    ? string
    : never;
};

class ORM {
  private currentTable: string;
  private tablesSchemas: Record<string, GetType<schemaType>>;
  private tables: Map<string, any[]>;

  constructor() {
    this.currentTable = "";
    this.tablesSchemas = {};
    this.tables = new Map();
  }

  // private checkSchema(schema:schemaType,insertedFields:any){}

  createTable(tableName: string, schema: { [key: string]: fieldParameters }) {
    let modifiedSchema = {};
    this.tablesSchemas.set(tableName, schema);
    this.tables.set(tableName, []);
  }

  table(tableName: string) {
    if (!this.tablesSchemas.has(tableName)) {
      throw new Error("Table is not available");
    }
    this.currentTable = tableName;
    return this;
  }

  getTables() {
    return Array.from(this.tablesSchemas.keys());
  }

  insert(row: schemaType) {
    let recordedSchema = this.tablesSchemas.get(this.currentTable);
    for (let field in recordedSchema) {
      if (field === "id") continue;
      if (!row.hasOwnProperty(field))
        throw new Error("Field doesn't exist in schema");
      // type fieldType = field.type ==='' ? string:number
    }
    this.currentTable = "";
  }

  getAll(): fieldParameters[] {
    let table = this.tables.get(this.currentTable);
    this.currentTable = "";
    return table;
  }

  deleteById(id: number) {
    let deletedRow = this.tables
      .get(this.currentTable)
      ?.find((el) => el.id === id);
    this.tables.set(
      this.currentTable,
      this.tables.get(this.currentTable)?.filter((el) => el.id !== id)!
    );

    return deletedRow;
  }

  update(id: number) {}
}

// ===============================================================================
// ===============================================================================
// ===============================================================================

// All your code and changes should be above this line
const orm = new ORM();

orm.createTable("users", {
  // Consider that id will always exist and always will be primaryKey and autoIncrement
  id: { type: "integer", primaryKey: true, autoIncrement: true },
  name: { type: "text", notNull: true },
  email: { type: "text", notNull: true },
});

orm.createTable("messages", {
  id: { type: "integer", primaryKey: true, autoIncrement: true },
  title: { type: "text", notNull: true },
  description: { type: "text", notNull: true },
});

console.log("getTables:", orm.getTables());
// getTables: [ 'users', 'messages' ]

console.log(
  "insert:",
  orm.table("users").insert({ name: "John Doe", email: "john.doe@email.com" })
);
// insert: { id: 1, name: 'John Doe', email: 'john.doe@email.com' }

console.log(
  "insert:",
  orm.table("users").insert({ name: "Jane Doe", email: "jane.doe@email.com" })
);
// insert: { id: 2, name: 'Jane Doe', email: 'jane.doe@email.com' }

console.log("getAll:", orm.table("users").getAll());
// getAll: [
//   { id: 1, name: 'John Doe', email: 'john.doe@email.com' },
//   { id: 2, name: 'Jane Doe', email: 'jane.doe@email.com' }
// ]

console.log("delete:", orm.table("users").deleteById(2));
// delete: { id: 2, name: 'Jane Doe', email: 'jane.doe@email.com' }

console.log("getAll:", orm.table("users").getAll());
// getAll: [ { id: 1, name: 'John Doe', email: 'john.doe@email.com' } ]

console.log(
  "insert:",
  orm
    .table("users")
    .insert({ name: "Joseph Doe", email: "joseph.doe@email.com" })
);
// insert: { id: 3, name: 'Joseph Doe', email: 'joseph.doe@email.com' }

console.log("getAll:", orm.table("users").getAll());
// getAll: [
//    { id: 1, name: 'John Doe', email: 'john.doe@email.com' },
//    { id: 3, name: 'Joseph Doe', email: 'joseph.doe@email.com' }
// ]

console.log(
  "update:",
  orm.table("users").update(1, { name: "John Doe Updated" })
);
// update: { id: 1, name: 'John Doe Updated', email: 'john.doe@email.com' }

console.log("getAll", orm.table("users").getAll());
// getAll: [
//    { id: 1, name: 'John Doe Updated', email: 'john.doe@email.com' },
//    { id: 3, name: 'Joseph Doe', email: 'joseph.doe@email.com' }
// ]

/*
 * *************
 * *** BONUS ***
 * *************
 */

console.log("\n BONUS \n");

console.log(
  "insert:",
  orm.table("messages").insert({ description: "A message description" })
);
// insert: Invalid: title cannot be null

console.log("insert:", orm.table("users").insert({ name: "John Doe" }));
// insert: Invalid: email cannot be null

console.log(
  "insert:",
  orm.table("users").insert({ name: 10, email: "john.doe@email.com" })
);
// insert: Invalid: name must be a string

console.log("update:", orm.table("users").update(3, { name: 10 }));
// update: Invalid: name must be a string

console.log(
  "update:",
  orm.table("users").update(3, { name: "Other", lastName: "Person" })
);
// update: Invalid: lastName doesnt exists on schema

console.log("insert:", orm.table("messages").insert({ name: "John Doe" }));
// insert: Invalid: name doesnt exists on schema
