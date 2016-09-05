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

let express = require('express');
let routerUser = express.Router();
let routerMaze = express.Router();
let DB = require("../models_mongo/DataBase.js");
let workerFn = require("./Worker.js");

const send = (res, text, state = 200, end = true, type = {"Content-Type" : "text/plain"}) => {
	res.writeHead(state, type);
	res.write(text);
	end ? res.end() : null;
}

routerUser.post("/insert", (req, res, next) => {
	DB.insertUser(JSON.parse(req.body))
	.then(person => send(res, person.name))
	.catch(err => send(res, "null"));
})

routerUser.get("/search/:user", (req, res, next) => {
	DB.searchUser(JSON.parse(req.params.user))
	.then(person => send(res,person.name))
	.catch(err => send(res,"null"));
})

routerUser.get("/delete/:user",(req, res, next) => {//resp={'ok':1,'n':1}  //resp=null si no lo encontro
	DB.deleteUser(JSON.parse(req.params.user))
	.then(resp => send(res, JSON.stringify(resp)))
	.catch(err => send(res, "null") );
})

//-------------------------------------------------------//

routerMaze.get("/create/:par",(req, res, next) => {
	new Promise((correcto, rechazo) => correcto(JSON.parse(req.params.par)))
		.then(num => (new workerFn()).creaLaberinto({ labHW : num}))
		.then(lab => send(res, JSON.stringify(lab, DB.replace)))
		.catch(e => console.log(e));
})

routerMaze.post("/insert/:user-:slot", (req, res, next) => {
	DB.updateMaze(req.params.user + req.params.slot, req.body)
	.then(re => !re ? DB.insertMaze(req.params.user, req.body, req.params.slot) : re)
	.then(maz => send(res,req.params.user + req.params.slot))
	.catch(err => send(res, "null")); 
})

routerMaze.get("/search/:mazeid", (req, res, next) => { //maze=null si no lo encontro
	DB.searchMaze(req.params.mazeid)
	.then(maze => send(res, maze.data) )
	.catch(err => send(res, "null") );
})

routerMaze.get("/delete/:maze", (req, res, next) => {//resp=null si no lo encontro
	DB.deleteMaze(JSON.parse(req.params.maze))
	.then(resp => send(res, JSON.stringify(resp)))
	.catch(err => send(res, "null"));
})

routerMaze.post("/update/:user-:slot", (req, res, next) => {
	DB.updateMaze(req.params.user + req.params.slot, req.body)
	.then(maze => send(res, maze.data))
	.catch(err => send(res, "null"));
})

module.exports.User = routerUser;
module.exports.Maze = routerMaze;