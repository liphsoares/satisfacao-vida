/* ── Toast ── */
const _toast = document.getElementById('toast');
let _toastTimer;

function showToast(msg) {
  _toast.textContent = msg;
  _toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => _toast.classList.remove('show'), 2200);
}

/* ── PDF helpers ── */
function getPdfDoc() {
  const jspdf = window.jspdf;
  if (!jspdf || !jspdf.jsPDF) {
    showToast('Não foi possível carregar o gerador de PDF.');
    return null;
  }
  return new jspdf.jsPDF({ unit: 'mm', format: 'a4' });
}

function pdfHeader(doc, title, nome, email, evento) {
  const marginX = 16;
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, marginX, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Data e hora: ${new Date().toLocaleString('pt-BR')}`, marginX, y);
  y += 7;

  if (nome)   { doc.text(`Nome: ${nome}`,              marginX, y); y += 6; }
  if (email)  { doc.text(`E-mail: ${email}`,           marginX, y); y += 6; }
  if (evento) { doc.text(`Código do Evento: ${evento}`, marginX, y); y += 6; }

  return { marginX, y: y + 4 };
}

function pdfResultSection(doc, marginX, y, total, range, desc, scoreLabel) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Resultado', marginX, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Pontuação total: ${total} (${scoreLabel})`, marginX, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.text(`Classificação: ${range}`, marginX, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  const dLines = doc.splitTextToSize(`Interpretação: ${desc}`, 180);
  doc.text(dLines, marginX, y);
  return y + dLines.length * 5.2 + 4;
}

function pdfFooter(doc, marginX, y, note, ref) {
  const nLines = doc.splitTextToSize(note, 180);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(nLines, marginX, y);
  y += nLines.length * 4.8 + 4;

  const rLines = doc.splitTextToSize(ref, 180);
  doc.text(rLines, marginX, y);
  y += rLines.length * 4.8 + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('@eufilipeteixeira', marginX, y);
}

function pdfFileName(prefix, nome) {
  const d = new Date();
  const safe = nome ? nome.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') : 'anonimo';
  const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return `${prefix}_resultado_${safe}_${date}.pdf`;
}
