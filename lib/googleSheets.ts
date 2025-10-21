// lib/googleSheets.ts
import { google } from "googleapis";
import "dotenv/config";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = process.env;

if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
  throw new Error(
    "Variáveis de ambiente não configuradas corretamente. Verifique GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY e GOOGLE_SHEET_ID."
  );
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: GOOGLE_CLIENT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function ensureSheetExists(sheetName: string) {
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: GOOGLE_SHEET_ID });

  const sheetExists = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    });
    console.log(`Aba "${sheetName}" criada com sucesso.`);
  }
}

/**
 * Adiciona uma ou mais linhas na aba especificada.
 * @param rows Array de linhas, cada linha é string[]
 */
export async function appendIdeaToSheet(rows: string[][], sheetName = "Ideias") {
  if (!rows || !rows.length) return;

  await ensureSheetExists(sheetName);

  const range = `${sheetName}!A:E`; // ajuste conforme suas colunas

  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: rows },
    });

    console.log(`${rows.length} linha(s) adicionada(s) com sucesso.`);
    return res.data;
  } catch (error) {
    console.error("Erro ao adicionar linha(s):", error);
    throw error;
  }
}
