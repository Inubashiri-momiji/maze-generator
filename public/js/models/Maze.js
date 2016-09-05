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

function Maze(user, dataURL, Coord, aux, dataSVG){
	this.user = user;
	this.dataURL = dataURL;
	this.Coord = Coord;
	this.aux = aux;
	this.dataSVG = dataSVG;
}

Maze.to = v => {
	return {
		_id: 'Maze',
		user: v.user,
		dataURL: v.dataURL,
		Coord: v.Coord,
		aux: v.aux,
		dataSVG: v.dataSVG
	};	
};

Maze.toAUX = v => {
	return {
		_id:'aux',
		aux:JSON.stringify(v,['x','y','muros','abajo','arriba','derecha','izquierda']),
		sol:JSON.stringify(v.sol,['x','y','muros','abajo','arriba','derecha','izquierda'])
	};
}

Maze.from = v => new Maze(v.user,v.dataURL, v.Coord, v.aux,v.dataSVG);

Maze.fromAUX = v => {
	return {
		main:JSON.parse(v.aux),
		sol:JSON.parse(v.sol)
	};
}





