import{createServer as q}from"http";import B from"morgan";import $ from"express";import K from"cors";import{Server as z}from"socket.io";import"dotenv/config";import{Schema as E,model as P}from"mongoose";var j=new E({username:String,instances:String,subscription:{type:String,default:()=>new Date().toLocaleString("es-CO",{timeZone:"America/Bogota"})},screen:{type:Number,default:0},limitScreen:Number}),m=P("User",j);import y from"chalk";import F from"mongoose";import M from"ora";var T=async()=>{try{let e=M(` ${y.blue("Conectando base de datos local.....")}`).start();e.spinner="arc",e.color="blue",await F.connect("mongodb+srv://MiguelFullstack:hookom119@hook.lb2oqov.mongodb.net/claro-cli"),e.color="green",e.succeed(`${y.greenBright("\xA1Base de datos local conectada con \xE9xito!")}`)}catch(e){throw console.log(e),new Error("Error a la hora de iniciar la base de datos")}};var S=({arr:e,size:t})=>{let n=[],c=e.length/t;for(let o=0;o<e.length;o+=c){let r=e.slice(o,o+c);n.push(r)}return n};var U=e=>!isNaN(new Date(e).getTime()),k=()=>new Date(Date.now()).toISOString().split(".")[0],Y=e=>{let t=k();return Date.parse(t)<=Date.parse(e)},h=e=>{let t=new Date(e);return U(e)?Y(t):"La fecha l\xEDmite no es v\xE1lida."};import I from"moment";import L from"puppeteer";import V from"axios";import G from"proxy-chain";var C=async({socket:e,instanceIndex:t,username:n})=>{let c=null,o=!1,r=!1,s=!1;do try{do{let{data:i}=await V(`${process.env.PROXY_API}`);c=i,s&&await new Promise(f=>setTimeout(()=>f(),2300)),s=!0}while(c?.data===null);let l=await G.anonymizeProxy({url:`http://${c}`,port:3e3});r=await L.launch({headless:"shell",args:[`--proxy-server=${l}`,"--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--disable-accelerated-2d-canvas","--disable-gpu"]}),o=await r.newPage(),o.setDefaultNavigationTimeout(0),o.setDefaultTimeout(0),await o.setRequestInterception(!0),await o.on("request",i=>{["image","stylesheet","font"].indexOf(i.resourceType())!==-1?i.abort():i.continue()}),await o.goto("https://portalpagos.claro.com.co/phrame.php?action=despliegue_personal&clase=vistasclaro&metodo=pantalla_inicio&empresa=claro#no-back-button",{waitUntil:"domcontentloaded"}),e.to(n).emit("[claro] exectMsg",{msg:`Instancia ${t} ejecutandose....`}),await o.waitForSelector("h1",{visible:!0});let p=await o.$("h1");await o.evaluate(i=>i?.innerText,p)!="Portal de PAGOS Y RECARGAS"&&(await r.close(),r=!1,o=!1)}catch{o=!1,r=!1}while(o==!1);return{page:o,browser:r}},H=async({arrPhones:e,socket:t,username:n,sockOff:c,instanceIndex:o})=>{let r=!1,s=!1,l=await C({socket:t,instanceIndex:o,username:n});r=l.page,s=l.browser;for(let[p,u]of e.entries()){if(c.connected==!1){await s.close();break}try{let{bin:i}=u;await r.waitForSelector("#select > div > h1");let f=new Date,{price:b,status:x}=await r.evaluate(async A=>{let w=new Headers,a=new FormData;a.append("FLUJOPAGOGW","PFPHM"),a.append("FLUJOPAGO","10002"),a.append("ex",""),a.append("paramLista",""),a.append("action","despliegue_personal"),a.append("campos_borrar","CLACO_NUMERO"),a.append("operacion","Adicionar"),a.append("url_modal",""),a.append("id_objeto","10002"),a.append("valor_llave",""),a.append("parametros_padre","&ValorTotal=&SaldoParcial=&NumeroCelular=&FechaVencimiento=&FORMA_PAGO=&VALOR_PLAN=&VALOR_CUOTEQUIP=&FECHA_CARGADATOS=&CODIGO_CLIENTE="),a.append("mensaje_error","Debe asignar a un responsable para la actividad a seguir"),a.append("go",""),a.append("preguardar",""),a.append("confGuardaComo","Seguro que desea duplicar este registro"),a.append("modifi_detalle",""),a.append("nombre_campo",""),a.append("latitud",""),a.append("longitud",""),a.append("enviarForm",""),a.append("autoguardar",""),a.append("guion_encuesta",""),a.append("clase","vistasclaro"),a.append("metodo","confirmacion"),a.append("empresa","claro"),a.append("NumeroCelular",`${A}`),a.append("CLACO_NUMERO",""),a.append("NRO_CUENTA",""),a.append("TIPO_TRANS",""),a.append("USRIO_NUMERO",""),a.append("IPTRANSACCION",""),a.append("TIPO_TRANS_ORIG",""),a.append("FECHA_INICIO","2024-07-13 02:21"),a.append("NumeroIdentificacion",""),a.append("CodigoCliente",""),a.append("IdentificacionDeudor",""),a.append("OrigenPago",""),a.append("mySubmit_","Continuar");let v=await fetch("https://portalpagos.claro.com.co/phrame.php?id_objeto=100002",{method:"POST",headers:w,body:a,redirect:"follow"});return{price:(await v.text()).split(`
`).filter(g=>g.includes("ValorTotalEdit")).map(g=>g.split(/[<>]/g)).flat().filter(g=>g.includes("$"))[0]?.split(",")[0].replaceAll("$","").replaceAll(".",""),status:v.status}},i);if(x==403)throw await s.close(),t.to(n).emit("[claro] exectMsg",{msg:`HA OCURRIDO UN ERROR CON LA INSTANCIA ${p} SE CERRARA AUTOMATICAMENTE`}),"error 403 ";try{await(await r?.cookies("https://portalpagos.claro.com.co/")).map(async({name:w})=>{await r.deleteCookie({name:w})})}catch{await(await r?.cookies("https://portalpagos.claro.com.co/")).map(async({name:a})=>{await r.deleteCookie({name:a})})}let O=new Date().getTime()-f.getTime()+"ms";if(b){await t.to(n).emit("[claro] live",{bin:i,price:b,msg:`N\xFAmero ${i} tiene una factura con deuda de ${b} - ${O}`});continue}await t.to(n).emit("[claro] dead",{bin:i,msg:`N\xFAmero ${i} no tiene factura - ${O}`})}catch(i){console.log(i),s!=!1&&await s.close(),t.to(n).emit("[claro] exectMsg",{msg:`Ha ocurrido un error con la instancia ${o} esta sera reiniciada....`}),e.splice(p+1,0,u);let f=await C({socket:t,instanceIndex:o,username:n});r=f.page,s=f.browser;continue}}await s.close()},D=async({phones:e,instances:t,socket:n,username:c,sockOff:o})=>{let r=S({arr:e,size:t});return await[...Array(Number(t))].map(async(s,l)=>{H({arrPhones:r[l].flat(),socket:n,sockOff:o,username:c,instanceIndex:++l})})};var d=$();d.use(K({origin:"*"}));d.use($.json({limit:"1000mb"}));d.use(B("common"));var N=3001,R=q(d),_=new z(R,{cors:"*",maxHttpBufferSize:1e10});await T();d.post("/user/createUser",async(e,t)=>{let{token:n,instances:c,subscription:o,screen:r,limitScreen:s,createKey:l}=e.body;if(await m.findOne({username:n}))return t.status(404).json({msg:"Este token ya existe"});if(n==null||o==null||c==null||s==null)return t.status(400).json({msg:"Por favor envie toda la informacion completa"});if(l!=process.env.CREATE_KEY)return t.status(404).json({msg:"No tienes suficientes permisos para crear usuarios"});let u=new Date(Date.now()+3600*1e3),i=I(u,"YYYY-MM-DD hh:mm:ss").add({day:o}).toISOString();return await m.create({username:n,instances:c,subscription:i,screen:r,limitScreen:s}),t.status(200).json({msg:`Token ${n} con ${s} pantallas simultanea con ${c} instancias durante ${o} dias`})});d.post("/user/getSubcription",async(e,t)=>{try{let{token:n}=e.body,c=await m.findOne({username:n});if(c==null)return t.status(404).json({msg:"Este token es invalido"});let{instances:o,subscription:r}=c;if(o==0)return t.status(404).json({msg:"No tienes instancias disponibles, por favor contacta al administrador"});let s=r;return h(s)==!1?t.status(400).json({msg:`Ya ha caducado tu subcripcion de ${s.split("T")[0].replaceAll("-"," ")} con hora ${s.split("T")[1]}, por favor contacta al administrador`}):t.status(200).json({msg:`Tienes ${o} pantallas simultaneas hasta el dia ${s.split("T")[0].replaceAll("-"," ")} con hora ${s.split("T")[1]}`})}catch(n){return console.log(n),t.status(500).json({msg:"error en el servidor"})}});d.post("/user/updateSubcription",async(e,t)=>{try{let{token:n,subscriptionDaysMore:c}=e.body,o=await m.findOne({username:n});if(o==null)return t.status(404).json({msg:"Este token es invalido"});let{subscription:r,instances:s,username:l}=o,u=h(r),i=I(new Date(Date.now()+3600*1e3),"YYYY-MM-DD hh:mm:ss").add({day:c}).toISOString();return await m.findOneAndUpdate({username:l},{$set:{subscription:i}},{new:!0}).select({userRef:0,__v:0}),t.status(200).json({msg:`Tienes ${s} pantallas simultaneas hasta el dia ${i.split("T")[0].replaceAll("-"," ")} con hora ${i.split("T")[1]}`})}catch(n){return console.log(n),t.status(500).json({msg:"error en el servidor"})}});d.get("*",async(e,t)=>t.json({ok:!0}));_.on("connection",async e=>{try{let t=e.handshake?.query["X-TOKEN-KEY"],n=await m.findOne({username:t});if(n==null)return e.emit("[claro] msg",{msg:"\xA1Vaya! Parece tienes un usuario invalido, por favor contacta con el administrador.",error:!0}),e.disconnect(!0);let{username:c,screen:o,limitScreen:r,instances:s,subscription:l}=n;if(o>=r)return e.emit("[claro] msg",{msg:"Has superado el limite de pantallas, si deseas agregar m\xE1s por favor contacta con el administrador",error:!0}),e.disconnect(!0);let p=l;if(h(p)==!1)return res.status(400).json({msg:`Ya ha caducado tu subcripcion de ${p}, por favor contacta al administrador`});await e.join(c),e.on("[claro] initChecker",async({phones:i})=>{await D({phones:i,instances:s,socket:_,sockOff:e,username:c})}),e.on("disconnect",()=>e.removeAllListeners())}catch(t){console.log(t)}});R.listen(N??0,()=>console.log(`conectado al servidor ${N}`));export{_ as io};