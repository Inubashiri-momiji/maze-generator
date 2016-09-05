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

class Controller{
	
	constructor(){
		this.generator = new Generator();
		this.dBObject  = new DBLocal();
	}
	
	setDBMode(db){
		this.dBObject = db ? new DBServer() : new DBLocal();
	}

	static register(username, password){
		(Controller.validar(username+password))?(
		DBServer.guardarUser(new User(username, password))
		.then(res => View.registerConf(res))
		.then(res => DBLocal.guardarUser("user", new User(res)))
		.then( () => View.conexion())
		.catch(err => View.noConexion()))
		:View.registerConf(false);
	};
	
	static validar(str){
		return /^[A-Za-z0-9]+$/.test(str);
	}

	static login (username, password){
		(Controller.validar(username+password))?(
		DBServer.cargarUser(new User(username,password))
		.then(res => View.loginConf(res))
		.then(res => DBLocal.guardarUser("user", new User(res)))
		.then( () => View.conexion())
		.catch(err =>View.noConexion()))
		:View.loginConf(false);
	};
	
	offline(){
		DBLocal.guardarUser("user", new User(""));
		View.downUp("divP3", "none");
		View.noConexion(false);
	}
	
	guardar(elem, mode){
		this.setDBMode(mode);
		this.dBObject.guardarMaze(new Maze(DBLocal.cargarUser("user").name,
			View.get("canvasID").toDataURL(),
			{Cy : this.generator.Cy, Cx : this.generator.Cx},
			this.generator.aux,
			vista.boceto.svgDatos),
			elem.target.id
		)
	}
	
	cModeSVG(res){
		vista.boceto.svgDatos = res.dataSVG;
		vista.clearCtx(this.generator.dimension);
		vista.boceto.mulPix(res.aux.sol[0].x,res.aux.sol[0].y);
		vista.boceto.svgInit();
	}
	
	cModeURI(res){
		this.generator.Cy = res.Coord.Cy;
		this.generator.Cx = res.Coord.Cx;
		vista.boceto.uriInit(res.dataURL);
	}
	
	cargar(id = undefined, dbMode, mode = false){
		this.setDBMode(dbMode);
		this.dBObject.cargarMaze(id)
		.then(res => {
			this.generator.aux = res.aux.main;
			this.generator.aux.sol = res.aux.sol;
			this.generator.updateWH(this.generator.aux.length);
			vista.boceto.celdaWH = this.generator.dXY;
			(mode) ? this.cModeSVG(res) : this.cModeURI(res);
		})
		.catch(() => alert("vacio"));
	}

	solve() {
		View.bloquearBotones();
		const celdaWH = (this.generator.dimension - 1) / this.generator.laberintoWH;
		this.generator.aux.sol.forEach((value, index,arr) => {
			setTimeout((g = control.generator) => {
				vista.estela(g, 'nan');
				g.Cx = (value.x * celdaWH) + (celdaWH / 2);
				g.Cy = (value.y * celdaWH) + (celdaWH / 2);
				vista.bolita(g.Cx, g.Cy, g.dXY * 0.3);
			}, 200 * (index));
			if(index==arr.length-1)
			   setTimeout(View.habilitarBotones, 200 * (index+1));
		});
	};
	  
	crearLaberinto(){
		this.generator.updateWH(parseInt(View.get("Dificultad").value));
		this.generator.crearLaberintoServer()
	   .then(res => {
			this.generator.aux = res.aux.main;
			this.generator.aux.sol = res.aux.sol;
			vista.boceto.celdaWH = this.generator.dXY;
			this.cModeSVG(res);
		})
		.catch(err => this.generator.crearLaberinto());
	}
	
	doKeyDown(evt, g = control.generator){	
				
		let pad = {
			87 : (x,y) => (collide["u_p"](x, y) && g.Cy - g.dXY > 1) ? ((g.Cy -= g.dXY),true) : false,
			83 : (x,y) => (collide["dwn"](x, y) && g.Cy + g.dXY < g.dimension - 1) ? ((g.Cy += g.dXY),true) : false,
			65 : (x,y) => (collide["lft"](x, y) && g.Cx - g.dXY > 1) ? ((g.Cx -= g.dXY),true) : false,
			68 : (x,y) => (collide["rgt"](x, y) && g.Cx + g.dXY < g.dimension - 1) ? ((g.Cx += g.dXY),true) : false
		};
		
		let collide = {
			"u_p" : (x,y) => !(this.generator.aux[y][x].muros.arriba),
			"dwn" : (x,y) => !(this.generator.aux[y][x].muros.abajo),
			"lft" : (x,y) => !(this.generator.aux[y][x].muros.izquierda),
			"rgt" : (x,y) => !(this.generator.aux[y][x].muros.derecha)
		};
		if(View.get("divP3").style.display == "none"){
		vista.estela(g, evt.keyCode);
		((pad[evt.keyCode]||(o => true))(parseInt(g.Cx / g.dXY), parseInt(g.Cy / g.dXY))) ? 
			(this.winCheck(parseInt(g.Cx / g.dXY), parseInt(g.Cy / g.dXY)),
			vista.bolita(g.Cx, g.Cy, g.dXY * 0.3)) :
			(vista.audio.play(), vista.bolita(g.Cx, g.Cy, g.dXY * 0.3));  
		}
	};
		
	winCheck(xCell, yCell){
		if((this.generator.aux.sol[this.generator.aux.sol.length - 1].x == xCell) &&
		  (this.generator.aux.sol[this.generator.aux.sol.length - 1].y == yCell))
			vista.salidaFound();
	}
};

var control;