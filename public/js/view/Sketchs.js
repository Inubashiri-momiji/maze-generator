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

class BocetoLaberinto{
	
	constructor(prevLaberinto,ancho){
		this.svgDatos = '<svg id="test" width="600" height="600" version="1.1" xmlns="http://www.w3.org/2000/svg">' + 
			   '<g xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square"> ';
		this.cY = prevLaberinto.length;
		this.celdaWH = ancho / this.cY;
		this.prevLaberinto = prevLaberinto;
		this.prevLaberinto.forEach((fila, y) => fila.forEach((celda) => this.bocetoCeldas(celda, this.celdaWH))); 
		this.svgDatos += '</g></svg>';
	};
	
	init(){
		this.mulPix(this.prevLaberinto.entrada.x,this.prevLaberinto.entrada.y);
		control.generator.aux = this.prevLaberinto;
		this.svgInit();
	}
	
	mulPix(x,y){
		control.generator.Cx = (x * this.celdaWH) + (this.celdaWH / 2);
		control.generator.Cy = (y * this.celdaWH) + (this.celdaWH / 2);
	}
	
	svgInit(){
		let DOMURL = window.URL || window.webkitURL || window;
		let img = new Image();
		let svg = new Blob([this.svgDatos], {type: 'image/svg+xml;charset=utf-8'});
		let url = DOMURL.createObjectURL(svg);
		img.onload = function() {
			vista.ctx.drawImage(img, 0, 0);
			DOMURL.revokeObjectURL(url);
		}
		img.src = url;
		vista.bolita(control.generator.Cx, control.generator.Cy, control.generator.dXY * 0.3); 
	}
	
	uriInit(dataURL){
		let img = new Image();
		img.onload = function(){
			vista.clearCtx(control.generator.dimension);
			vista.ctx.drawImage(img,0,0); // Or at whatever offset you like
		};
		img.src = dataURL;			
	}
	
	agregar(X1, Y1, X2, Y2) { //agrega una linea basado en sus coordenadas
		this.svgDatos += '<line x1="' + X1 + '" y1="' + Y1 + '" x2="' + X2 + '" y2="' + Y2 + '" style="stroke:rgb(0,0,0);stroke-width:1.5" />';
	}
	
	bocetoCeldas(celda, celdaWH) {
		const {x,y,muros,entrada,salida} = celda;
		const {arriba,abajo,izquierda,derecha} = muros;
		const canvasX = (x * celdaWH) + 0.5;
		const canvasY = (y * celdaWH) + 0.5;
		(arriba && y === 0) ? this.agregar(canvasX, canvasY, canvasX + celdaWH, canvasY): null; //linea superior 
		(abajo) ? this.agregar(canvasX, canvasY + celdaWH, canvasX + celdaWH, canvasY + celdaWH): null; // linea inferior
		(izquierda && x === 0) ? this.agregar(canvasX, canvasY, canvasX, canvasY + celdaWH): null; //linea izquierda
		(derecha) ? this.agregar(canvasX + celdaWH, canvasY, canvasX + celdaWH, canvasY + celdaWH): null; //linea derecha 
	};
};
	
	