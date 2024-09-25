import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const authorize = () => {
  const oAuth2Client = new google.auth.OAuth2(
    import.meta.env.GOOGLE_CLIENT_ID,
    import.meta.env.GOOGLE_CLIENT_SECRET,
    import.meta.env.GOOGLE_REDIRECT_URI
  );

  if (import.meta.env.GOOGLE_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: import.meta.env.GOOGLE_REFRESH_TOKEN });
  } else {
    getNewToken(oAuth2Client);
  }
  return oAuth2Client;
};

const getNewToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
};

const saveDataToSheet = async (data, id = null) => {
  const auth = authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = '14awT3frH4xoYt8UCBcypDt-3tbQN9kU1QSxvAv0lSwg';

  if (id) {
    // Edit existing row
    const update = [
      data.id,
      data.cliente,
      data.email,
      data.modelo,
      data.problema,
      new Date().toISOString(),
      data.comentario,
    ];
    const filaAEditar = parseInt(id) + 1;
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `PLANILLA DE CONTROL - FIN DE REPARTO WEB DB!A${filaAEditar}:G${filaAEditar}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [update],
      },
    });
    console.log(`Datos editados en el Spreadsheet: ${spreadsheetId}`);
    return response;
  } else {
    // Add new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'PLANILLA DE CONTROL - FIN DE REPARTO WEB DB',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [data.fecha, data.camioneta, data.articulo, data.cantidad, data.motivo, data.chofer, data.otros],
        ],
      },
    });
    console.log(`Datos agregados al Spreadsheet: ${spreadsheetId}`);
  }
};

export { saveDataToSheet };