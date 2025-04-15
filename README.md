# ORM class implementation ( Shaw and partners live coding test )

## About

A Type-Safe Object-Relational Mapping (ORM) system with Schema Validation in TypeScript. The ORM should support table creation, data insertion, retrieval, updating, and deletion while enforcing schema constraints, ensuring strong type safety.

## Features

- Create tables with predefined schemas.
- Insert records while ensuring schema validation.
- Retrieve all records from a table.
- Update records by ID with schema validation.
- Delete records by ID.
- Ensure strict type safety
- Error handling to return meaningful error messages for invalid operations
- Prevent inserting fields that are not part of the schema using TypeScript’s type system.

## Schema validation enforces :

- Required fields (notNull).
- Data type constraints (e.g., string, number).
- Allowed schema properties (rejecting unknown fields).
