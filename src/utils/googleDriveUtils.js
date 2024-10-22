import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = import.meta.env.GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID;
const valueInputOption = "USER_ENTERED";
const RANGETOREAD = "A1:G1";
const RANGETOWRITE = "A2:G2";

const authorize = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
      type: 'service_account',
      project_id: import.meta.env.GOOGLE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID,
      private_key_id: import.meta.env.GOOGLE_PRIVATE_KEY_ID || process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: import.meta.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY,
      client_email: import.meta.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL,
      client_id: import.meta.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
      auth_uri: import.meta.env.GOOGLE_AUTH_URI || process.env.GOOGLE_AUTH_URI,
      token_uri: import.meta.env.GOOGLE_TOKEN_URI || process.env.GOOGLE_TOKEN_URI,
      universeDomain: import.meta.env.GOOGLE_UNIVERSE_DOMAIN || process.env.GOOGLE_UNIVERSE_DOMAIN,
      auth_provider_x509_cert_url: import.meta.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL || process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: import.meta.env.GOOGLE_CLIENT_X509_CERT_URL || process.env.GOOGLE_CLIENT_X509_CERT_URL,
      },
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

    const headers = response.data.values[0];
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
