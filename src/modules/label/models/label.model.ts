// Para no poner magical strings
const enum Keys {
  ID = "id",
  NAME = "name",
}

type Label = {
  [Keys.ID]: string;
  [Keys.NAME]: string;
};
type ID = Label[Keys.ID]; // Para evitar escribir tan largo cada vez que se use

export default Label;

type CreationalModel = Label;

export {
  CreationalModel, ID, Keys,
};
