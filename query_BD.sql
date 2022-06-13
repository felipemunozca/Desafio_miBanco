CREATE TABLE transacciones (
	descripcion varchar(50), 
	fecha varchar(10), 
	monto DECIMAL, cuenta INT
);

CREATE TABLE cuentas (
	id INT, 
	saldo DECIMAL CHECK (saldo >= 0) 
);

SELECT * FROM transacciones;

SELECT * FROM cuentas;

INSERT INTO cuentas values (1, 20000);
INSERT INTO cuentas values (2, 30000);
INSERT INTO cuentas values (3, 40000);