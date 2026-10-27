/**
 * APP THEO DÕI TIẾN ĐỘ BTC — phần dùng chung cho mọi dự án.
 * Thông tin riêng của từng sự kiện nằm trong Config.gs.
 * Code được tự đẩy từ GitHub (daoquyen-crypto/nsah) — sửa trên GitHub, không sửa trực tiếp ở đây.
 * Dữ liệu nằm trong 3 sheet: ThanhVien, CongViec, NhatKy.
 */

const SH = { members: 'ThanhVien', tasks: 'CongViec', log: 'NhatKy' };

const STATUSES = ['Chưa bắt đầu', 'Đang làm', 'Bị vướng', 'Hoàn thành'];

const H_MEMBERS = ['Mã truy cập', 'Họ tên', 'Ban (nhiều ban cách nhau dấu phẩy)', 'Vai trò (admin / chủ chốt / thành viên)', 'Điện thoại', 'Email'];
const H_TASKS = ['ID', 'Ban', 'Công việc', 'Phụ trách', 'Hạn chót (yyyy-mm-dd)', 'Trạng thái', 'Tiến độ (%)', 'Ghi chú', 'Cập nhật bởi', 'Cập nhật lúc', 'Minh chứng'];
const H_LOG = ['Thời gian', 'Người cập nhật', 'ID', 'Công việc', 'Thay đổi'];

/* ───────────── Web app ───────────── */

function doGet(e) {
  const t = HtmlService.createTemplateFromFile('Index');
  const k = String((e && e.parameter && e.parameter.k) || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 20);
  t.cfg = { id: CONFIG.id, title: CONFIG.appTitle, subtitle: CONFIG.subtitle, k: k };
  return t.evaluate()
    .setTitle(CONFIG.appTitle)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('⚙️ App BTC')
    .addItem('1. Khởi tạo dữ liệu (chạy 1 lần)', 'setup')
    .addItem('2. Tạo mã và link đăng nhập riêng cho thành viên', 'generateCodes')
    .addItem('3. Cấp quyền lưu minh chứng (chạy 1 lần)', 'setupEvidence')
    .addToUi();
}

/* ───────────── Khởi tạo ───────────── */

function setup() {
  const ss = ss_();
  const m = ensureSheet_(ss, SH.members, H_MEMBERS);
  const t = ensureSheet_(ss, SH.tasks, H_TASKS);
  ensureSheet_(ss, SH.log, H_LOG);

  // Giữ hạn chót và số điện thoại ở dạng chữ (không bị mất số 0 / đổi định dạng ngày)
  t.getRange('E:E').setNumberFormat('@');
  m.getRange('E:E').setNumberFormat('@');

  if (m.getLastRow() < 2) {
    const rows = CONFIG.seedMembers.map(r => ['', r[0], r[1], r[2], '', '']);
    m.getRange(2, 1, rows.length, H_MEMBERS.length).setValues(rows);
  }
  if (t.getLastRow() < 2) {
    const now = nowStr_();
    const rows = CONFIG.seedTasks.map((r, i) => [id_(i + 1), r[0], r[1], r[2] || '', r[3], 'Chưa bắt đầu', 0, '', 'Khởi tạo', now, '']);
    t.getRange(2, 1, rows.length, H_TASKS.length).setValues(rows);
  }

  t.getRange('B2:B').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.bans, true).build());
  t.getRange('F2:F').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());
  t.setColumnWidth(3, 380);
  t.setColumnWidth(8, 260);

  markSeeded_(CONFIG.seedTasks.map(seedKey_));
  generateCodes();
  try { SpreadsheetApp.getUi().alert('Đã khởi tạo xong. Mã truy cập của từng người nằm ở cột A sheet "ThanhVien".'); } catch (e) {}
}

