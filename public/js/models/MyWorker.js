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

onmessage = function({data = {}}) {
	new Promise((correcto, rechazo) => correcto(new WorkerFn()))
		.then(w => w.creaLaberinto(data))
		.then(lab => postMessage({laberinto: lab, error: null}))
		.catch(error => postMessage({error:error.toSource() + " " + error.columnNumber}));
};

class WorkerFn{

	constructor(){
		this.pila = [];
		this.entrada;
		this.salida;
		this.cVisitados = 0;
		this.cuadricula;
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
		
		return this.cuadricula;
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