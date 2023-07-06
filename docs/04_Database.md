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

`npx prisma migrate save --name <lower_case_name>`

This model represents a single database table. When this model is executed it will create a table *Todo* and add each field.
- Each field has a name and a data type
- *id* is the primary key, unique identifier


`nest generate service prisma`

-> [How I Build Backend Services in 2022 - YouTube](https://www.youtube.com/watch?v=twi33GVRazE)

**Relationship between tables**
1 model = 1 table

**Basic relational database glossary**:
* *Primary key*: Unique identifier for each record in a table.
* *Foreign key*: References the primary key of another table to establish a relationship.
* *Junction table*: A table used in a many-to-many relationship to connect the primary keys of two related tables. It stores the relationships between records from both tables.

**3 types of relationship**
Relationships between tables are represented using special directives and fields within the schema 
* *One-to-One Relationship*:
  * example: User and Profile => Each user can have only one profile, and each profile belongs to only one user.
  ```
  model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  profile Profile @relation(fields: [profileId], references: [id])
  profileId Int
  }

  model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique
  }
  ```
  * the @relation directive establishes the relationship between the 2 models. 
  * The fields argument specifies the foreign key fields
  * the references argument specifies the primary key fields of the referenced model.
  * NB : the value of the profileId field in the User table matchs the value of the id field in the corresponding Profile table

* *One-to-Many Relationship*:
  * example: User and Post => Each user can have multiple posts, but each post belongs to only one user. 
  ```
  model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  posts Post[]
  }

  model Post {
  id      Int    @id @default(autoincrement())
  title   String
  content String
  user    User   @relation(fields: [userId], references: [id])
  userId  Int
  }
  ```
  * the User model has an array field posts representing the one-to-many relationship with the Post model
  * The @relation directive is used to establish the relationship (as in the one-to-one relationship)
* Many-to-Many Relationship
  * example: User and Group => multiple users can belong to multiple groups
  ```
  model User {
  id     Int     @id @default(autoincrement())
  name   String
  email  String  @unique
  groups Group[] @relation("UserToGroup", references: [id])
  }

  model Group {
  id    Int    @id @default(autoincrement())
  name  String
  users User[] @relation("UserToGroup")
  }
  ```
  * To represent a many-to-many relationship between two tables, you can use an intermediate table to join them
  * In Prisma an intermediate table is not explicitly defined in the schema,but it's automatically created behind the scenes.
  * The @relation directive is used to establish the relationship between the tables
  * the reference can be defined either in the User model (as groups Group[] @relation("UserToGroup", references: [id])) or in the Group model (users User[] @relation("GroupToUser", references: [id])), depending on where the focus is set in the App.
  * NB : the @relation directive is used to establish the relationship between two models, and it requires a unique same name in both the sides of the relationship, that represents the name of the relationship itself and is arbitrary chosen.