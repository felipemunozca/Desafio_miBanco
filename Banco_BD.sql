PGDMP                            z            Banco    13.6    13.6     ?           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ?           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ?           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ?           1262    41318    Banco    DATABASE     c   CREATE DATABASE "Banco" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "Banco";
                felipe    false            ?            1259    41351    cuentas    TABLE     ?   CREATE TABLE public.cuentas (
    id integer,
    saldo numeric,
    CONSTRAINT cuentas_saldo_check CHECK ((saldo >= (0)::numeric))
);
    DROP TABLE public.cuentas;
       public         heap    postgres    false            ?            1259    41345    transacciones    TABLE     ?   CREATE TABLE public.transacciones (
    descripcion character varying(50),
    fecha character varying(10),
    monto numeric,
    cuenta integer
);
 !   DROP TABLE public.transacciones;
       public         heap    postgres    false            ?          0    41351    cuentas 
   TABLE DATA           ,   COPY public.cuentas (id, saldo) FROM stdin;
    public          postgres    false    201          ?          0    41345    transacciones 
   TABLE DATA           J   COPY public.transacciones (descripcion, fecha, monto, cuenta) FROM stdin;
    public          postgres    false    200   -       ?      \.


      ?      \.


     