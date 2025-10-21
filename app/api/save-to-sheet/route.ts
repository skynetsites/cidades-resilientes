import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

function flattenComments(comments: any[], level = 0): string {
  return comments
    .map(c => {
      const indent = "    ".repeat(level);
      const line = `${indent}${c.author}: ${c.text}`;
      const replies = c.replies && c.replies.length ? "\n" + flattenComments(c.replies, level + 1) : "";
      return line + replies;
    })
    .join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const sheets = await getSheets();
    const commentsStr = data.comments ? flattenComments(data.comments) : "";

    const now = new Date();
    const formattedDate = now.toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });

    // Ler todas as linhas
    const sheetData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Ideias!A:H",
    });
    const rows = sheetData.data.values || [];
    let rowIndex = rows.findIndex(row => row[0] === data.ideaId);

    if (rowIndex >= 0) {
      // Atualiza comentários e data
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Ideias!G${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: "RAW",
        requestBody: { values: [[commentsStr, formattedDate]] },
      });
    } else {
      // Cria nova linha
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Ideias!A:H",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              data.ideaId || "",
              data.author || "Anônimo",
              data.email || "",
              data.city || "",
              data.idea || "",
              data.likes ?? 0,
              commentsStr,
              formattedDate,
            ],
          ],
        },
      });
      // Re-ler todas as linhas para pegar o índice da nova linha
      const newSheetData = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "Ideias!A:H",
      });
      rowIndex = (newSheetData.data.values || []).findIndex(row => row[0] === data.ideaId);
    }

    // Aplica alinhamento left / middle na linha correta
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 0,
                endColumnIndex: 8,
              },
              cell: {
                userEnteredFormat: {
                  horizontalAlignment: "LEFT",
                  verticalAlignment: "MIDDLE",
                },
              },
              fields: "userEnteredFormat(horizontalAlignment,verticalAlignment)",
            },
          },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar na planilha:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
