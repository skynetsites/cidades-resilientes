import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// ID da planilha do Google
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;

// Função para salvar dados na planilha
async function appendToSheet(nome: string, email: string, cidade: string, mensagem: string) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Formatar data em PT-BR
  const now = new Date();
  const formattedDate = now.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Emails!A:E",
    valueInputOption: "RAW",
    requestBody: {
      values: [[nome, email, cidade, mensagem, formattedDate]],
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, cidade, mensagem } = await req.json();

    // 1️⃣ Salva na planilha
    await appendToSheet(nome, email, cidade, mensagem);

    // 2️⃣ Configura SMTP para envio de e-mails
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3️⃣ Carrega templates de e-mail
    const adminTemplatePath = path.join(process.cwd(), "templates/admin-template.html");
    const confirmationTemplatePath = path.join(process.cwd(), "templates/confirmation-template.html");

    const adminHtml = fs.readFileSync(adminTemplatePath, "utf-8")
      .replace("{{nome}}", nome)
      .replace("{{cidade}}", cidade)
      .replace("{{mensagem}}", mensagem);

    const confirmationHtml = fs.readFileSync(confirmationTemplatePath, "utf-8")
      .replace("{{nome}}", nome);

    // 4️⃣ Envia e-mail para administrador
    await transporter.sendMail({
      from: `"Campanha Inteligente" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_TO,
      subject: `Nova inscrição de ${nome}`,
      html: adminHtml,
    });

    // 5️⃣ Envia e-mail de confirmação para inscrito
    await transporter.sendMail({
      from: `"Campanha Inteligente" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Confirmação de inscrição na campanha",
      html: confirmationHtml,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao processar inscrição:", error);
    return NextResponse.json({ success: false, error: "Erro ao processar inscrição" }, { status: 500 });
  }
}
