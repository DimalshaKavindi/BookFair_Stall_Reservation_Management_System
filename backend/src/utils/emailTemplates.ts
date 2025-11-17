export function reservationTemplate(p: { businessName: string; stallName: string; qrUrl: string; }) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto">
    <h2>Reservation Confirmed</h2>
    <p>Dear ${escapeHtml(p.businessName)},</p>
    <p>Your stall reservation is confirmed for <strong>Stall ${escapeHtml(p.stallName)}</strong>.</p>
    <p>This email contains your entry QR. Please keep it handy.</p>
    <p><img src="${p.qrUrl}" alt="QR Code" style="width:220px;height:220px"/></p>
    <p>Thank you,<br/>Sri Lanka Book Publishers’ Association</p>
  </div>`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] as string));
}
