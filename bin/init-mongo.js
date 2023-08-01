// Create new database named database
const database = db.getSiblingDB("database");

database.createCollection("todos");
database.todos.insertMany([
  {
    _id: ObjectId("64c6e66b0888c73767b70d4e"),
    dueDate: new Date(2023, 0, 1),
    message: "Do something",
    labelId: "0001",
  },
]);

database.createCollection("labels");
database.labels.insertMany([
  {
    id: "0001",
    name: "Chore",
  },
]);
