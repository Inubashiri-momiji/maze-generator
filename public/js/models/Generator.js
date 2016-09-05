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

class Generator{
	
	constructor(){
		this.aux;
		this.Cy = 0;
		this.Cx = 0;
		this.dimension = 600;
		this.laberintoWH = 55;
		this.worker = new Worker("./js/models/MyWorker.js");
		this.dXY = this.dimension / this.laberintoWH;
	};
	
	updateWH(nWH){
		this.laberintoWH = nWH;
		this.dXY = this.dimension / this.laberintoWH;
	}
	
	dibujar(cuadricula, dimension){
		vista.clearCtx(dimension);
		vista.runBoceto(cuadricula, dimension - 1);
	};
	
	runWorker(work, options){
		return new Promise((resolve, reject) => {
			work.onmessage = ({data, options}) => data.error ? reject(data.error):resolve(data.laberinto);
			work.postMessage(options);
		});
	};
		
	crearLaberinto(options = {labHW:this.laberintoWH}, dimension = this.dimension){
		return new Promise((resolve, reject) => resolve(this.worker ? this.worker : null))
		.then(w => this.runWorker(w, options)
			.then(cuadricula => this.dibujar(cuadricula, dimension))
			.catch(er => console.log(er)))
		.catch(er => console.log(er));						
	};
	
	crearLaberintoServer(options = {labHW : this.laberintoWH}){
		return new Promise((c,r) => {
			let flag = false;
			fetch("maze/create/" + options.labHW)
				.then(res => (flag = true,res))
				.then(res => res.text())
				.then(res => c(JSON.parse(res, DBLocal.reviver)));
			setTimeout(() => { !flag ? c(null) : null }, 1500);			
		});
	};
};