function generateCodes() {
  const sh = ss_().getSheetByName(SH.members);
  if (!sh || sh.getLastRow() < 2) return;
  const rng = sh.getRange(2, 1, sh.getLastRow() - 1, 2);
  const v = rng.getValues();
  const used = new Set(v.map(r => String(r[0]).trim().toUpperCase()).filter(String));
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let changed = false;
  v.forEach(r => {
    if (r[1] && !String(r[0]).trim()) {
      let c;
      do { c = ''; for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)]; } while (used.has(c));
      used.add(c); r[0] = c; changed = true;
    }
  });
  if (changed) rng.setValues(v);
  // Cột G: link đăng nhập riêng (bấm là vào thẳng app)
  if (CONFIG.appUrl) {
    if (!String(sh.getRange(1, 7).getValue())) sh.getRange(1, 7).setValue('Link đăng nhập riêng').setFontWeight('bold').setBackground('#0B1F4B').setFontColor('#ffffff');
    const links = v.map(r => [String(r[0]).trim() ? CONFIG.appUrl + '?k=' + String(r[0]).trim().toUpperCase() : '']);
    sh.getRange(2, 7, links.length, 1).setValues(links);
    sh.setColumnWidth(7, 320);
  }
  try { SpreadsheetApp.getUi().alert('Đã cập nhật mã (cột A) và link đăng nhập riêng (cột G) trong sheet "ThanhVien".'); } catch (e) {}
}

/* ───────────── API cho giao diện ───────────── */

function login(identifier) {
  const u = auth_(identifier);
  return { name: u.name };
}

function getData(identifier) {
  const u = auth_(identifier);
  syncSeedTasks_();
  fixIds_();
  const done = doneDates_();
  const tasks = readTasks_().map(t => Object.assign(t, {
    canEdit: canEdit_(u, t),
    doneAt: t.status === 'Hoàn thành' ? (done[t.id] || logDate_(t.updatedAt)) : ''
  }));
  return {
    user: { name: u.name, bans: u.bans, admin: u.admin, lead: u.lead },
    tasks: tasks,
    members: readMembers_().map(m => ({ name: m.name, bans: m.bans })),
    bans: CONFIG.bans,
    statuses: STATUSES,
    eventDate: CONFIG.eventDate,
    requireEvidence: !!CONFIG.requireEvidence,
    serverTime: nowStr_()
  };
}

function saveTask(identifier, t) {
  const u = auth_(identifier);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sh = ss_().getSheetByName(SH.tasks);
    const tasks = readTasks_();

    const title = String(t.title || '').trim();
    if (!title) throw new Error('Chưa nhập tên công việc.');
    if (CONFIG.bans.indexOf(t.ban) < 0) throw new Error('Ban không hợp lệ.');
    let status = STATUSES.indexOf(t.status) >= 0 ? t.status : 'Chưa bắt đầu';
    let progress = Math.round(Math.max(0, Math.min(100, Number(t.progress) || 0)));
    if (status === 'Hoàn thành') progress = 100;
    else if (progress === 100) status = 'Hoàn thành';
    const due = /^\d{4}-\d{2}-\d{2}$/.test(t.due || '') ? t.due : '';
    const rec = { ban: t.ban, title: title, owner: String(t.owner || '').trim(), due: due, status: status, progress: progress, note: String(t.note || '').trim() };
    const now = nowStr_();

    if (t.id) {
      const old = tasks.find(x => x.id === t.id);
      if (!old) throw new Error('Công việc không còn tồn tại (có thể đã bị xoá). Hãy tải lại.');
      if (!canEdit_(u, old)) throw new Error('Bạn không có quyền sửa công việc này.');
      if (!u.admin && rec.ban !== old.ban && u.bans.indexOf(rec.ban) < 0) throw new Error('Bạn chỉ chuyển việc sang ban mình phụ trách.');
      if (t.updatedAt && old.updatedAt && t.updatedAt !== old.updatedAt) {
        throw new Error('Công việc vừa được ' + old.updatedBy + ' cập nhật lúc ' + old.updatedAt + '. Hãy tải lại để xem bản mới rồi sửa tiếp.');
      }
      if (CONFIG.requireEvidence && !u.admin && rec.status === 'Hoàn thành' && old.status !== 'Hoàn thành' && !old.evidence.length) {
        throw new Error('Cần thêm ít nhất 1 minh chứng (ảnh, file hoặc link) trước khi đánh dấu Hoàn thành.');
      }
      const changes = diff_(old, rec);
      if (changes.length) {
        sh.getRange(old.row, 2, 1, 9).setValues([[rec.ban, rec.title, rec.owner, rec.due, rec.status, rec.progress, rec.note, u.name, now, '']]);
        log_(u.name, old.id, rec.title, changes.join('; '));
      }
    } else {
      if (!u.admin && u.bans.indexOf(rec.ban) < 0) throw new Error('Bạn chỉ thêm việc cho ban mình phụ trách.');
      const max = tasks.reduce((a, x) => Math.max(a, parseInt(String(x.id).replace(/\D/g, ''), 10) || 0), 0);
      const id = id_(max + 1);
      const row = sh.getLastRow() + 1;
      sh.getRange(row, 5).setNumberFormat('@');
      sh.getRange(row, 1, 1, H_TASKS.length).setValues([[id, rec.ban, rec.title, rec.owner, rec.due, rec.status, rec.progress, rec.note, u.name, now]]);
      log_(u.name, id, rec.title, 'Tạo mới');
    }
  } finally {
    lock.releaseLock();
  }
  return getData(identifier);
}

