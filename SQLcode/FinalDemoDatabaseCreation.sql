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
CREATE USER PetCareAdmin FROM LOGIN PetCareAdmin; 
exec sp_addrolemember 'db_owner', 'PetCareAdmin'; 
GO
CREATE TABLE [User](
username nvarchar(50) NOT NULL PRIMARY KEY,
pwordsalt varchar(50) NOT NULL,
pwordhash varchar(50) NOT NULL
)
GO
--Create PetOwner table
CREATE TABLE PetOwner(
FName varchar(25) NOT NULL,
PhoneNumber varchar(12) NOT NULL,
[Address] nvarchar(50) NOT NULL,
LName varchar(25) NOT NULL,
Username nvarchar(50) NOT NULL PRIMARY KEY,
FOREIGN KEY (Username) REFERENCES [User](username)
ON UPDATE CASCADE
ON DELETE CASCADE,
)
GO 
--Create Vet table
CREATE TABLE Vet(
ID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
[Name] varchar(25) NOT NULL,
[PhoneNumber] int NOT NULL,
[Address] varchar(50) NOT NULL)
GO
--Create Species table
CREATE TABLE Species(
ID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
[Type] varchar(30) NOT NULL)
GO
--Create Pet table
CREATE TABLE Pet(
ID int IDENTITY (1,1) NOT NULL PRIMARY KEY,
DOB date NOT NULL,
[Name] varchar(25) NOT NULL,
SpeciesPart_of int NOT NULL,
VetID int NOT NULL,
ownerusername nvarchar(50) NOT NULL,
breed nvarchar(50) NOT NULL,
gender nvarchar(50) NOT NULL,
Age AS (datediff(year,[DOB],getdate())),
FOREIGN KEY (ownerusername) REFERENCES [User](username)
ON UPDATE CASCADE
ON DELETE CASCADE,
FOREIGN KEY (VetID) REFERENCES Vet(ID)
ON UPDATE CASCADE,
FOREIGN KEY (SpeciesPart_of) REFERENCES Species(ID)
ON UPDATE CASCADE)
GO
--Create Food table
CREATE TABLE Food(
ID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
Price money NOT NULL,
Name varchar(25) NOT NULL)
GO 
--Create Exercise table
CREATE TABLE Exercise(
ID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
[Type] varchar(25) NOT NULL,
[Description] text NOT NULL)
GO
--Create Needs table
CREATE TABLE Needs(
ExerciseID int NOT NULL,
SpeciesID int NOT NULL,
Frequency varchar(50) NULL,
FOREIGN KEY (ExerciseID) REFERENCES Exercise(ID)
ON UPDATE CASCADE,
FOREIGN KEY (SpeciesID) REFERENCES Species(ID)
ON UPDATE CASCADE
ON DELETE CASCADE,
PRIMARY KEY (ExerciseID, SpeciesID))
GO
--Create Good_For table
CREATE TABLE Good_For(
FoodID int NOT NULL,
SpeciesID int NOT NULL,
FOREIGN KEY (FoodID) REFERENCES Food(ID)
ON UPDATE CASCADE,
FOREIGN KEY (SpeciesID) REFERENCES Species(ID)
ON UPDATE CASCADE
ON DELETE CASCADE,
PRIMARY KEY (FoodID, SpeciesID))
GO
--Create Procedure add_pet
CREATE PROCEDURE [dbo].[add_pet] 
(
@petName varchar(25),
@type varchar(25),
@sex varchar(25),
@breed varchar(25),
@dob datetime,
@clinicName varchar(25),
@ownerusernme varchar(25)
)
AS
DECLARE @speciesID AS int
DECLARE @vetID AS int

if @petName is null or @petName = '' 
BEGIN
	Print 'Pet name cannot be null or empty.';
	RETURN (1)
END 

if @type is null or @type = '' 
BEGIN
	Print 'Species cannot be null or empty.';
	RETURN (2)
END 

if @sex is null or @sex = '' 
BEGIN
	Print 'Sex cannot be null or empty.';
	RETURN (3)
END 

if @breed is null or @breed = '' 
BEGIN
	Print 'Breed cannot be null or empty.';
	RETURN (4)
END 

if @dob is null or @dob = '' 
BEGIN
	Print 'DOB cannot be null or empty.';
	RETURN (5)
END 

