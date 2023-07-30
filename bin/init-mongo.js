// Create new database named database
const database = db.getSiblingDB("database");

database.createCollection("todos");
database.createCollection("labels_cache");

database.todos.insertMany([
  {
    dueDate: new Date(2023, 0, 1),
    message: "Do something",
    labelId: "1",
  },
]);

database.labels_cache.insertMany([
  {
    id: "1",
    name: "Work",
  },
]);
