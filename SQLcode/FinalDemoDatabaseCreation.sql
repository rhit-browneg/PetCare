USE [master]
GO
--Creates Database
CREATE DATABASE PetCareFinalDemo
ON
PRIMARY ( NAME = 'PetCareFinalDemo',
FILENAME = 'D:\Database\MSSQL15.MSSQLSERVER\MSSQL\DATA\PetCareFinalDemo.mdf',
SIZE = 8MB,
MAXSIZE = 30MB,
FILEGROWTH = 15%
)
LOG ON(
NAME = 'PetCareFinalDemo_log', FILENAME = 'D:\Database\MSSQL15.MSSQLSERVER\MSSQL\DATA\PetCareFinalDemo.ldf',
SIZE = 5MB,
MAXSIZE = 22MB,
FILEGROWTH = 15%)
GO
USE [PetCareFinalDemo]
GO
--Create table user
CREATE TABLE [User](
username nvarchar(50) NOT NULL PRIMARY KEY,
pwordsalt varchar(50) NOT NULL,
pwordhash varchar(50) NOT NULL
)