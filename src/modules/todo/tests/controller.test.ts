/* eslint-disable no-underscore-dangle */
import express from "express";
import request from "supertest";
import { ExpressApp } from "@app/main";
import StatusCode from "@app/utils/http/StatusCode";
import { newItem } from "@tests/main/db/fixtures/todo.fixture";
import TodoController from "../todo.controller";
import { ENDPOINT_URL } from "../todo.router";
import MockRepository from "./mock.repository";

const mockRepository = new MockRepository();

it("should throw an error instancing a controller without repository", () => {
  expect(() => {
    // eslint-disable-next-line no-new
    new TodoController(undefined as any);
  } ).toThrow(TypeError);
} );

describe("Controller calls to repo", () => {
  const app = new ExpressApp( {
    todo: {
      repository: mockRepository,
    },
    label: {
      cachingService: null,
    },
  } );
  let expressApp: express.Application | null = null;

  beforeAll(async () => {
    await app.init();
    expressApp = app.getInnerInstance();
  } );

  beforeEach(() => {
    mockRepository.createOne.mockClear();
    mockRepository.getOneById.mockClear();
    mockRepository.updateOneById.mockClear();
    mockRepository.deleteOneById.mockClear();
  } );

  afterAll(async () => {
    await app.close();
  } );

  describe("GET", () => {
    it("should call 'getOneById' with any id provided", async () => {
      const anyId = calcRandomId();

      await request(expressApp)
        .get(`${ENDPOINT_URL}/${anyId}`)
        .send();

      expect(mockRepository.getOneById).toHaveBeenCalledTimes(1);
    } );

    it("should not call 'getOneById' with no id provided", async () => {
      await request(expressApp)
        .get(`${ENDPOINT_URL}`)
        .send();

      expect(mockRepository.getOneById).toHaveBeenCalledTimes(0);
    } );
  } );

  describe("CREATE", () => {
    it("should call 'getOneById' with new item provided", async () => {
      await request(expressApp)
        .post(ENDPOINT_URL)
        .send(newItem);

      expect(mockRepository.createOne).toHaveBeenCalledTimes(1);
    } );

    it("should call 'getOneById' anyways with no data provided", async () => {
      await request(expressApp)
        .post(ENDPOINT_URL)
        .send();

      expect(mockRepository.createOne).toHaveBeenCalledTimes(1);
    } );
  } );

  describe("UPDATE", () => {
    it("should call 'updateOneById' with any id provided", async () => {
      const anyId = calcRandomId();

      await request(expressApp)
        .patch(`${ENDPOINT_URL}/${anyId}`)
        .send( {
          message: "cosa rara",
        } );

      expect(mockRepository.updateOneById).toHaveBeenCalledTimes(1);
    } );

    it("should not call 'updateOneById' with no id provided", async () => {
      await request(expressApp)
        .patch(ENDPOINT_URL)
        .expect(StatusCode.NOT_FOUND)
        .send( {
          message: "cosa rara",
        } );

      expect(mockRepository.updateOneById).toHaveBeenCalledTimes(0);
    } );
  } );

  describe("DELETE", () => {
    it("should call 'deleteOneById' with any id provided", async () => {
      const anyId = calcRandomId();

      await request(expressApp)
        .delete(`${ENDPOINT_URL}/${anyId}`)
        .send();

      expect(mockRepository.deleteOneById).toHaveBeenCalledTimes(1);
    } );

    it("should not call 'deleteOneById' with no id provided", async () => {
      await request(expressApp)
        .delete(ENDPOINT_URL)
        .expect(StatusCode.NOT_FOUND)
        .send();

      expect(mockRepository.deleteOneById).toHaveBeenCalledTimes(0);
    } );
  } );

  describe("Unused HTTP Verbs", () => {
    describe("PUT", () => {
      it("should not call any repo function", async () => {
        await request(expressApp)
          .put(`${ENDPOINT_URL}`)
          .send();

        expect(mockRepository.getOneById).toHaveBeenCalledTimes(0);
        expect(mockRepository.createOne).toHaveBeenCalledTimes(0);
        expect(mockRepository.updateOneById).toHaveBeenCalledTimes(0);
        expect(mockRepository.deleteOneById).toHaveBeenCalledTimes(0);
      } );
    } );
  } );
} );

function calcRandomId() {
  return Math.ceil(Math.random() * 99999).toString();
}
