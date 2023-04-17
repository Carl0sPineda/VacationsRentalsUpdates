import axios from "axios";

describe("Nominatim API pruebas unitarias", () => {
  it("Mediante la latitud y longitud retorna la ubicacion de esta", async () => {
    // Define las coordenadas de prueba
    const latitude = 10.6168017;
    const longitude = -85.45166497940951;

    // Realiza una llamada a la API de Nominatim para obtener la ubicación
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    const response = await axios.get(url);
    const data = response.data;

    // Verifica que la latitud y longitud coincidan con los valores esperados
    expect([parseFloat(data.lat), parseFloat(data.lon)]).toEqual([
      latitude,
      longitude,
    ]);

    const expectedPlace =
      "UNA - Campus Liberia, Calle 32, El Capulín, Liberia, Cantón Liberia, Provincia Guanacaste, 50101, Costa Rica";
    const wrongPlace = "Liberia";
    expect(data.display_name).toBe(expectedPlace);
  });

  it("Mediante una ubicacion retorna la longitud y direccion de esta", async () => {
    // Define el lugar de prueba
    const place = "santa cruz, guanacaste";

    // Realiza una llamada a la API de Nominatim para obtener la ubicación
    const url = `https://nominatim.openstreetmap.org/search?q=${place}&format=jsonv2&limit=1`;
    const response = await axios.get(url);
    const data = response.data;

    // Verifica que la respuesta tenga al menos un resultado
    expect(data.length).toBeGreaterThan(0);

    // Obtiene la latitud y longitud del primer resultado
    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);

    // Verifica que la latitud y longitud coincidan con los valores esperados
    expect(latitude).toBeCloseTo(10.23575875);
    expect(longitude).toBeCloseTo(-85.66996320389299);
  });
});