if @clinicName is null or @clinicName = '' 
BEGIN
	Print 'Clinic name cannot be null or empty.';
	RETURN (6)
END 

if @ownerusernme is null or @ownerusernme = '' 
BEGIN
	Print 'Owner cannot be null or empty.';
	RETURN (7)
END 

SELECT @vetID = ID FROM Vet WHERE Name = @clinicName
SELECT @speciesID = ID FROM Species WHERE Type = @type

IF (@vetID) IS NULL
BEGIN
	PRINT 'Vet does not exist'
	RETURN 8
END


IF (@speciesID) IS NULL
BEGIN
	PRINT 'Species does not exist, adding it to Species table'
	INSERT INTO Species 
	(Type)
	values(@type)
	SELECT @speciesID = @@IDENTITY
END

IF (SELECT count(Username) FROM PetOwner WHERE Username = @ownerusernme) = 0
BEGIN
	PRINT 'User does not exist'
	RETURN 9
END

INSERT INTO Pet
(DOB, Name, SpeciesPart_of, VetID, ownerusername, breed, gender)
values (@dob, @petName, @speciesID, @vetID, @ownerusernme, @breed, @sex)
GO
GRANT EXECUTE ON add_pet TO PetCareAdmin
GO 
--Create Procedure add_vet
CREATE PROCEDURE [dbo].[add_vet] (
@name varchar(25),
@phone [int],
@addr varchar(50)
)
AS
if @name is null or @name = '' 
BEGIN
	Print 'Vet name cannot be null or empty.';
	RETURN (1)
END 

if @phone is null or @phone = '' 
BEGIN
	Print 'Phone number cannot be null or empty.';
	RETURN (2)
END 

if @addr is null or @addr = '' 
BEGIN
	Print 'Address cannot be null or empty.';
	RETURN (3)
END 

IF (SELECT Count(Name) from Vet WHERE Name = @name) != 0
BEGIN
	PRINT 'The vet ' + @name + ' already exists.'
	RETURN 4
END
INSERT INTO Vet
(Name, PhoneNumber, Address)
Values(@name, @phone, @addr)
GO
GRANT EXECUTE ON add_vet TO PetCareAdmin
GO
--Create Procedure check_passwords
CREATE PROCEDURE [dbo].[check_passwords]
(
@username nvarchar(50)
)
AS

if @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
SELECT pwordsalt, pwordhash
FROM [User]
WHERE username = @username
GO
GRANT EXECUTE ON check_passwords TO PetCareAdmin
GO
--Create Proc delete_pet
CREATE PROC [dbo].[delete_pet]
@petName varchar(25),
@dob datetime,
@ownerusernme varchar(25)

AS

DECLARE @petID AS int

if @petName is null or @petName = '' 
BEGIN
	Print 'Pet name cannot be null or empty.';
	RETURN (1)
END 

if @dob is null or @dob = '' 
BEGIN
	Print 'DOB cannot be null or empty.';
	RETURN (5)
END 

if @ownerusernme is null or @ownerusernme = '' 
BEGIN
	Print 'Owner cannot be null or empty.';
	RETURN (7)
END 

SELECT @petID = ID 
FROM Pet 
WHERE Name = @petName AND DOB = @dob AND ownerusername = @ownerusernme

IF (@petID) IS NULL
BEGIN
	PRINT 'Pet does not exist'
	RETURN 9
END

DELETE FROM Pet WHERE ID = @petID;
GO
GRANT EXECUTE ON delete_pet TO PetCareAdmin
GO
--Create procedure edit_pet
CREATE PROCEDURE [dbo].[edit_pet] 
(
@petName varchar(25),
@type varchar(25),
@sex varchar(25),
@breed varchar(25),
@dob datetime,
@clinicName varchar(25),
@ownerusernme varchar(25),
@petID int
)
AS
DECLARE @speciesID AS int
DECLARE @vetID AS int

if @petName is null or @petName = '' 
BEGIN
	Print 'Pet name cannot be null or empty.';
	RETURN (1)
END 

if @type is null or @type = '' 
BEGIN
	Print 'Species cannot be null or empty.';
	RETURN (2)
END 

if @sex is null or @sex = '' 
BEGIN
	Print 'Sex cannot be null or empty.';
	RETURN (3)
END 

if @breed is null or @breed = '' 
BEGIN
	Print 'Breed cannot be null or empty.';
	RETURN (4)
