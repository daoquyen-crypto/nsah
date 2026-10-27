const fs=require('fs'),crypto=require('crypto');
const sheets={};let mails=[];
function mkSheet(name){const d=[];const sh={name,d,
 getLastRow:()=>d.length,
 getRange(a,b,c,e){ if(typeof a==='string'){return {setNumberFormat(){},setDataValidation(){}}}
  const r=a,col=b,nr=c||1,nc=e||1;
  return {setValues(v){ if(v.length!==nr||v.some(x=>x.length!==nc)) throw new Error(`DIM MISMATCH range ${nr}x${nc} data ${v.length}x${v[0].length} at ${name}`); v.forEach((row,i)=>{while(d.length<r+i)d.push([]);row.forEach((x,j)=>d[r+i-1][col+j-1]=x)}); return this},
   setValue(x){return this.setValues([[x]])},getValue(){return (d[r-1]||[])[col-1]??''},
   getValues(){const o=[];for(let i=0;i<nr;i++){const row=[];for(let j=0;j<nc;j++)row.push((d[r+i-1]||[])[col+j-1]??'');o.push(row)}return o},
   setNumberFormat(){return this},setFontWeight(){return this},setBackground(){return this},setFontColor(){return this},setDataValidation(){return this}}},
 getDataRange(){const nc=Math.max(1,...d.map(x=>x.length));return this.getRange(1,1,Math.max(1,d.length),nc)},
 appendRow(v){d.push(v.slice())},deleteRow(r){d.splice(r-1,1)},setFrozenRows(){},setColumnWidth(){}};return sh}
global.SpreadsheetApp={getActiveSpreadsheet:()=>({getSheetByName:n=>sheets[n]||null,insertSheet:n=>(sheets[n]=mkSheet(n)),getId:()=>'ss'}),
 newDataValidation:()=>({requireValueInList(){return this},build(){return{}}}),getUi(){throw new Error('no ui')}};
global.Utilities={formatDate:(dt,tz,f)=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(dt).reduce((a,x)=>(a[x.type]=x.value,a),{});return f.replace('yyyy',p.year).replace('MM',p.month).replace('dd',p.day).replace('HH',p.hour).replace('mm',p.minute)},
 computeDigest:(a,s)=>[...crypto.createHash('md5').update(s).digest()],base64Encode:b=>Buffer.from(b).toString('base64'),base64Decode:s=>[...Buffer.from(s,'base64')],
 newBlob:(b,m,n)=>({b,m,n}),DigestAlgorithm:{MD5:1},Charset:{UTF_8:1}};
global.LockService={getScriptLock:()=>({waitLock(){},tryLock(){return true},releaseLock(){}})};
const props={};global.PropertiesService={getScriptProperties:()=>({getProperty:k=>props[k]??null,setProperty:(k,v)=>props[k]=v})};
global.MailApp={getRemainingDailyQuota:()=>100,sendEmail:o=>mails.push(o)};
global.Session={getEffectiveUser:()=>({getEmail:()=>'owner@x'})};
global.ScriptApp={getProjectTriggers:()=>[],deleteTrigger(){},newTrigger:()=>({timeBased(){return this},everyDays(){return this},atHour(){return this},inTimezone(){return this},create(){}})};
global.DriveApp={};global.HtmlService={};global.console=console;
eval(fs.readFileSync(__dirname+'/../src/Config.gs','utf8').replace('const CONFIG','global.CONFIG')+fs.readFileSync(__dirname+'/../src/Code.gs','utf8').replace(/^const (\w+)/gm,'global.$1').replace(/^function (\w+)/gm,'global.$1 = function $1'));
setup();
const M=sheets.ThanhVien.d; M[1][5]='quyen@x'; M[2][4]='0912345678'; M[4][5]='long@x'; M[4][3]='chủ chốt';
const codeQ=M[1][0];
let D=getData(codeQ); console.log('tasks',D.tasks.length,'user',D.user);
const t=D.tasks.find(x=>x.ban==='Ban Đối ngoại');
D=saveTask(codeQ,Object.assign({},t,{status:'Đang làm',progress:30,owner:'Nguyễn Đức Long, Đào Thị Hồng Quyên'}));
console.log('edit ok',D.tasks.find(x=>x.id===t.id).status, 'mails',mails.map(m=>m.to+': '+m.subject));
D=saveTask(codeQ,{title:'Việc mới test',ban:'Ban Nhân sự (HR)',owner:'Nguyễn Đức Long',due:'2026-10-29',status:'Chưa bắt đầu',progress:0,note:''});
console.log('new ok',D.tasks.length,D.tasks[D.tasks.length-1]);
D=addEvidence(codeQ,t.id,{kind:'link',url:'https://drive.google.com/x'}); console.log('ev',D.tasks.find(x=>x.id===t.id).evidence);
// member (Long, chủ chốt) completes own task with evidence
const L=M[4][0]; let D2=getData(L); const tl=D2.tasks.find(x=>x.id===t.id);
D2=saveTask(L,Object.assign({},tl,{status:'Hoàn thành'})); console.log('done',D2.tasks.find(x=>x.id===t.id).status,D2.tasks.find(x=>x.id===t.id).doneAt);
console.log('remind',remindTask(codeQ,D.tasks[D.tasks.length-1].id));
mails=[]; dailyReminder(); console.log('daily',mails.map(m=>m.to+': '+m.subject));

console.log('phone login',getData('84 912 345 678').user.name);
