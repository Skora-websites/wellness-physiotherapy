// Minimal XLSX writer for admin exports. Produces a real .xlsx workbook
// (stored ZIP + SpreadsheetML) so Excel/LibreOffice open it without warnings,
// without adding a spreadsheet dependency to the frontend bundle.

const encoder = new TextEncoder()

const CRC_TABLE = new Uint32Array(256)
for (let n = 0; n < 256; n += 1) {
  let c = n
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  CRC_TABLE[n] = c >>> 0
}

function crc32(bytes) {
  let crc = 0xffffffff
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function zip(files) {
  const localParts = []
  const centralParts = []
  const now = new Date()
  const time = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff
  const date = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff
  let offset = 0

  for (const file of files) {
    const name = encoder.encode(file.name)
    const data = encoder.encode(file.content)
    const crc = crc32(data)

    const header = new DataView(new ArrayBuffer(30))
    header.setUint32(0, 0x04034b50, true)
    header.setUint16(4, 20, true)
    header.setUint16(6, 0x0800, true) // UTF-8 file names
    header.setUint16(8, 0, true) // stored, no compression
    header.setUint16(10, time, true)
    header.setUint16(12, date, true)
    header.setUint32(14, crc, true)
    header.setUint32(18, data.length, true)
    header.setUint32(22, data.length, true)
    header.setUint16(26, name.length, true)
    header.setUint16(28, 0, true)

    localParts.push(new Uint8Array(header.buffer), name, data)

    const entry = new DataView(new ArrayBuffer(46))
    entry.setUint32(0, 0x02014b50, true)
    entry.setUint16(4, 20, true)
    entry.setUint16(6, 20, true)
    entry.setUint16(8, 0x0800, true)
    entry.setUint16(10, 0, true)
    entry.setUint16(12, time, true)
    entry.setUint16(14, date, true)
    entry.setUint32(16, crc, true)
    entry.setUint32(20, data.length, true)
    entry.setUint32(24, data.length, true)
    entry.setUint16(28, name.length, true)
    entry.setUint16(30, 0, true)
    entry.setUint16(32, 0, true)
    entry.setUint16(34, 0, true)
    entry.setUint16(36, 0, true)
    entry.setUint32(38, 0, true)
    entry.setUint32(42, offset, true)

    centralParts.push(new Uint8Array(entry.buffer), name)
    offset += 30 + name.length + data.length
  }

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true)
  end.setUint16(4, 0, true)
  end.setUint16(6, 0, true)
  end.setUint16(8, files.length, true)
  end.setUint16(10, files.length, true)
  end.setUint32(12, centralSize, true)
  end.setUint32(16, offset, true)
  end.setUint16(20, 0, true)

  return new Blob([...localParts, ...centralParts, new Uint8Array(end.buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\r?\n/g, '&#10;')
    .replace(/\t/g, '&#9;')
}

function columnName(index) {
  let name = ''
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    name = String.fromCharCode(65 + ((n - 1) % 26)) + name
  }
  return name
}

function sheetXml(columns, rows) {
  const lastColumn = columnName(columns.length - 1)
  const widths = columns
    .map((column, index) => `<col min="${index + 1}" max="${index + 1}" width="${column.width || 22}" customWidth="1"/>`)
    .join('')

  const header = columns
    .map((column, index) => `<c r="${columnName(index)}1" t="inlineStr" s="1"><is><t>${escapeXml(column.header)}</t></is></c>`)
    .join('')

  const body = rows
    .map((row, rowIndex) => {
      const rowNumber = rowIndex + 2
      const cells = columns
        .map((column, columnIndex) => {
          const ref = `${columnName(columnIndex)}${rowNumber}`
          const style = column.wrap ? ' s="2"' : ''
          const value = row[column.key]
          if (value === undefined || value === null || value === '') {
            return `<c r="${ref}"${style}/>`
          }
          return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
        })
        .join('')
      return `<row r="${rowNumber}">${cells}</row>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:${lastColumn}${rows.length + 1}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${widths}</cols><sheetData><row r="1">${header}</row>${body}</sheetData><autoFilter ref="A1:${lastColumn}${rows.length + 1}"/></worksheet>`
}

function createWorkbook({ sheetName, columns, rows }) {
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${escapeXml(sheetName).slice(0, 31)}" sheetId="1" r:id="rId1"/></sheets></workbook>`

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><color rgb="FF0F3F66"/><name val="Calibri"/><family val="2"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF3FB"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`

  return zip([
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    },
    { name: 'xl/workbook.xml', content: workbook },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRels },
    { name: 'xl/styles.xml', content: styles },
    { name: 'xl/worksheets/sheet1.xml', content: sheetXml(columns, rows) },
  ])
}

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  completed: 'Completed',
  replied: 'Replied',
  archived: 'Archived',
}

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const EXPORTS = {
  consultations: {
    sheetName: 'Consultation Requests',
    filePrefix: 'consultations',
    columns: [
      { header: 'Name', key: 'name', width: 24 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Health concern', key: 'concern', width: 34, wrap: true },
      { header: 'Message', key: 'message', width: 60, wrap: true },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Staff notes', key: 'notes', width: 45, wrap: true },
      { header: 'Received', key: 'received', width: 22 },
    ],
  },
  contacts: {
    sheetName: 'Contact Messages',
    filePrefix: 'contact-messages',
    columns: [
      { header: 'Name', key: 'name', width: 24 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Subject', key: 'subject', width: 34, wrap: true },
      { header: 'Message', key: 'message', width: 60, wrap: true },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Staff notes', key: 'notes', width: 45, wrap: true },
      { header: 'Received', key: 'received', width: 22 },
    ],
  },
}

export function downloadInquiriesExcel(kind, rows) {
  const config = EXPORTS[kind]
  if (!config) throw new Error(`Unknown inquiry export: ${kind}`)

  const exportRows = rows.map((row) => ({
    ...row,
    status: STATUS_LABELS[row.status] || row.status || '',
    received: formatDate(row.createdAt),
  }))

  const blob = createWorkbook({
    sheetName: config.sheetName,
    columns: config.columns,
    rows: exportRows,
  })

  const now = new Date()
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${config.filePrefix}-${stamp}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
