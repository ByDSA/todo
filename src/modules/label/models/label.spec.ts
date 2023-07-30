import { assertIsModel } from "./utils";

describe("should not throw any error", () => {
  const validLabels = [
    {
      id: "1",
      name: "Normal name",
    },
    {
      id: "0",
      name: "Zero id",
    },
    {
      id: "1234567890",
      name: "Long id",
    },
    {
      id: "-1",
      name: "Negative id",
    },
    {
      id: "asdfg",
      name: "Non-numeric id",
    },
  ];

  describe.each(validLabels)("with %p", (label) => {
    it("should not throw any error", () => {
      assertIsModel(label);
    } );
  } );
} );

describe("should throw an error", () => {
  const invalidLabels = [
    "a string",
    1234,
    null,
    undefined,
    [],
    {
      id: "Has no name",
    },
    {
      name: "Has no id",
    },
    {
    },
    {
      id: "",
      name: "Empty id",
    },
    {
      id: undefined,
      name: "Undefined id",
    },
    {
      id: null,
      name: "Null id",
    },
    {
      id: 1234,
      name: "Non-string id",
    },
    {
      id: "Empty name",
      name: "",
    },
    {
      id: "Undefined name",
      name: undefined,
    },
    {
      id: "Null name",
      name: null,
    },
    {
      id: "Non-string name",
      name: 1234,
    },
  ];

  describe.each(invalidLabels)("with label=%p", (label: any) => {
    it("should throw an error", () => {
      expect(() => assertIsModel(label)).toThrowError();
    } );
  } );
} );
