[Home Page](./00_Documentation.md)
# Database

## CRUD
- [CRUD - definition & overview | Sumo Logic](https://www.sumologic.com/glossary/crud/#:~:text=CRUD%20Meaning%3A%20CRUD%20is%20an,%2C%20read%2C%20update%20and%20delete)

**CRUD** is an acronym that stands for Create, Read, Update, and Delete. It is a set of four basic operations that are commonly used in database management.

Here is a breakdown of each CRUD operation:
- **Create**: Create new records or entities in a database. It involves inserting new data into the database.
- **Read**: Retrieve or read existing records or entities from a database. It involves querying the database to retrieve specific data.
- **Update**: Modify or update existing records or entities in a database. It involves changing the values of certain fields or attributes of a record.
- **Delete**: Remove or delete existing records or entities from a database. It involves removing data from the database.

## ORM

To connect to that database, you can use native drivers. For example, when working with Node.js as the backend and MySQL as the database, you can choose to use a MySQL native driver provided by the Node.js NPM.

However, they do not provide a way to modify or validate the data structures or a way to model the relationships between the databases. This means that you can’t model your data relations, seed, or migrate them.

Other options would be to use an ORM (object-relational mapper). This makes it easier for a developer to connect a Node.js backend to a MongoDB database.

ORM will introduce you to some new features like:

- Modeling
- Validating
- Migrating data
- Describing the relationships between different data fields, and so on.

### Prisma
**Modeling schemas:**
Models represent the entities of your application domains. A model maps to a table on the database.

```
model Todo {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
  title String
  description String?
  completed Boolean @default(false)
}
```

This model represents a single database table. When this model is executed it will create a table *Todo* and add each field.
- Each field has a name and a data type
- *id* is the primary key, unique identifier
