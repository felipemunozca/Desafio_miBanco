
const { Pool } = require('pg');
const Cursor = require('pg-cursor');

const config = {
    user: 'felipe',
    host: 'localhost',
    password: '123456',
    database: 'Banco',
    port: '5432',
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
}

const pool = new Pool(config);

let descripcion, fecha, monto, cuenta;
const argumentos = process.argv.slice(2);
let comando = argumentos[0];


/* 1. Crear una función asíncrona que registre una nueva transacción utilizando valores ingresados 
como argumentos en la línea de comando. Debe mostrar por consola la última transacción realizada. */

const depositar = (descripcion, fecha, monto, cuenta) => {
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion){
            console.log("Ha ocurrido un error al conectarse a la Base de Datos.", error_conexion)
            release();
        } else {
            try {
                await client.query('BEGIN');

                const insertarSQL = {
                    rowMode: "array",
                    text: "INSERT INTO transacciones(descripcion, fecha, monto, cuenta) VALUES($1, $2, $3, $4) RETURNING *;",
                    values: [descripcion, fecha, monto, cuenta]
                };

                const actualizarSQL = {
                    rowMode: "array",
                    text: "UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2 RETURNING *;",
                    values: [monto, cuenta]
                };

                let res1 = await client.query(insertarSQL);
                let res2 = await client.query(actualizarSQL);

                console.log("DEPOSITO REALIZADO CON EXITO");
                console.table(res1.rows);
                console.table(res2.rows);

                await client.query("COMMIT");

            } catch (error) {
                await client.query("ROLLBACK");

                let detalleError = {
                    codigo: error.code,
                    mensaje: error.message,
                    detalle: error.detail,
                    tabla: error.table,
                    columna: error.column,
                    violacion: error.constraint,
                    severidad: error.severity
                }
                console.table(detalleError);
            }
        }
        release();
        pool.end();
    })
}

const girar = (descripcion, fecha, monto, cuenta) => {
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion){
            console.log("Ha ocurrido un error al conectarse a la Base de Datos.", error_conexion)
            release();
        } else {
            try {
                await client.query('BEGIN');

                const insertarSQL = {
                    rowMode: "array",
                    text: "INSERT INTO transacciones(descripcion, fecha, monto, cuenta) VALUES($1, $2, $3, $4) RETURNING *;",
                    values: [descripcion, fecha, monto, cuenta]
                };

                const actualizarSQL = {
                    rowMode: "array",
                    text: "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING *;",
                    values: [monto, cuenta]
                };

                let res1 = await client.query(insertarSQL);
                let res2 = await client.query(actualizarSQL);

                console.log("GIRO REALIZADO CON EXITO");
                console.table(res1.rows);
                console.table(res2.rows);

                await client.query("COMMIT");

            } catch (error) {
                await client.query("ROLLBACK");

                let detalleError = {
                    codigo: error.code,
                    mensaje: error.message,
                    detalle: error.detail,
                    tabla: error.table,
                    columna: error.column,
                    violacion: error.constraint,
                    severidad: error.severity
                }
                console.table(detalleError);
            }
        }
        release();
        pool.end();
    })
}

/* 2. Realizar una función asíncrona que consulte la tabla de transacciones y retorne máximo 10 
registros de una cuenta en específico. Debes usar cursores para esto.*/

const transacciones = (cuenta) => {
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion) {
            console.log("Ha ocurrido un error al conectarse a la Base de Datos.", error_conexion)
            release();
        } else {
            try {
                const consulta = new Cursor(`SELECT * FROM transacciones WHERE cuenta = ${cuenta};`);
                const cursor = client.query(consulta);

                let rows;
                rows = await cursor.read(10);
                console.log(`Consulta de transacciones de la cuenta N°${cuenta} realizada con éxito!`);
                console.table(rows);
                
                cursor.close();

            } catch (error) {
                let detalleError = {
                    codigo: error.code,
                    mensaje: error.message,
                    detalle: error.detail,
                    tabla: error.table,
                    columna: error.column,
                    violacion: error.constraint,
                    severidad: error.severity
                }
                console.table(detalleError);
            }
        }
        release();
        pool.end();
    })
}


/* 3. Realizar una función asíncrona que consulte el saldo de una cuenta y que sea ejecutada con 
valores ingresados como argumentos en la línea de comando. Debes usar cursores para esto. */
const saldo = (cuenta) => {
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion) {
            console.log("Ha ocurrido un error al conectarse a la Base de Datos.", error_conexion)
            release();
        } else {
            try {
                const consulta = new Cursor(`SELECT * FROM cuentas WHERE id = ${cuenta};`);
                const cursor = client.query(consulta);

                let rows;
                rows = await cursor.read(10);
                console.log(`Consulta de Saldo de la cuenta N°${cuenta} realizada con éxito!`);
                console.table(rows);
                
                cursor.close();

            } catch (error) {
                let detalleError = {
                    codigo: error.code,
                    mensaje: error.message,
                    detalle: error.detail,
                    tabla: error.table,
                    columna: error.column,
                    violacion: error.constraint,
                    severidad: error.severity
                }
                console.table(detalleError);
            }
        }
        release();
        pool.end();
    })
}


switch (comando) {
    case 'depositar':
        descripcion = argumentos[1]; 
        fecha = argumentos[2];
        monto = argumentos[3]; 
        cuenta = argumentos[4];
        depositar(descripcion, fecha, monto, cuenta)
    break;

    case 'girar':
        descripcion = argumentos[1]; 
        fecha = argumentos[2];
        monto = argumentos[3]; 
        cuenta = argumentos[4];
        girar(descripcion, fecha, monto, cuenta)
    break;

    case 'consultarTransaccion':
        cuenta = argumentos[1];
        transacciones(cuenta)
    break;
    case 'consultarSaldo':
        cuenta = argumentos[1];
        saldo(cuenta)
    break;

    default:
        console.log("Se ha ingresado una opcion incorrecta!")
    break;
}

/**
 * para ejecutar el programa se debe escribir en la consola alguna de estas opciones
 * > node index.js depositar 'Sueldo mayo' '28-05-2022' 500000 1
 * > node index.js girar 'pago CAE cuota 1' '29-05-2022' 10000 1
 * > node index.js girar 'pago CAE cuota 2' '30-05-2022' 11000 1
 * > node index.js girar 'pago CAE cuota 3' '31-05-2022' 12000 1
 * > node index.js girar 'pago dividendo cuota 1' '03-06-2022' 111000 1
 * > node index.js girar 'pago dividendo cuota 2' '06-06-2022' 112000 1
 * > node index.js girar 'pago dividendo cuota 3' '07-06-2022' 113000 1
 * > node index.js girar 'pago dividendo cuota 4' '08-06-2022' 114000 1
 * > node index.js depositar 'IFE de invierno' '09-06-2022' 60000 1
 * > node index.js girar 'pago CAE cuota 4' '10-06-2022' 13000 1
 * > node index.js girar 'pago CAE cuota 5' '11-06-2022' 14000 1
 * > node index.js girar 'pago CAE cuota 6' '12-06-2022' 15000 1
 * > node index.js girar 'pago prestamo personal cuota 1' '13-06-2022' 40000 1
 * 
 * Si ejecuto un nuevo pago, deberia saltar un error indicando que el monto que queda no es suficiente.
 * > node index.js girar 'pago prestamo personal cuota 2' '14-06-2022' 40000 1
 * 
 * > node index.js consultarTransaccion 1
 * 
 * > node index.js consultarSaldo 1
 */