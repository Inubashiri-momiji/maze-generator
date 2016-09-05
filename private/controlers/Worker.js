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

class WorkerFn{

	constructor(){
		this.pila = [];
		this.entrada;
		this.salida;
		this.cVisitados = 0;
		this.cuadricula;
		this.svgDatos = '<svg id="test" width="600" height="600" version="1.1" xmlns="http://www.w3.org/2000/svg">' + 
	    	'<g xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="square"> ';
		this.alturaCelda;
		this.anchuraCelda;		
	};
	
	static rango (actual, fin, result = []) { // retorna un array entre [start ... end - 1]
		return (actual === fin) ? result : (result[actual] = actual, WorkerFn.rango(actual + 1, fin, result))
	};
		
	static muestra(arreglo) { // retorna un valor aleatorio del arreglo que entra por parametro
		return arreglo[Math.floor(Math.random() * arreglo.length)];
	};
	
	static coord_entrada_salida(celdas, labHW, entrada = null) { // Entrada y salida al azar
		return WorkerFn.muestra(celdas.filter((celda) =>
			celda !== entrada && //evita que la entrada y la salida sean las mismas.
			(!celda.x || // borde izquierdo
				!celda.y || // borde superior
				celda.x === labHW - 1 || // borde derecho
				celda.y === labHW - 1 // borde inferior
			)
		));
	};
	
	static aperturas(celda, labHW) { // Crea una apertura de entrada y salida. 
		if (celda.x === 0) celda.muros.izquierda = false;
		else if (celda.y === 0) celda.muros.arriba = false;
		else if (celda.x === labHW - 1) celda.muros.derecha = false;
		else if (celda.y === labHW - 1) celda.muros.abajo = false;
	};
	
	static obtenerVecinos(cuadricula, celda) {
		const alto = cuadricula.length;
		const ancho = cuadricula[0].length;
		const { x, y } = celda;
		const vecinos = [];
		
		if (y > 0) vecinos.push(cuadricula[y - 1][x]); // arriba
		if (y < alto - 1) vecinos.push(cuadricula[y + 1][x]); // abajo
		if (x > 0) vecinos.push(cuadricula[y][x - 1]); // izquierda
		if (x < ancho - 1) vecinos.push(cuadricula[y][x + 1]); // derecha
		return vecinos;
	};
	
	static getCeldaNoVisitada(celda) {
		return WorkerFn.muestra(celda.vecinos.filter(other => !other.visitado));
	};
	
	static quitaMuros(celda, CeldaObjetivo) {
		if (CeldaObjetivo.y < celda.y) {
			celda.muros.arriba = false;
			CeldaObjetivo.muros.abajo = false;
		} else if (CeldaObjetivo.y > celda.y) {
			celda.muros.abajo = false;
			CeldaObjetivo.muros.arriba = false;
		} else if (CeldaObjetivo.x < celda.x) {
			celda.muros.izquierda = false;
			CeldaObjetivo.muros.derecha = false;
		} else if (CeldaObjetivo.x > celda.x) {
			celda.muros.derecha = false;
			CeldaObjetivo.muros.izquierda = false;
		}
	};
	
	initMatriz(tam){ //Crea una zona cuadriculada. (2D array)
		return WorkerFn.rango(0, tam).map(
		y => WorkerFn.rango(0, tam).map(
		x => ({x, y, visitado: false,muros: {
				arriba: true,
				abajo: true,
				izquierda: true,
				derecha: true
			}
		})));
	};
	
	agregar(X1, Y1, X2, Y2){
		let linea = '<line x1="' + X1 + '" y1="' + Y1 + '" x2="' + X2 + '" y2="' + Y2 + '" />';
		this.svgDatos += linea;
	};
	
	bocetoCeldas(celda, celdaAncho, celdaAltura){
			const {x, y, muros, entrada, salida} = celda;
			const {arriba, abajo, izquierda, derecha} = muros;
			const canvasX = (x * celdaAncho) + 0.5;
			const canvasY = (y * celdaAltura) + 0.5;
			(arriba && y === 0) ? this.agregar(canvasX, canvasY, canvasX + celdaAncho, canvasY): null;//Linea superior 
			(abajo) ? this.agregar(canvasX, canvasY + celdaAltura, canvasX + celdaAncho, canvasY + celdaAltura): null;//Linea inferior
			(izquierda && x === 0) ? this.agregar(canvasX, canvasY, canvasX, canvasY + celdaAltura): null; //Linea izquierda
			(derecha) ? this.agregar(canvasX + celdaAncho, canvasY, canvasX + celdaAncho, canvasY + celdaAltura): null;//Linea derecha 
	};
	
	mulPix(x){
		return (x * this.anchuraCelda) + (this.anchuraCelda / 2);
	}
	
	creaLaberinto({ labHW = 20 }){
		const cCelda = labHW * labHW;
		this.cuadricula = this.initMatriz(labHW);
		
		const celdas = this.cuadricula.reduce((celdas, fila) => (celdas.push(...fila), celdas), []);
		this.cuadricula.sol = [];
		// escoge la entrada y la salida
		this.entrada = WorkerFn.coord_entrada_salida(celdas, labHW);
		this.salida = WorkerFn.coord_entrada_salida(celdas, labHW, this.entrada);

		WorkerFn.aperturas(this.entrada, labHW); //remueve la pared de la entrada
		WorkerFn.aperturas(this.salida, labHW); //remueve la pared de la salida

		celdas.forEach(celda => celda.vecinos = WorkerFn.obtenerVecinos(this.cuadricula, celda));
		this.visit(this.entrada); // escoge la primera celda

		while (this.cVisitados < cCelda) {
			const celdaActual = this.pila[this.pila.length - 1];
			const vecino = WorkerFn.getCeldaNoVisitada(celdaActual);
			vecino ? this.visit(vecino, celdaActual) : this.pila.pop();
		}
		
		this.cuadricula.entrada = this.entrada;
		this.cuadricula.salida = this.salida;
		
		this.anchuraCelda = 600 / this.cuadricula[0].length; //probable para global
		this.alturaCelda  = 600 / this.cuadricula.length;
		
		this.cuadricula.forEach((fila, y) => fila.forEach((celda) => this.bocetoCeldas(celda, this.anchuraCelda, this.alturaCelda))); 
		this.svgDatos += '</g></svg>';
		return {dataSVG:this.svgDatos, 
				Cx : this.mulPix(this.cuadricula.entrada.x), 
				Cy : this.mulPix(this.cuadricula.entrada.y), 
				aux: this.cuadricula};
	};
	
	visit(celda, lastCell){
		if (!celda.visitado) {
			celda.visitado = true;
			this.pila.push(celda);
			
			if (celda.x === this.salida.x && celda.y === this.salida.y) {
				this.cuadricula.sol = [].concat(this.pila);
			}
			
			this.cVisitados += 1;
			
			if (lastCell) {
				WorkerFn.quitaMuros(celda, lastCell);
			}	
		}
		return celda;
	};	
};






module.exports = WorkerFn;