function deleteTask(identifier, taskId) {
  const u = auth_(identifier);
  if (!u.admin) throw new Error('Chỉ Trưởng BTC (admin) được xoá công việc.');
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const t = readTasks_().find(x => x.id === taskId);
    if (!t) throw new Error('Không tìm thấy công việc.');
    ss_().getSheetByName(SH.tasks).deleteRow(t.row);
    log_(u.name, t.id, t.title, 'Đã xoá');
  } finally {
    lock.releaseLock();
  }
  return getData(identifier);
}

/* ───────────── Bổ sung việc mới từ Config.gs ───────────── */
// Mỗi việc trong CONFIG.seedTasks chỉ được thêm vào Sheet MỘT lần.
// Việc đã thêm rồi bị xoá trên app sẽ không bị thêm lại.

function seedKey_(r) {
  const d = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, (r[0] + '|' + r[1]).toLowerCase(), Utilities.Charset.UTF_8);
  return Utilities.base64Encode(d).slice(0, 10);
}

function markSeeded_(keys) {
  const props = PropertiesService.getScriptProperties();
  const set = new Set(JSON.parse(props.getProperty('SEEDED_KEYS') || '[]').concat(keys));
  props.setProperty('SEEDED_KEYS', JSON.stringify(Array.from(set)));
  props.setProperty('SEED_SIG', seedSig_());
}

function seedSig_() {
  return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(CONFIG.seedTasks) + JSON.stringify(CONFIG.bans), Utilities.Charset.UTF_8));
}

function syncSeedTasks_() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('SEED_SIG') === seedSig_()) return; // Config không đổi → bỏ qua
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return;
  try {
    if (props.getProperty('SEED_SIG') === seedSig_()) return;
    const sh = ss_().getSheetByName(SH.tasks);
    const tasks = readTasks_();
    const have = new Set(tasks.map(t => (t.ban + '|' + t.title).toLowerCase()));
    let raw = props.getProperty('SEEDED_KEYS');
    if (!raw) { // lần đầu: coi các việc đang có trong Sheet là đã thêm
      raw = JSON.stringify(CONFIG.seedTasks.filter(r => have.has((r[0] + '|' + r[1]).toLowerCase())).map(seedKey_));
    }
    const seeded = new Set(JSON.parse(raw));
    const add = CONFIG.seedTasks.filter(r => !seeded.has(seedKey_(r)) && !have.has((r[0] + '|' + r[1]).toLowerCase()));
    if (add.length) {
      let max = tasks.reduce((a, x) => Math.max(a, parseInt(String(x.id).replace(/\D/g, ''), 10) || 0), 0);
      const now = nowStr_(), row = sh.getLastRow() + 1;
      const rows = add.map(r => [id_(++max), r[0], r[1], r[2] || '', r[3] || '', 'Chưa bắt đầu', 0, '', 'Kế hoạch', now, '']);
      sh.getRange(row, 5, rows.length, 1).setNumberFormat('@');
      sh.getRange(row, 1, rows.length, H_TASKS.length).setValues(rows);
      rows.forEach(r => log_('Kế hoạch', r[0], r[2], 'Tạo mới (bổ sung từ kế hoạch)'));
    }
    sh.getRange('B2:B').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.bans, true).build());
    props.setProperty('SEEDED_KEYS', JSON.stringify(Array.from(seeded)));
    markSeeded_(CONFIG.seedTasks.map(seedKey_));
  } finally {
    lock.releaseLock();
  }
}

