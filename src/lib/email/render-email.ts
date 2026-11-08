import { EMAIL_COLORS as C } from './email-colors';

export type EmailContent = {
  title: string;
  paragraphs: string[];
  details?: ReadonlyArray<readonly [string, string]>;
  action?: { label: string; url: string };
};

const FONT = "Manrope, 'Segoe UI', Arial, sans-serif";

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function detailRows(details: EmailContent['details'] = []): string {
  return details
    .map(([label, value]) => `<tr><td style="padding:6px 16px 6px 0;color:${C['muted-foreground']}">${escapeHtml(label)}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`)
    .join('');
}

function actionButton(action: EmailContent['action']): string {
  if (!action) return '';
  const style = `display:inline-block;padding:14px 28px;border-radius:9999px;background:${C.primary};color:${C.foreground};font-weight:600;text-decoration:none`;
  return `<p style="margin:24px 0 0"><a href="${escapeHtml(action.url)}" style="${style}">${escapeHtml(action.label)}</a></p>`;
}

function html(content: EmailContent): string {
  const paragraphs = content.paragraphs.map((text) => `<p style="margin:0 0 12px;line-height:1.6">${escapeHtml(text)}</p>`).join('');
  const card = `background:${C.background};border-radius:30px;padding:32px;max-width:560px;margin:0 auto`;
  return [
    `<div style="background:${C.muted};padding:24px 12px;font-family:${FONT};color:${C.foreground}">`,
    `<div style="${card}">`,
    `<h1 style="margin:0 0 16px;font-size:24px;font-weight:500">${escapeHtml(content.title)}</h1>`,
    paragraphs,
    `<table role="presentation" style="margin-top:12px;border-collapse:collapse">${detailRows(content.details)}</table>`,
    actionButton(content.action),
    `<p style="margin:32px 0 0;color:${C['muted-foreground']};font-size:13px">Lisandro López · Licenciado en Nutrición</p>`,
    '</div></div>',
  ].join('');
}

function text(content: EmailContent): string {
  const details = (content.details ?? []).map(([label, value]) => `${label}: ${value}`);
  const action = content.action ? [`${content.action.label}: ${content.action.url}`] : [];
  return [content.title, '', ...content.paragraphs, '', ...details, ...action, '', 'Lisandro López · Licenciado en Nutrición'].join('\n');
}

export function renderEmail(content: EmailContent): { html: string; text: string } {
  return { html: html(content), text: text(content) };
}
