const ARGENTINA_MOBILE = '549';

export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('54')) return digits;
  return `${ARGENTINA_MOBILE}${digits.replace(/^0/, '')}`;
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}
