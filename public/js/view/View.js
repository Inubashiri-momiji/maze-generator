/* ----------------------------------------------------------------------
 * Universidad Nacional de Costa Rica
 * Facultad de Ciencias Exactas y Naturales
 * Escuela de Informática
 * EIF400 Paradigmas de Programación
 * Proyecto programado I
 * Profesor: Dr.Carlos Loría-Sáenz
 * Estudiantes:
 *	Carlos Arroyo Villalobos
 *	Jean Carlo Campos Madrigal
 *  Andrés Navarro Durán
 *	Karina Rivera Solano
 *	Claudio Umaña Arías
 * Setiembre,2016
 * ---------------------------------------------------------------------*/

class View{

	static get (id){ return document.getElementById(id); }
	static downUp(id, modo="block"){ View.get(id).style.display = modo; }
	
	constructor(){
		let canvas = View.get("canvasID");
		canvas.width=canvas.height=600;
		this.ctx = canvas.getContext("2d");
		this.boceto;
		this.audio = View.get("myAudio");
		this.audio.volume=0.2;
		this.NOarrow = new Image();
		this.arrowUP = new Image();
		this.arrowDOWN = new Image();
		this.arrowLEFT = new Image();
		this.arrowRIGHT = new Image();
		this.initArrows();
	}
	
	initArrows(){	
		this.NOarrow.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUHBwf///+XK0vMAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAQklEQVQIHWP4z/+B4cfHDwyf/xUwvP9vwHD//waG+f8vMOz/fwCIHzDUo+H9MAxUcx+IzwPVP/9fwPDzzweGP8wfAJstMQc6rrGXAAAAAElFTkSuQmCC'
	
		this.arrowUP.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABVSURBVAgdY/jP/4Hhx8cPDJ//FTC8v2/AcL9/A8N8/gsM+9kPMOxjf8BQx/yAoQaEGR8wVDA8YNgAxgUM+/9fYLgPxOf/b2B4/r+A4eefDwx/mD8AAPXyJwc/o0y1AAAAAElFTkSuQmCC'; 
		
		this.arrowDOWN.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABVSURBVAgdY/jD/IHh888PDO//FTDc/2/AsP//BiC+wJDAcIGhAIQZHzBUMD9gqAFh9gcMdewXGOz4LzDs55/AcF9+A8P5/QUMz/98YPjx8QPDf/4PAOdZJTf5fbptAAAAAElFTkSuQmCC'; 
		
		this.arrowRIGHT.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABQSURBVAgdY/jP/4Hhx8cPDM//fGA4/7+A4c7/DQx76icw2MhfYKhhB2LGBww1DCCcAKGZgWL8Fxj22ANx/QaGu/8NGN7/K2D4/PMDwx/mDwDzJSVCIcoFWQAAAABJRU5ErkJggg=='; 
		
		this.arrowLEFT.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlP/AOW3MEoAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVAgdY/jD/IHh558PDM//FzCc/72B4f7jCwz7DwMx8wOGPUBcAMQJULoCiPcB8f7mCwzzgeruf97A8P6/AcPnfwUMPz5+YPjP/wEAZ0Io67/ILzgAAAAASUVORK5CYII='; 
	}
	
	runBoceto(prevLaberinto,ancho){
		this.boceto = new BocetoLaberinto(prevLaberinto,ancho);
		this.boceto.init();
	}
	
	clearCtx(width, height=width, x=0, y=0){
		this.ctx.clearRect(x, y, width, height);
	}
	
	static register(){
		Controller.register( View.get("userI").value , View.get("passI").value );	
	}
	
	static login(){
		Controller.login(View.get("userI").value,View.get("passI").value);		
	}
	
	salidaFound(){
		alert("Has encontrado la salida!!");
	}
	
	static registerConf(user){
		if(user){
			View.get("userI").className = "";
			View.get("userI").title ="";
			View.downUp("divP3","none");
		}else{
			View.get("userI").className = "error";
			View.get("userI").title ="Intente con otro nombre de usuario";
		}
		return user;
	}
	
	static loginConf(user){ 
		if(user){
			View.get("userI").className = "";
			View.get("userI").title ="";
			View.get("passI").className = "";
			View.get("passI").title ="";
			View.downUp("divP3","none");
		}else{
			View.get("userI").className = "error";
			View.get("userI").title ="Usuario o contraseña erronea";
			View.get("passI").className = "error";
			View.get("passI").title ="Usuario o contraseña erronea";
		}
		return user;
	}
	
	static conexion(){
		Array.from(document.getElementsByClassName("OnS")).forEach( (e)=> e.onclick = (ele)=> control.guardar(ele,true) );
		Array.from(document.getElementsByClassName("OnC")).forEach( (e)=> e.onclick = (ele)=> control.cargar(ele.target.dataset.id,true,parseInt(ele.target.dataset.modo)));
	}
	
	static noConexion(error=true){
		Array.from(document.getElementsByClassName("OnS")).forEach( (e)=> e.onclick = (ele)=> alert("Error en la conexion, intente el login o juegue offline") );
		Array.from(document.getElementsByClassName("OnC")).forEach( (e)=> e.onclick = (ele)=> alert("Error en la conexion, intente el login o juegue offline") );
		DBLocal.guardarUser("user", new User(""))
		error?alert("\tError: no hay conexión."):null;
	}
	
