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

let mongoose = require("mongoose");
const urlDB = "mongodb://localhost:27017/MyDB";
let user_Schema = require("./User.js");
let maze_Schema = require("./Maze.js");
let db = mongoose.connect(urlDB);
let userMongo = mongoose.model('user',user_Schema);
let mazeMongo = mongoose.model('maze',maze_Schema);

/* ----------------------------------------------------------------------
 * Funciones para Usuarios
 * ---------------------------------------------------------------------*/

let insertUser = (valor) => (new userMongo(valor).save()); 

let searchUser = (valor) => (userMongo.findOne(valor));

let deleteUser = (valor) => (userMongo.remove(valor));

/* ----------------------------------------------------------------------
 * Funciones para Laberintos
 * ---------------------------------------------------------------------*/

let insertMaze = (user1, valor, slot1) => new mazeMongo({user:user1,data:valor,slot : user1+slot1}).save();

let searchMaze = valor => mazeMongo.findOne({slot : valor}); 

let deleteMaze = valor => mazeMongo.remove(valor);

let updateMaze = (slot, maze) => mazeMongo.update({slot:slot},{$set:{data:maze}}).then((res)=>res.n);

let toAUX = v => {
	return {
		_id:'aux',
		aux:JSON.stringify(v,['x','y','muros','abajo','arriba','derecha','izquierda']),
		sol:JSON.stringify(v.sol,['x','y','muros','abajo','arriba','derecha','izquierda'])
	};
};

let replace = (k, v) => v.sol ? toAUX(v) : v;

module.exports.replace = replace;

module.exports.insertUser = insertUser;
module.exports.searchUser = searchUser;
module.exports.deleteUser = deleteUser;

module.exports.insertMaze = insertMaze;
module.exports.searchMaze = searchMaze;
module.exports.deleteMaze = deleteMaze;
module.exports.updateMaze = updateMaze;