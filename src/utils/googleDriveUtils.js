import { google } from "googleapis";

/*  EXECEL DE TEST
https://docs.google.com/spreadsheets/d/13G4VniwL6rGSgYOTnOfZDkZ1191WUy7B07lYve3QwJw/edit?usp=sharing
*/

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const keyFile = "./credentials.json";
const spreadsheetId = "1fakjS91ERmG3XLBz18BR1pwihV8CnPP3OvMw5cZnt98";
const valueInputOption = "USER_ENTERED";

const RANGETOREAD = "A1:G1";
const RANGETOWRITE = "A2:G2";

const authorize = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: SCOPES,
    });

    const authClient = await auth.getClient();
    return authClient;
  } catch (error) {
    console.error("Error al autorizar:", error);
    throw new Error("Error al autorizar");
  }
};

const getSheetHeaders = async () => {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });
    const range = RANGETOREAD;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    console.log("Obteniendo encabezados del Spreadsheet:", response);
    const headers = response.data.values[0];
    console.log("Encabezados:", headers);
    return headers;
  } catch (error) {
    console.error("Error al obtener los encabezados:", error);
    throw new Error("Error al obtener los encabezados");
  }
};

const saveDataToSheet = async (data) => {
  try {
    const auth = await authorize();
    const sheets = google.sheets({ version: "v4", auth });

    const headers = await getSheetHeaders();

    const row = headers.map((header) => {
      switch (header.toLowerCase()) {
        case "fecha":
          return data.fecha;
        case "modelo":
          return data.modelo;
        case "articulo":
          return data.articulo;
        case "cantidad":
          return data.cantidad;
        case "motivo":
          return data.motivo;
        case "chofer":
          return data.chofer;
        case "otros":
          return data.otros;
        default:
          return "";
      }
    });

    const range = RANGETOWRITE;

    const request = {
      spreadsheetId,
      range,
      valueInputOption,
      resource: { values: [row] },
    };

    const response = await sheets.spreadsheets.values.append(request);

    return response;
  } catch (error) {
    console.error("Error al guardar los datos:", error);
    throw new Error("Error al guardar los datos");
  }
};

export { saveDataToSheet };
