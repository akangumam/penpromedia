/**
 * PENPROMEDIA MASTER GUESTBOOK & RSVP API
 * Mendukung Multi-Klien (Risma-Azis, Rian-Anisha, dan klien baru lainnya)
 * 
 * Fitur:
 * 1. Otomatis membuat Tab Sheet baru jika ID klien belum ada.
 * 2. Mengambil semua ucapan: GET ?action=getAll&id=nama-klien
 * 3. Menyimpan ucapan: POST { id: "nama-klien", nama: "...", ucapan: "...", kehadiran: "Hadir" }
 * 4. Menghapus ucapan: POST { action: "delete", id: "nama-klien", timestamp: "...", password: "..." }
 */

// Ganti password ini sesuai keinginan Anda untuk otorisasi hapus komentar
const ADMIN_PASSWORD = "penpromedia2026";

function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action;
    const clientId = (params.id || "general").trim();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(ss, clientId);

    if (action === "getAll") {
      const rows = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return jsonResponse({ status: "success", data: [] });
      }

      // Baris 1 adalah header: [Timestamp, Nama, Ucapan, Kehadiran]
      const data = [];
      for (let i = rows.length - 1; i >= 1; i--) {
        const row = rows[i];
        if (row[0] && row[1]) {
          data.push({
            timestamp: row[0],
            nama: row[1],
            ucapan: row[2] || "",
            kehadiran: row[3] || "Hadir"
          });
        }
      }
      return jsonResponse({ status: "success", data: data });
    }

    if (action === "summary") {
      const rows = sheet.getDataRange().getValues();
      let hadir = 0;
      let tidakHadir = 0;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][3] === "Hadir") hadir++;
        else if (rows[i][3] === "Tidak Hadir") tidakHadir++;
      }
      return jsonResponse({
        status: "success",
        data: { hadir: hadir, tidakHadir: tidakHadir, total: rows.length > 1 ? rows.length - 1 : 0 }
      });
    }

    return jsonResponse({ status: "error", message: "Aksi tidak dikenali." });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    const raw = e.postData ? e.postData.contents : "";
    const body = raw ? JSON.parse(raw) : {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const clientId = (body.id || (e.parameter && e.parameter.id) || "general").trim();
    const sheet = getOrCreateSheet(ss, clientId);

    // 1. Aksi Hapus Ucapan
    if (body.action === "delete") {
      if (body.password !== ADMIN_PASSWORD) {
        return jsonResponse({ status: "error", message: "Password salah!" });
      }

      const timestamp = String(body.timestamp);
      const rows = sheet.getDataRange().getValues();
      let deleted = false;

      for (let i = rows.length - 1; i >= 1; i--) {
        if (String(rows[i][0]) === timestamp) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break;
        }
      }

      if (deleted) {
        return jsonResponse({ status: "success", message: "Ucapan berhasil dihapus." });
      } else {
        return jsonResponse({ status: "error", message: "Ucapan tidak ditemukan." });
      }
    }

    // 2. Aksi Simpan Ucapan Baru
    const nama = (body.nama || "").trim();
    const ucapan = (body.ucapan || "").trim();
    const kehadiran = (body.kehadiran || "Hadir").trim();
    const timestamp = new Date().toISOString();

    if (!nama || !ucapan) {
      return jsonResponse({ status: "error", message: "Nama dan ucapan wajib diisi." });
    }

    sheet.appendRow([timestamp, nama, ucapan, kehadiran]);
    return jsonResponse({ status: "success", message: "Ucapan berhasil disimpan." });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

function getOrCreateSheet(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Nama", "Ucapan", "Kehadiran"]);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#cfa670").setFontColor("#000000");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

