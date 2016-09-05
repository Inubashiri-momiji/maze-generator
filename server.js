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
let routes  = require('./private/controlers/Routers.js');
let server = express();
let bodyParser = require('body-parser');

const puerto = process.argv[2] || 4444;
server.use(bodyParser.text({limit: '50mb'}));
server.use("/user",routes.User);
server.use("/maze",routes.Maze);
server.use(express.static("public"));
server.listen(puerto, () => console.log("El servidor esta corriendo en el puerto: " + puerto + "\nPara deternerlo presione CTRL+C"));