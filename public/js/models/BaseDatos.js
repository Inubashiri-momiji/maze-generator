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

class DBLocal{

	constructor(){}
		
	static guardarUser(id, obj, fun = null){
		localStorage.setItem(id, JSON.stringify(obj, fun));
	}
		
	static cargarUser(id){
		return JSON.parse(localStorage.getItem(id));
	}
	
	guardarMaze(maze, id){
		localStorage.setItem(id, JSON.stringify(maze, DBLocal.replace));
	}
	
	cargarMaze(id){
		return new Promise((correc, recha) => correc(JSON.parse(localStorage.getItem(id), DBLocal.reviver)));
	}
	
	static replace(k, v){
		return (v instanceof Maze) ? Maze.to(v) : (v.sol ? Maze.toAUX(v): v);
	}
	
	static reviver(k, v){
		if(v instanceof Object && v._id == 'Maze')
			return Maze.from(v);
		if(v instanceof Object && v._id == 'aux')
			return Maze.fromAUX(v);
		return v;
	}
	
}

class DBServer{
	
	constructor(){	}
	
	static guardarUser(person){
		return fetch("/user/insert",{method: 'post', body:JSON.stringify(person)})
			.then(response => response.text())  
			.then(data => data != "null" ? data : false);
	}
	
	static cargarUser(person){
		return fetch("/user/search/" + JSON.stringify(person))
				.then(response => response.text())  
				.then(data => data!="null" ? data : false);
	}
	
	guardarMaze(maze, id){
		return fetch( "/maze/insert/" + maze.user + "-" + id,
					{method: 'post', body:JSON.stringify(maze,DBLocal.replace)})
				.then(response => response.text())
				.then(data => data!="null" ? data : false)
				.catch( err =>  View.noConexion());
	}
	
	cargarMaze(id){
		return fetch("/maze/search/" + DBLocal.cargarUser("user").name + id)
				.then(response => response.text())
				.then(obj => JSON.parse(obj, DBLocal.reviver))				
				.catch(err => View.noConexion());
	}
	
}