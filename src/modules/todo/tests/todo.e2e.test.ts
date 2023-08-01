/* eslint-disable no-underscore-dangle */
import express from "express";
import request from "supertest";
import { ExpressApp } from "@app/main";
import { LabelModelODM, LabelMongoRepository } from "@app/modules/label";
import { assertDefined } from "@app/utils";
import StatusCode from "@app/utils/http/StatusCode";
import { labelInitFixtures, todoInitFixtures } from "@tests/main/db/fixtures";
import { newItem } from "@tests/main/db/fixtures/todo.fixture";
import TestMongoDatabase from "@tests/main/db/test-mongo.database";
import Model, { Keys, assertIsModel } from "../models";
import { MongoRepository } from "../repositories";
import { ModelODM } from "../repositories/mongo";
import { ENDPOINT_URL } from "../todo.router";

const testDatabase = new TestMongoDatabase();

describe("Todo CRUD", () => {
  const app = new ExpressApp( {
    todo: {
      repository: new MongoRepository( {
        labelRepository: new LabelMongoRepository(),
      } ),
    },
    db: {
      instance: testDatabase,
    },
    label: {
      cachingService: null,
    },
  } );
  let expressApp: express.Application | null = null;

  beforeAll(async () => {
    await app.init();
    expressApp = app.getInnerInstance();
    assertDefined(expressApp);
    await loadFixtures();
  } );

  afterAll(async () => {
    await app.close();
  } );

  describe("GET", () => {
    it("should get a todo", async () => {
      const id = todoInitFixtures[0]._id;
      const response = await request(expressApp)
        .get(`${ENDPOINT_URL}/${id}`)
        .expect(200)
        .expect("Content-Type", /json/)
        .send();
      const todo = responseToModel(response.body);

      assertIsModel(todo);
    } );

    it("should not get a todo", async () => {
      // eslint-disable-next-line no-underscore-dangle
      const id = newItem._id;

      assertDefined(id);
      const response = await request(expressApp)
        .get(`${ENDPOINT_URL}/${id}`);

      expect(response.status).toBe(StatusCode.NOT_FOUND);

      expect(response.body).toEqual( {
      } );
    } );

    it("should get all todos with no id provided", async () => {
      const response = await request(expressApp)
        .get(ENDPOINT_URL);

      expect(response.status).toBe(StatusCode.OK);

      const responseBody = response.body;

      expect(responseBody).toBeInstanceOf(Array);

      expect(responseBody.length).toBeGreaterThan(0);

      responseBody
        .map(responseToModel)
        .forEach(assertIsModel);
    } );
  } );

  describe("CREATE", () => {
    describe("should create a new todo", () => {
      let itemCountBeforeCreate: number;

      beforeAll(async () => {
        itemCountBeforeCreate = await ModelODM.count( {
        } );
      } );

      it("should return CREATED status code", async () => {
        await request(expressApp)
          .post(ENDPOINT_URL)
          .expect(StatusCode.CREATED)
          .send(newItem);
      } );

      it("item count should increase by 1", async () => {
        const itemCountAfterCreate = await ModelODM.count( {
        } );

        expect(itemCountAfterCreate).toBe(itemCountBeforeCreate + 1);
      } );

      it("should new todo to be in db", async () => {
        const newItemFound = await ModelODM.findOne( {
          message: newItem.message,
        } );

        assertDefined(newItemFound);
        const response = await request(expressApp)
          .get(`${ENDPOINT_URL}/${newItemFound._id}`)
          .expect(StatusCode.OK)
          .expect("Content-Type", /json/)
          .send();
        const responseBody = response.body;
        const todo: Model = responseToModel(responseBody);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dueDate: _1, ...todoWithoutDueDate } = todo;
        const newItemWithLabel: Model = {
          id: newItemFound.id,
          dueDate: new Date(newItem.dueDate),
          message: newItem.message,
          label: labelInitFixtures[0],
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dueDate: _2, ...newItemWithoutDueDate } = newItemWithLabel;

        expect(todoWithoutDueDate).toStrictEqual(newItemWithoutDueDate);
        expect(todo.dueDate.toISOString()).toBe(newItem.dueDate.toString());
      } );
    } );

    it("should throw an error trying to create a TODO with a unexisting label", () => {
      const unexistingLabelId = "1234";

      return request(expressApp)
        .post(ENDPOINT_URL)
        .expect(StatusCode.UNPROCESSABLE_ENTITY)
        .send( {
          ...newItem,
          labelId: unexistingLabelId,
        } );
    } );

    it("should throw an error at trying to create a new item with no data provided", async () => {
      await request(expressApp)
        .post(ENDPOINT_URL)
        .expect(StatusCode.UNPROCESSABLE_ENTITY)
        .send();
    } );

    it("should throw an error at trying to create a new item with insufficient data provided", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-shadow
      const { message: _, ...insufficientData } = newItem;

      await request(expressApp)
        .post(ENDPOINT_URL)
        .expect(StatusCode.UNPROCESSABLE_ENTITY)
        .send(insufficientData);
    } );
  } );

  describe("UPDATE", () => {
    it("should update an existent todo", async () => {
      const id = todoInitFixtures[0]._id;
      const beforeUpdateModel = await request(expressApp)
        .get(`${ENDPOINT_URL}/${id}`)
        .expect(StatusCode.OK)
        .send();

      expect(beforeUpdateModel.body.message).toBe("Do something");

      await request(expressApp)
        .patch(`${ENDPOINT_URL}/${id}`)
        .expect(StatusCode.OK)
        .send( {
          message: "cosa rara",
        } );

      const afterUpdateModel = await request(expressApp)
        .get(`${ENDPOINT_URL}/${id}`)
        .expect(StatusCode.OK)
        .send();

      expect(afterUpdateModel.body.message).toBe("cosa rara");
    } );

    it("should throw an error trying to update a TODO with a unexisting label", () => {
      const id = todoInitFixtures[0]._id;
      const unexistingLabelId = "1234";

      return request(expressApp)
        .patch(`${ENDPOINT_URL}/${id}`)
        .expect(StatusCode.UNPROCESSABLE_ENTITY)
        .send( {
          message: "cosa rara",
          labelId: unexistingLabelId,
        } );
    } );

    it("should throw a 404 error trying to update an inexistent todo", async () => {
      await request(expressApp)
        .patch(`${ENDPOINT_URL}/1234`)
        .expect(StatusCode.NOT_FOUND)
        .send( {
          message: "cosa rara",
        } );
    } );

    it("should throw a 404 error with no id provided", async () => {
      await request(expressApp)
        .patch(ENDPOINT_URL)
        .expect(StatusCode.NOT_FOUND)
        .send( {
          message: "cosa rara",
        } );
    } );
  } );

  describe("DELETE", () => {
    it("should delete an existent todo", async () => {
      const existingId = todoInitFixtures[0]._id;

      await request(expressApp)
        .get(`${ENDPOINT_URL}/${existingId}`)
        .expect(StatusCode.OK)
        .send();

      await request(expressApp)
        .delete(`${ENDPOINT_URL}/${existingId}`)
        .expect(StatusCode.OK)
        .send();

      await request(expressApp)
        .get(`${ENDPOINT_URL}/${existingId}`)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );

    it("should throw a 404 error trying deleting an inexistent todo", async () => {
      await request(expressApp)
        .delete(`${ENDPOINT_URL}/1234`)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );

    it("should throw a 404 error with no id provided", async () => {
      await request(expressApp)
        .delete(ENDPOINT_URL)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );
  } );

  describe("Unused HTTP Verbs", () => {
    it("should throw a 404 error trying to request with PUT", async () => {
      await request(expressApp)
        .put(`${ENDPOINT_URL}/`)
        .expect(StatusCode.NOT_FOUND)
        .send();
    } );
  } );
} );

async function loadFixtures() {
  await testDatabase.drop();
  console.log("Loading fixtures");
  console.log("Loading TODO fixtures");
  await LabelModelODM.deleteMany();
  await LabelModelODM.insertMany(labelInitFixtures);
  console.log("Loading LABEL fixtures");
  await ModelODM.deleteMany();
  await ModelODM.insertMany(todoInitFixtures);
}

type ResponseModel = Omit<Model, Keys.DUE_DATE> & { [Keys.DUE_DATE]: string };
function responseToModel(responseBody: ResponseModel): Model {
  const { dueDate, ...rest } = responseBody;
  const ret = {
    ...rest,
    dueDate: new Date(dueDate),
  };

  assertIsModel(ret);

  return ret;
}