END 

if @dob is null or @dob = '' 
BEGIN
	Print 'DOB cannot be null or empty.';
	RETURN (5)
END 

if @clinicName is null or @clinicName = '' 
BEGIN
	Print 'Clinic name cannot be null or empty.';
	RETURN (6)
END 

if @ownerusernme is null or @ownerusernme = '' 
BEGIN
	Print 'Owner cannot be null or empty.';
	RETURN (7)
END 

SELECT @vetID = ID FROM Vet WHERE Name = @clinicName
SELECT @speciesID = ID FROM Species WHERE Type = @type

IF (@vetID) IS NULL
BEGIN
	PRINT 'Vet does not exist'
	RETURN 8
END
IF (SELECT count(Username) FROM PetOwner WHERE Username = @ownerusernme) = 0
BEGIN
	PRINT 'User does not exist'
	RETURN 9
END
IF(SELECT ownerusername FROM Pet WHERE ID = @petID)!= @ownerusernme
BEGIN 
   PRINT 'User does not have permission to edit'
   RETURN 10
END
IF (@speciesID) IS NULL
BEGIN
	PRINT 'Species does not exist, adding it to Species table'
	INSERT INTO Species 
	(Type)
	values(@type)
	SELECT @speciesID = @@IDENTITY
END



UPDATE Pet 
SET DOB = @dob, Name = @petName, SpeciesPart_of = @speciesID, VetID = @vetID, breed = @breed, gender=@sex
WHERE ownerusername = @ownerusernme AND ID = @petID
GO
GRANT EXECUTE ON edit_pet TO PetCareAdmin
GO
--Create procedure get_pet_info
CREATE PROCEDURE [dbo].[get_pet_info]
(
@username nvarchar(50)
)
AS
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
SELECT Pet.Name, DOB, breed, gender, Species.Type AS 'Species', Vet.Name AS 'Vet Clinic'
FROM Pet
JOIN Species ON Species.ID = Pet.SpeciesPart_of
JOIN Vet ON Vet.ID = Pet.VetID
WHERE ownerusername = @username
GO
GRANT EXECUTE ON get_pet_info TO PetCareAdmin
GO
--Create Procedure get_user_info
CREATE PROCEDURE [dbo].[get_user_info]
(
@username nvarchar(50)
)
AS
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
SELECT *
FROM PetOwner
WHERE username = @username
GO
GRANT EXECUTE ON get_user_info TO PetCareAdmin
GO
--Create Procdure register
CREATE PROCEDURE [dbo].[register]
(
@Username nvarchar(50),
@PasswordSalt varchar(50),
@PasswordHash varchar(50),
@fname varchar(50),
@lname varchar(50),
@address varchar(50),
@number int
)
AS
if @Username is null or @Username = '' 
	BEGIN
		Print 'Username cannot be null or empty.';
		RETURN (1)
	END 
	if @PasswordSalt is null or @PasswordSalt = '' 
	BEGIN
		Print 'PasswordSalt cannot be null or empty.';
		RETURN (2)
	END 
	if @PasswordHash is null or @PasswordHash = '' 
	BEGIN
		Print 'PasswordHash cannot be null or empty.';
		RETURN (3)
	END 
	if @fname is null or @fname = '' 
	BEGIN
		Print 'Name cannot be null or empty.';
		RETURN (4)
	END 
		if @lname is null or @lname = '' 
	BEGIN
		Print 'Name cannot be null or empty.';
		RETURN (5)
	END 
		if @address is null or @address = '' 
	BEGIN
		Print 'Address cannot be null or empty.';
		RETURN (6)
	END 
		if @number is null or @number = '' 
	BEGIN
		Print 'Phone number cannot be null or empty.';
		RETURN (7)
	END 
	IF (SELECT COUNT(*) FROM [User]
          WHERE Username = @Username) = 1
	BEGIN
      PRINT 'ERROR: Username already exists.';
	  RETURN(8)
	END

INSERT INTO [User]
(username, pwordsalt, pwordhash)
values(@Username, @PasswordSalt, @PasswordHash)

INSERT INTO [PetOwner]
(FName, LName, PhoneNumber, Address, Username)
values(@fname, @lname, @number, @address, @Username)
GO
GRANT EXECUTE ON register TO PetCareAdmin
