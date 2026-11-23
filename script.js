(() => {
'use strict';
const KEY='sabrina_short_n_sweet_fan_experience_v1';
const $=s=>document.querySelector(s);
let attendee=null;
function load(){try{const raw=localStorage.getItem(KEY);const a=raw?JSON.parse(raw):null;return a&&typeof a.code==='string'&&typeof a.name==='string'?a:null}catch{return null}}
function save(){localStorage.setItem(KEY,JSON.stringify(attendee))}
function msg(el,text,error=false){el.textContent=text;el.className='message '+(error?'error':'success')}
function safe(v){return String(v??'').replace(/[<>&"']/g,'').trim()}
function code(){
 const pool=Object.keys(window.SWEET_QR_DATA||{}).filter(c=>c!=='SWEET-7496C3CE63AB');
 if(!pool.length)throw new Error('Dados QR não carregados');
 const idx=crypto?.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0]%pool.length : Math.floor(Math.random()*pool.length);
 return pool[idx];
}
function showQR(a){
 const box=$('#qrBox');box.innerHTML='';const img=$('#qrImage');img.hidden=true;
 const item=window.SWEET_QR_DATA?.[a.code];
 if(!item){box.textContent='Código anterior sem QR offline: '+a.code;return}
 const [n,b64]=item,bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
 let rects='';
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
   const i=y*n+x;
   if((bytes[i>>3]>>(7-(i&7)))&1)rects+=`<rect x="${x+4}" y="${y+4}" width="1" height="1"/>`;
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n+8} ${n+8}" width="256" height="256"><rect width="100%" height="100%" fill="white"/><g fill="black">${rects}</g></svg>`;
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 img.alt=`QR Code da credencial de ${a.name}, código ${a.code}`;
 img.hidden=false;
}
function render(){
 attendee=load();const active=!!attendee;
 $('#emptyCredential').hidden=active;$('#credentialArea').hidden=!active;
 if(!active){$('#checkinCode').value='';return}
 $('#ticketName').textContent=attendee.name;
 $('#ticketMusic').textContent='MÚSICA FAVORITA: '+attendee.music;
 $('#ticketAccess').textContent='PASSE: '+attendee.access;
 $('#ticketCode').textContent='CÓDIGO: '+attendee.code;
 $('#ticketStatus').textContent=attendee.checked?'♥ CHECK-IN CONFIRMADO':'♡ AGUARDANDO CHECK-IN';
 $('#ticketStatus').style.color=attendee.checked?'#317b57':'#a83b48';
 $('#downloadPdf').disabled=!attendee.checked;
 $('#checkinCode').value=attendee.code;
 showQR(attendee);
}
$('#registrationForm').addEventListener('submit',e=>{
 e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
 const f=new FormData(form), name=safe(f.get('nome')),doc=safe(f.get('documento')),email=safe(f.get('email')),music=safe(f.get('musica')),access=safe(f.get('acesso')),city=safe(f.get('cidade'));
 if(name.length<3||doc.length<4||!email.includes('@')||!music||!access||city.length<2){msg($('#registerMessage'),'Confira os dados do formulário.',true);return}
 attendee={name,doc,email,music,access,city,code:code(),checked:false,created:new Date().toISOString()};
 try{save();render();msg($('#registerMessage'),`Tudo pronto, ${name}! Seu Sweet Pass foi criado. ♡`);location.hash='#credencial'}catch{msg($('#registerMessage'),'Não foi possível salvar no navegador. Verifique se o armazenamento local está habilitado.',true)}
});
$('#checkinForm').addEventListener('submit',e=>{
 e.preventDefault();attendee=load();const c=$('#checkinCode').value.trim().toUpperCase(),team=$('#teamCode').value.trim().toUpperCase();
 if(!attendee){msg($('#checkinMessage'),'Faça sua inscrição primeiro.',true);return}
 if(c!==attendee.code){msg($('#checkinMessage'),'Código da credencial não encontrado.',true);return}
 if(team!=='SWEET2026'){msg($('#checkinMessage'),'Código de equipe inválido. Use SWEET2026.',true);return}
 attendee.checked=true;attendee.checkedAt=new Date().toISOString();
 try{save();render();msg($('#checkinMessage'),'Check-in confirmado! Seu PDF comemorativo foi liberado. ♡')}catch{msg($('#checkinMessage'),'Falha ao salvar o check-in.',true)}
});
$('#removeData').addEventListener('click',()=>{
 if(!confirm('Remover seus dados e seu check-in deste navegador?'))return;
 localStorage.removeItem(KEY);attendee=null;$('#registrationForm').reset();$('#checkinForm').reset();msg($('#registerMessage'),'Dados removidos.');msg($('#checkinMessage'),'');render();
});
function loadImage(src){
 return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});
}
function drawFit(ctx,im,x,y,w,h){const scale=Math.max(w/im.width,h/im.height);const sw=w/scale,sh=h/scale;ctx.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,x,y,w,h)}
function wrap(ctx,text,maxWidth){
 const words=String(text).split(/\s+/),lines=[];let line='';
 for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}if(line)lines.push(line);return lines;
}
async function ticketCanvas(a){
 // O mesmo ingresso horizontal rosa do site, em alta resolução para o PDF.
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=690;
 const c=canvas.getContext('2d');
 c.fillStyle='#f7e4e2';c.fillRect(0,0,1600,690);
 c.fillStyle='#a83b48';c.fillRect(0,0,16,690);
 c.strokeStyle='#a83b48';c.lineWidth=4;c.strokeRect(2,2,1596,686);
 try{const im=await loadImage('assets/stickers.jpg');drawFit(c,im,17,8,380,674)}catch(e){console.warn('Imagem do ingresso:',e)}
 c.strokeStyle='#b96e76';c.setLineDash([8,6]);c.beginPath();c.moveTo(1230,0);c.lineTo(1230,690);c.stroke();c.setLineDash([]);
 c.fillStyle='#a83b48';c.font='bold 23px Arial';c.fillText('S A B R I N A   C A R P E N T E R   /   S H O R T  N ’  S W E E T',435,90);
 c.font='bold 57px Georgia';const nameLines=wrap(c,a.name,745).slice(0,3);
 nameLines.forEach((line,i)=>c.fillText(line,435,178+i*66));
 let y=240+(nameLines.length-1)*66;
 c.fillStyle='#493538';c.font='25px Arial';
 for(const [label,value] of [['MÚSICA FAVORITA',a.music],['PASSE',a.access],['CIDADE',a.city],['CÓDIGO',a.code]]){
   const lines=wrap(c,label+': '+value,745);lines.forEach(line=>{c.fillText(line,435,y);y+=37});y+=13;
 }
 c.fillStyle=a.checked?'#317b57':'#a83b48';c.font='bold 27px Arial';c.fillText(a.checked?'♥ CHECK-IN CONFIRMADO':'AGUARDANDO CHECK-IN',435,y+15);
 c.fillStyle='#665257';c.font='20px Arial';c.fillText('FAN EXPERIENCE · NÃO OFICIAL',435,605);
 c.fillStyle='#a83b48';c.font='19px Arial';c.fillText('PROJETO ACADÊMICO · MARIA LETÍCIA DA SILVA XAVIER',435,644);
 c.fillStyle='white';c.fillRect(1265,210,295,295);
 try{const img=$('#qrImage');if(img&&!img.hidden&&img.src){const qr=await loadImage(img.src);c.drawImage(qr,1281,226,263,263)}}catch(e){console.warn('QR no ingresso:',e)}
 c.fillStyle='#493538';c.font='17px Arial';c.textAlign='center';c.fillText('APRESENTE NO CHECK-IN',1412,539);c.textAlign='left';
 return canvas;
}
async function pdfViaJsPDF(a,canvas){
 const {jsPDF}=window.jspdf;
 const pdf=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
 pdf.setFillColor(251,241,226);pdf.rect(0,0,297,210,'F');
 pdf.addImage(canvas.toDataURL('image/jpeg',0.96),'JPEG',10,35,277,119.5);
 pdf.setFont('helvetica','bold');pdf.setFontSize(12);pdf.setTextColor(168,59,72);
 pdf.text('SHORT N’ SWEET  |  INGRESSO COMEMORATIVO',148.5,25,{align:'center'});
 pdf.setFont('helvetica','normal');pdf.setFontSize(8);
 pdf.text('Projeto acadêmico não oficial · Não concede acesso a shows reais',148.5,171,{align:'center'});
 pdf.text('Desenvolvido por Maria Letícia da Silva Xavier',148.5,180,{align:'center'});
 pdf.save('Sabrina_Short_n_Sweet_'+a.code+'.pdf');
}
function printable(a,canvas){
 const win=window.open('','_blank');if(!win){alert('Permita pop-ups para salvar o ingresso como PDF.');return}
 const url=canvas.toDataURL('image/png');
 win.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Ingresso Short n Sweet</title><style>@page{size:A4 landscape;margin:10mm}*{box-sizing:border-box}body{background:#fbf1e2;text-align:center;font-family:Arial;color:#a83b48}h1{font-family:Georgia;font-style:italic}img{display:block;width:100%;max-width:100%;margin:10mm auto}small{display:block;margin:10px}button{background:#a83b48;color:white;border:0;padding:15px;cursor:pointer}@media print{button{display:none}body{margin:0}img{margin:8mm auto}}</style></head><body><h1>Short n’ Sweet · Ingresso comemorativo</h1><img src="${url}" alt="Ingresso de ${String(a.name).replace(/["<>]/g,'')}"><small>Projeto acadêmico não oficial · Maria Letícia da Silva Xavier</small><button onclick="window.print()">IMPRIMIR / SALVAR COMO PDF</button></body></html>`);
 win.document.close();win.focus();
}
$('#downloadPdf').addEventListener('click',async()=>{
 const a=load();if(!a?.checked){alert('Faça o check-in antes de baixar o PDF.');return}
 try{const canvas=await ticketCanvas(a);if(window.jspdf?.jsPDF){await pdfViaJsPDF(a,canvas);return}printable(a,canvas)}catch(e){console.error(e);alert('Não foi possível preparar o ingresso. Tente atualizar a página.')}
});
render();
})();