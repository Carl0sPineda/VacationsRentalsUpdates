import axios from "axios";

describe("Propiedades pruebas", () => {
  it("getAll: Retorna todo el array de objetos propiedades", async () => {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/listings`;
    const response = await axios.get(url);

    // Verificar que la respuesta tenga un código de estado 200 OK
    expect(response.status).toBe(200);
  });

  it("getById: Retorna una propiedad del array de objetos propiedades", async () => {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/listings/2RPoYnUQvgLGgUNO8AB1`;
    const response = await axios.get(url);

    // Verificar que la respuesta tenga un código de estado 200 OK
    expect(response.status).toBe(200);
  });
});
