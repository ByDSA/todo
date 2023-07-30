import { App } from "@app/main";
import StatusCode from "@app/utils/http/StatusCode";
import request from "supertest";
import { assertIsModel } from "../models";
import MockRepository, { TodoValues } from "./mock.repository";

const newItem = {
  id: "99",
  message: "cosa rara",
  labelId: "1",
  dueDate: new Date("2023-07-01T00:00:00.000Z"),
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { dueDate: _, ...newItemWithoutDueDate } = newItem;
const URL = "/api/todos";

describe("Todo CRUD", () => {
  const app = new App( {
    todo: {
      repository: new MockRepository(),
    },
    db: {
      useDB: false,
    },
    label: {
      cachingService: null,
    },
  } );
  const expressApp = app.getInnerInstance();

  describe("GET", () => {
    it("should get a todo", async () => {
      const response = await request(expressApp)
        .get(`${URL}/1`)
        .expect(200)
        .expect("Content-Type", /json/)
        .send();
      const todo = response.body;

      assertIsModel(todo);
    } );

    it("should not get a todo", async () => {
      const response = await request(expressApp)
        .get(`${URL}/${newItem.id}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);

      expect(response.body).toEqual( {
      } );
    } );

    it("should throw an error at trying to get a todo with no id provided", async () => {
      const response = await request(expressApp)
        .get(URL);

      expect(response.status).toBe(StatusCode.NOT_FOUND);

      expect(response.body).toEqual( {
      } );
    } );
  } );

  describe("CREATE", () => {
    it("should create a new todo", async () => {
      const keysBeforeUpdateModel = Object.keys(TodoValues);

      await request(expressApp)
        .post(URL)
        .expect(StatusCode.CREATED)
        .send(newItem);

      const keysAfterUpdateModel = Object.keys(TodoValues);

      expect(keysAfterUpdateModel.length).toBe(keysBeforeUpdateModel.length + 1);
      const newKey = keysAfterUpdateModel.at(-1);
      const newId = newKey ? TodoValues[newKey].id : undefined;
      const response = await request(expressApp)
        .get(`${URL}/${newId}`)
        .expect(StatusCode.OK)
        .expect("Content-Type", /json/)
        .send();
      const todo = response.body;

      assertIsModel(todo);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
      const { dueDate: _, ...todoWithoutDueDate } = newItem;

      expect(todoWithoutDueDate).toStrictEqual(newItemWithoutDueDate);
      expect(todo.dueDate).toBe(newItem.dueDate.toISOString());
    } );

    it("should throw an error at trying to create a new item with no data provided", async () => {
      await request(expressApp)
        .post(URL)
        .expect(StatusCode.UNPROCESSABLE_ENTITY)
        .send();
    } );

    it("should throw an error at trying to create a new item with insufficient data provided", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
      const { message: _, ...insufficientData } = newItem;

      await request(expressApp)
        .post(URL)
        .expect(StatusCode.UNPROCESSABLE_ENTITY)
        .send(insufficientData);
    } );
  } );

  describe("UPDATE", () => {
    it("should update an existent todo", async () => {
      const beforeUpdateModel = await request(expressApp)
        .get(`${URL}/1`)
        .expect(StatusCode.OK)
        .send();

      expect(beforeUpdateModel.body.message).toBe("Do something");

      await request(expressApp)
        .patch(`${URL}/1`)
        .expect(StatusCode.OK)
        .send( {
          message: "cosa rara",
        } );

      const afterUpdateModel = await request(expressApp)
        .get(`${URL}/1`)
        .expect(StatusCode.OK)
        .send();

      expect(afterUpdateModel.body.message).toBe("cosa rara");
    } );

    it("should throw a 404 error trying update an inexistent todo", async () => {
      await request(expressApp)
        .patch(`${URL}/1234`)
        .expect(StatusCode.NOT_FOUND)
        .send( {
          message: "cosa rara",
        } );
    } );

    it("should throw a 404 error with no id provided", async () => {
      await request(expressApp)
        .patch(URL)
        .expect(StatusCode.NOT_FOUND)
        .send( {
          message: "cosa rara",
        } );
    } );
  } );

  describe("DELETE", () => {
    it("should delete an existent todo", async () => {
      await request(expressApp)
        .get(`${URL}/1`)
        .expect(StatusCode.OK)
        .send();

      await request(expressApp)
        .delete(`${URL}/1`)
        .expect(StatusCode.OK)
        .send();

      await request(expressApp)
        .get(`${URL}/1`)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );

    it("should throw a 404 error trying deleting an inexistent todo", async () => {
      await request(expressApp)
        .delete(`${URL}/1234`)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );

    it("should throw a 404 error with no id provided", async () => {
      await request(expressApp)
        .delete(URL)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );
  } );

  describe("Unused HTTP Verbs", () => {
    it("should throw a 404 error trying to request with PUT", async () => {
      await request(expressApp)
        .put(`${URL}/1`)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );
  } );
} );