	bolita(Cx, Cy, r) {		
		this.ctx.fillStyle='black';		
		this.ctx.beginPath();
		this.ctx.arc(Cx, Cy, r, 0, Math.PI * 2, true);
		this.ctx.fill();
	};
	
	getGradient(){
		let gradient = this.ctx.createLinearGradient(0,0,600, 600);
		gradient.addColorStop(0,"white");
		gradient.addColorStop(0.25,"lightskyblue");
		gradient.addColorStop(0.5,"royalblue");
		gradient.addColorStop(0.75,"lightskyblue");
		gradient.addColorStop(1,"lightblue");
		return gradient;
	}
	
	estela(g, dir){//se debe decir la direccion tomada
		this.ctx.beginPath();
		this.ctx.fillStyle=this.getGradient();
		this.clearCtx(g.dXY * 0.75, g.dXY * 0.75, g.Cx - (g.dXY * 0.35), g.Cy - (g.dXY * 0.35));
		this.ctx.arc(g.Cx, g.Cy, g.dXY * 0.3, 0, Math.PI * 2, true);
		this.ctx.fill();
		
		this.drawArrow(g, dir);

		this.ctx.fillStyle = "black"; 
	}
	
	drawArrow(g, dir){
		let rrw = {
			87 : () => this.ctx.drawImage(this.arrowUP, g.Cx - (g.dXY * 0.30), g.Cy - (g.dXY * 0.30), g.dXY * 0.60, g.dXY * 0.60),
			83 : () => this.ctx.drawImage(this.arrowDOWN, g.Cx - (g.dXY * 0.30), g.Cy - (g.dXY * 0.30), g.dXY * 0.60, g.dXY * 0.60),
			65 : () => this.ctx.drawImage(this.arrowLEFT, g.Cx - (g.dXY * 0.30), g.Cy - (g.dXY * 0.30), g.dXY * 0.60, g.dXY * 0.60),
			68 : () => this.ctx.drawImage(this.arrowRIGHT, g.Cx - (g.dXY * 0.30), g.Cy - (g.dXY * 0.30), g.dXY * 0.60, g.dXY * 0.60),
			'nan' : () => this.ctx.drawImage(this.NOarrow, g.Cx - (g.dXY * 0.30), g.Cy - (g.dXY * 0.30), g.dXY * 0.60, g.dXY * 0.60)
		};
		rrw[dir]();
	}
	
	static bloquearBotones(){
		View.get("solve-button").onclick=() => alert("Resolviendo laberinto, espere un momento.");
		View.get("create-button").onclick = () => alert("Resolviendo laberinto, espere un momento.");
		Array.from(document.getElementsByClassName("OnS")).forEach( (e)=> e.onclick = (ele)=> alert("Resolviendo laberinto, espere un momento."));
		Array.from(document.getElementsByClassName("OffS")).forEach( (e)=> e.onclick = (ele)=> alert("Resolviendo laberinto, espere un momento."));
		Array.from(document.getElementsByClassName("OffC")).forEach( (e)=> e.onclick = (ele)=> alert("Resolviendo laberinto, espere un momento."));
		Array.from(document.getElementsByClassName("OnC")).forEach( (e)=> e.onclick = (ele)=> alert("Resolviendo laberinto, espere un momento."));
	}

	static habilitarBotones(){
		Array.from(document.getElementsByClassName("OnS")).forEach( (e)=> e.onclick = (ele)=> control.guardar(ele,true) );
		Array.from(document.getElementsByClassName("OffS")).forEach( (e)=> e.onclick = (ele)=> control.guardar(ele,false) );
		Array.from(document.getElementsByClassName("OffC")).forEach( (e)=> e.onclick = (ele)=> control.cargar(ele.target.dataset.id,false,parseInt(ele.target.dataset.modo)));
		Array.from(document.getElementsByClassName("OnC")).forEach( (e)=> e.onclick = (ele)=> control.cargar(ele.target.dataset.id,true,parseInt(ele.target.dataset.modo)));
		View.get("solve-button").onclick=() => control.solve();
		View.get("create-button").onclick = () => control.crearLaberinto();
	}
	
};

window.onload = () => {
	vista = new View();
	control = new Controller();
	View.get("register").onclick = () => View.register();
	View.get("login").onclick = () => View.login();
	View.get("offline").onclick = () => control.offline();
	View.get("login-button").onclick = () => View.downUp("divP3");
	Array.from(document.getElementsByClassName("OnS")).forEach( (e)=> e.onclick = (ele)=> control.guardar(ele,true) );
	Array.from(document.getElementsByClassName("OffS")).forEach( (e)=> e.onclick = (ele)=> control.guardar(ele,false) );
	Array.from(document.getElementsByClassName("OffC")).forEach( (e)=> e.onclick = (ele)=> control.cargar(ele.target.dataset.id,false,parseInt(ele.target.dataset.modo)));
	Array.from(document.getElementsByClassName("OnC")).forEach( (e)=> e.onclick = (ele)=> control.cargar(ele.target.dataset.id,true,parseInt(ele.target.dataset.modo)));
	View.get("solve-button").onclick=() => control.solve();
	View.get("create-button").onclick = () => control.crearLaberinto();
	window.addEventListener('keydown', (e) => control.doKeyDown(e), true);
	control.crearLaberinto(); 
};

var vista;
