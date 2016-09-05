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

let Schema = require('mongoose').Schema;

module.exports = new Schema({ 
	user:{
		type : String,
		required : true
	},
	data:{ 
		type : String,
		required : true
	},
	slot:{
		type : String,
		required : true,
	}
});