/* ───────────── Minh chứng ───────────── */
// Mỗi minh chứng là một dòng trong cột "Minh chứng": loại|tên|fileId hoặc url|người thêm|thời gian

const EV_MAX_BYTES = 10 * 1024 * 1024;

function setupEvidence() {
  const f = evidenceFolder_();
  try { SpreadsheetApp.getUi().alert('Đã sẵn sàng. Minh chứng sẽ lưu trong thư mục Drive: "' + f.getName() + '".'); } catch (e) {}
}

function evidenceFolder_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('EVIDENCE_FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const ssFile = DriveApp.getFileById(ss_().getId());
  const parents = ssFile.getParents();
  const parent = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const f = parent.createFolder('Minh chứng – ' + CONFIG.appTitle);
  props.setProperty('EVIDENCE_FOLDER_ID', f.getId());
  return f;
}

function clean_(s) { return String(s || '').replace(/[|\r\n]+/g, ' ').trim(); }

function parseEvidence_(v) {
  return String(v || '').split('\n').map(x => x.trim()).filter(String).map(line => {
    const p = line.split('|');
    return { kind: p[0] === 'file' ? 'file' : 'link', name: p[1] || '', ref: p[2] || '', by: p[3] || '', at: p[4] || '' };
  }).filter(e => e.ref);
}

function writeEvidence_(sh, row, list, who) {
  if (!String(sh.getRange(1, 11).getValue())) sh.getRange(1, 11).setValue('Minh chứng').setFontWeight('bold').setBackground('#0B1F4B').setFontColor('#ffffff');
  sh.getRange(row, 11).setValue(list.map(e => [e.kind, clean_(e.name), e.ref, clean_(e.by), e.at].join('|')).join('\n'));
  sh.getRange(row, 9, 1, 2).setValues([[who, nowStr_()]]);
}

function addEvidence(identifier, taskId, ev) {
  const u = auth_(identifier);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const t = readTasks_().find(x => x.id === taskId);
    if (!t) throw new Error('Không tìm thấy công việc. Hãy tải lại.');
    if (!canEdit_(u, t)) throw new Error('Bạn không có quyền thêm minh chứng cho việc này.');
    let item;
    if (ev && ev.kind === 'link') {
      const url = String(ev.url || '').trim();
      if (!/^https?:\/\/\S+$/i.test(url)) throw new Error('Link không hợp lệ (cần bắt đầu bằng http:// hoặc https://).');
      item = { kind: 'link', name: clean_(ev.name) || url.replace(/^https?:\/\//, '').slice(0, 60), ref: url };
    } else {
      const bytes = Utilities.base64Decode(String(ev.data || ''));
      if (!bytes.length) throw new Error('File rỗng.');
      if (bytes.length > EV_MAX_BYTES) throw new Error('File quá lớn (tối đa 10 MB). Hãy gửi link Google Drive thay vì tải file.');
      const name = clean_(ev.name) || 'minh-chung';
      const file = evidenceFolder_().createFile(Utilities.newBlob(bytes, ev.mime || 'application/octet-stream', t.id + ' - ' + name));
      item = { kind: 'file', name: name, ref: file.getId() };
    }
    item.by = u.name; item.at = nowStr_();
    const sh = ss_().getSheetByName(SH.tasks);
    writeEvidence_(sh, t.row, t.evidence.concat([item]), u.name);
    log_(u.name, t.id, t.title, 'Thêm minh chứng: ' + item.name);
  } finally {
    lock.releaseLock();
  }
  return getData(identifier);
}

function removeEvidence(identifier, taskId, ref) {
  const u = auth_(identifier);
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const t = readTasks_().find(x => x.id === taskId);
    if (!t) throw new Error('Không tìm thấy công việc. Hãy tải lại.');
    if (!canEdit_(u, t)) throw new Error('Bạn không có quyền sửa minh chứng của việc này.');
    const ev = t.evidence.find(e => e.ref === ref);
    if (!ev) throw new Error('Minh chứng không còn tồn tại.');
    writeEvidence_(ss_().getSheetByName(SH.tasks), t.row, t.evidence.filter(e => e.ref !== ref), u.name);
    log_(u.name, t.id, t.title, 'Gỡ minh chứng: ' + ev.name);
  } finally {
    lock.releaseLock();
  }
  return getData(identifier);
}

// Trả nội dung file minh chứng cho người đã đăng nhập (chỉ file đang gắn với một công việc)
function getEvidenceFile(identifier, fileId) {
  auth_(identifier);
  const ok = readTasks_().some(t => t.evidence.some(e => e.kind === 'file' && e.ref === fileId));
  if (!ok) throw new Error('Không tìm thấy minh chứng.');
  const blob = DriveApp.getFileById(fileId).getBlob();
  return { name: blob.getName(), mime: blob.getContentType(), data: Utilities.base64Encode(blob.getBytes()) };
}

function getLog(identifier) {
  auth_(identifier);
  const sh = ss_().getSheetByName(SH.log);
  if (!sh || sh.getLastRow() < 2) return [];
  const n = Math.min(200, sh.getLastRow() - 1);
  const v = sh.getRange(sh.getLastRow() - n + 1, 1, n, 5).getValues();
  return v.reverse().map(r => ({
    time: r[0] instanceof Date ? Utilities.formatDate(r[0], CONFIG.timeZone, 'dd/MM/yyyy HH:mm') : String(r[0]),
    who: String(r[1]), id: String(r[2]), title: String(r[3]), change: String(r[4])
  }));
}

/* ───────────── Nội bộ ───────────── */

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function id_(n) { return 'CV' + ('00' + n).slice(-3); }
function nowStr_() { return Utilities.formatDate(new Date(), CONFIG.timeZone, 'dd/MM/yyyy HH:mm'); }

function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#0B1F4B').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function phone_(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.indexOf('84') === 0 && d.length >= 11) d = '0' + d.slice(2);
  if (d.length === 9) d = '0' + d; // Sheets hay làm mất số 0 đầu
  return d;
}

function readMembers_() {
  const sh = ss_().getSheetByName(SH.members);
  if (!sh) throw new Error('Chưa khởi tạo dữ liệu. Mở Google Sheet > menu "⚙️ App BTC" > Khởi tạo dữ liệu.');
  return sh.getDataRange().getValues().slice(1).filter(r => String(r[1]).trim()).map(r => ({
    code: String(r[0]).trim().toUpperCase(),
    name: String(r[1]).trim(),
    bans: String(r[2]).split(',').map(s => s.trim()).filter(String),
    admin: /admin/i.test(String(r[3])),
    lead: /admin|chủ chốt|chu chot|trưởng ban|dashboard/i.test(String(r[3])),
    phone: phone_(r[4]),
    email: String(r[5]).trim().toLowerCase()
  }));
}

function auth_(identifier) {
  const s = String(identifier || '').trim();
  if (!s) throw new Error('Vui lòng nhập mã truy cập, số điện thoại hoặc email.');
  const up = s.toUpperCase(), low = s.toLowerCase(), ph = phone_(s);
  const m = readMembers_().find(x =>
    (x.code && x.code === up) ||
    (x.email && x.email === low) ||
    (ph.length >= 10 && x.phone && x.phone === ph));
  if (!m) throw new Error('Không tìm thấy thành viên. Kiểm tra lại hoặc liên hệ Trưởng BTC để được cấp mã.');
  return m;
}

function canEdit_(u, t) {
  if (u.admin) return true;
  if (u.bans.indexOf(t.ban) >= 0) return true;
  return !!(t.owner && t.owner.toLowerCase().indexOf(u.name.toLowerCase()) >= 0);
}

function date_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, CONFIG.timeZone, 'yyyy-MM-dd');
  const s = String(v || '').trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  return s;
}

function readTasks_() {
  const sh = ss_().getSheetByName(SH.tasks);
  const v = sh.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < v.length; i++) {
    const r = v[i];
    if (!String(r[0]).trim() && !String(r[2]).trim()) continue;
    out.push({
      row: i + 1,
      id: String(r[0]).trim(),
      ban: String(r[1]).trim(),
      title: String(r[2]).trim(),
      owner: String(r[3]).trim(),
      due: date_(r[4]),
      status: STATUSES.indexOf(r[5]) >= 0 ? r[5] : 'Chưa bắt đầu',
      progress: Math.max(0, Math.min(100, Number(r[6]) || 0)),
      note: String(r[7]),
      updatedBy: String(r[8]),
      updatedAt: r[9] instanceof Date ? Utilities.formatDate(r[9], CONFIG.timeZone, 'dd/MM/yyyy HH:mm') : String(r[9]),
      evidence: parseEvidence_(r[10])
    });
  }
  return out;
}

// Gán ID cho dòng được thêm tay trực tiếp trên Sheet
function fixIds_() {
  const tasks = readTasks_();
  const missing = tasks.filter(t => !t.id);
  if (!missing.length) return;
  const sh = ss_().getSheetByName(SH.tasks);
  let max = tasks.reduce((a, x) => Math.max(a, parseInt(String(x.id).replace(/\D/g, ''), 10) || 0), 0);
  missing.forEach(t => sh.getRange(t.row, 1).setValue(id_(++max)));
}

// Ngày hoàn thành của từng việc, lấy từ nhật ký (lần gần nhất chuyển sang "Hoàn thành")
function doneDates_() {
  const map = {};
  const sh = ss_().getSheetByName(SH.log);
  if (!sh || sh.getLastRow() < 2) return map;
  sh.getRange(2, 1, sh.getLastRow() - 1, 5).getValues().forEach(r => {
    if (/→ Hoàn thành/.test(String(r[4]))) map[String(r[2])] = logDate_(r[0]);
  });
  return map;
}

function logDate_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, CONFIG.timeZone, 'yyyy-MM-dd');
  const m = String(v || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : '';
}

function dmy_(s) { return s ? s.split('-').reverse().join('/') : '(trống)'; }

function diff_(o, n) {
  const c = [];
  if (o.ban !== n.ban) c.push('Ban: ' + o.ban + ' → ' + n.ban);
  if (o.title !== n.title) c.push('Đổi tên công việc');
  if (o.owner !== n.owner) c.push('Phụ trách: ' + (o.owner || '(trống)') + ' → ' + (n.owner || '(trống)'));
  if (o.due !== n.due) c.push('Hạn: ' + dmy_(o.due) + ' → ' + dmy_(n.due));
  if (o.status !== n.status) c.push('Trạng thái: ' + o.status + ' → ' + n.status);
  if (o.progress !== n.progress) c.push('Tiến độ: ' + o.progress + '% → ' + n.progress + '%');
  if (o.note !== n.note) c.push('Ghi chú: ' + (n.note.length > 80 ? n.note.slice(0, 80) + '…' : (n.note || '(xoá)')));
  return c;
}

function log_(who, id, title, change) {
  ss_().getSheetByName(SH.log).appendRow([nowStr_(), who, id, title, change]);
}
