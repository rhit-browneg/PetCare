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
ownerusername nvarchar(50) NOT NULL,
breed nvarchar(50) NOT NULL,
gender nvarchar(50) NOT NULL,
Age AS (datediff(year,[DOB],getdate())),
FOREIGN KEY (ownerusername) REFERENCES [User](username)
ON UPDATE CASCADE
ON DELETE CASCADE,
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
@type varchar(30),
@sex nvarchar(50),
@breed nvarchar(50),
@dob date,
@ownerusernme nvarchar(50)
)
AS
DECLARE @speciesID AS int


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

if @ownerusernme is null or @ownerusernme = '' 
BEGIN
	Print 'Owner cannot be null or empty.';
	RETURN (7)
END 
SELECT @speciesID = ID FROM Species WHERE Type = @type


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
(DOB, Name, SpeciesPart_of, ownerusername, breed, gender)
values (@dob, @petName, @speciesID, @ownerusernme, @breed, @sex)
RETURN 0
GO
GRANT EXECUTE ON add_pet TO PetCareAdmin
GO 
--Create Procedure check password
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
RETURN 0
GO
GRANT EXECUTE ON check_passwords TO PetCareAdmin
GO
--Create Proc delete_pet
CREATE PROC [dbo].[delete_pet]
@petName varchar(25),
@ownerusernme nvarchar(50)
AS
DECLARE @petID AS int
if @petName is null or @petName = '' 
BEGIN
	Print 'Pet name cannot be null or empty.';
	RETURN (1)
END 
if @ownerusernme is null or @ownerusernme = '' 
BEGIN
	Print 'Owner cannot be null or empty.';
	RETURN (7)
END 

SELECT @petID = ID 
FROM Pet 
WHERE Name = @petName AND ownerusername = @ownerusernme

IF (@petID) IS NULL
BEGIN
	PRINT 'Pet does not exist'
	RETURN 9
END

DELETE FROM Pet WHERE ID = @petID;
RETURN 0
GO
GRANT EXECUTE ON delete_pet TO PetCareAdmin
GO
--Create Procedure delete_user
CREATE PROCEDURE [dbo].[delete_user]
(
@username nvarchar(50)
)
AS
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
DELETE FROM [User] WHERE username = @username
RETURN 0
GO 
GRANT EXECUTE ON delete_user TO PetCareAdmin
GO 
CREATE PROCEDURE [dbo].[edit_password]
(
@username nvarchar(50),
@salt varchar(50),
@hash varchar(50)
)
AS
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
IF @hash is null or @hash = '' 
BEGIN
	Print 'Password cannot be null or empty.';
	RETURN (1)
END 
UPDATE [User] SET pwordsalt=@salt,pwordhash=@hash WHERE username= @username
RETURN (0)
GO
GRANT EXECUTE ON edit_password TO PetCareAdmin
GO
--Create Procedure edit_pet
CREATE PROCEDURE [dbo].[edit_pet] 
(
@name varchar(25),
@type varchar(30),
@sex nvarchar(50),
@breed nvarchar(50),
@dob date,
@ownerusernme nvarchar(50)
)
AS
DECLARE @speciesID AS int
DECLARE @petID AS int

if @name is null or @name = '' 
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


if @ownerusernme is null or @ownerusernme = '' 
BEGIN
	Print 'Owner cannot be null or empty.';
	RETURN (7)
END 

SELECT @speciesID = ID FROM Species WHERE Type = @type
SELECT @petID = ID FROM Pet WHERE ownerusername = @ownerusernme AND [Name] = @name

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
SET DOB = @dob, Name = @name, SpeciesPart_of = @speciesID, breed = @breed, gender=@sex
WHERE ownerusername = @ownerusernme AND ID = @petID
RETURN (0)
GO
GRANT EXECUTE ON edit_pet TO PetCareAdmin
GO
--Create Procedure edit_user
CREATE PROCEDURE [dbo].[edit_user]
(
@currentUsername nvarchar(50),
@FName varchar(25),
@LName varchar(25),
@Address nvarchar(50),
@PhoneNumber varchar(12)
)
AS
IF @currentUsername is null or @currentUsername = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
IF @FName is null or @FName = '' 
BEGIN
	SET @FName = (SELECT FName FROM PetOwner WHERE Username = @currentUsername);
END 
IF @LName is null or @LName = '' 
BEGIN
	SET @LName = (SELECT LName FROM PetOwner WHERE Username = @currentUsername);
END 
IF @Address is null or @Address = '' 
BEGIN
	SET @Address = (SELECT [Address] FROM PetOwner WHERE Username = @currentUsername);
END 
IF @PhoneNumber is null or @PhoneNumber = '' 
BEGIN
	SET @PhoneNumber = (SELECT PhoneNumber FROM PetOwner WHERE Username = @currentUsername);
END 
UPDATE PetOwner SET FName = @FName, LName = @LName, [Address] = @Address, PhoneNumber = @PhoneNumber WHERE Username = @Currentusername
RETURN (0)
GO
GRANT EXECUTE ON edit_user TO PetCareAdmin
GO
--Create procedure get_pet_exercise
CREATE PROCEDURE [dbo].[get_pet_exercise]
(
@username nvarchar(50),
@name varchar(25)
)
AS
DECLARE @speciesID AS int
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
IF @name is null or @name = '' 
BEGIN
	Print 'Pet name cannot be null or empty.';
	RETURN (1)
END 
SELECT @speciesID = Species.ID 
FROM Species
JOIN Pet ON Pet.SpeciesPart_of = Species.ID
WHERE ownerusername = @username AND Pet.[Name] = @name

SELECT Exercise.Type, Exercise.Description, Needs.Frequency
FROM Species
JOIN Needs ON Needs.SpeciesID = Species.ID
JOIN Exercise ON Exercise.ID = Needs.ExerciseID
WHERE Species.ID = @speciesID
RETURN (0)
GO 
GRANT EXECUTE ON get_pet_exercise TO PetCareAdmin
GO
--Create Procedure get_pet_info
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
SELECT Pet.Name, Age, breed, gender, Species.Type AS 'Species'
FROM Pet
JOIN Species ON Species.ID = Pet.SpeciesPart_of
WHERE ownerusername = @username
RETURN (0)
GO
GRANT EXECUTE ON get_pet_info TO PetCareAdmin
GO 
-- Create Procedure get_pet_info_dob
CREATE PROCEDURE [dbo].[get_pet_info_dob]
(
@username nvarchar(50)
)
AS
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
SELECT Pet.Name, DOB, breed, gender, Species.Type AS 'Species'
FROM Pet
JOIN Species ON Species.ID = Pet.SpeciesPart_of
WHERE ownerusername = @username
RETURN (0)
GO
GRANT EXECUTE ON get_pet_info_dob TO PetCareAdmin
GO 
--Create Procedure get_pet_needs
CREATE PROCEDURE [dbo].[get_pet_needs]
(
@username nvarchar(50),
@name varchar(25)
)
AS
DECLARE @speciesID AS int
IF @username is null or @username = '' 
BEGIN
	Print 'Username cannot be null or empty.';
	RETURN (1)
END 
IF @name is null or @name = '' 
BEGIN
	Print 'Pet name cannot be null or empty.';
	RETURN (1)
END 
SELECT @speciesID = Species.ID 
FROM Species
JOIN Pet ON Pet.SpeciesPart_of = Species.ID
WHERE ownerusername = @username AND Pet.[Name] = @name

SELECT Food.[Name] AS 'Food', Food.Price
FROM Species
JOIN Good_For ON Good_For.SpeciesID = Species.ID
JOIN Food ON Food.ID = Good_For.FoodID
WHERE Species.ID = @speciesID
RETURN (0)
GO
GRANT EXECUTE ON get_pet_needs TO PetCareAdmin
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
RETURN (0)
GO
GRANT EXECUTE ON get_user_info TO PetCareAdmin
GO
--Create Procedure register
CREATE PROCEDURE [dbo].[register]
(
@Username nvarchar(50),
@PasswordSalt varchar(50),
@PasswordHash varchar(50),
@fname varchar(25),
@lname varchar(25),
@address nvarchar(50),
@number varchar(12)
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
RETURN (0)
GO
GRANT EXECUTE ON register TO PetCareAdmin
GO
CREATE PROC [dbo].[add_exercise_for_species]
(@Type varchar(25),
@Description text,
@Frequency varchar(50),
@speciesname varchar(30))
AS
DECLARE @speciesID AS int
DECLARE @exerciseID AS int
IF(@Type is null or @Type = '') 
BEGIN
	Print 'Type name cannot be null or empty.';
	RETURN (1)
END 
IF @Frequency is null 
BEGIN
	Print 'Frequency cannot be null or empty.';
	RETURN (2)
END 
IF @speciesname is null 
BEGIN
	Print 'Species cannot be null or empty.';
	RETURN (3)
END 

SELECT @speciesID = Species.ID
FROM Species
WHERE Species.Type = @speciesname

IF (@speciesID is null) 
BEGIN
	Print 'Species does not exist.';
	RETURN (4)
END

INSERT INTO Exercise(Type,Description) 
Values (@Type,@Description)

SELECT @exerciseID = @@IDENTITY

INSERT INTO Needs (ExerciseID, SpeciesID, Frequency)
values (@exerciseID, @speciesID, @Frequency)
GO
GRANT EXECUTE ON [add_exercise_for_species] TO PetCareAdmin

GO
CREATE PROC [dbo].[add_food_for_species]
(@price money,
@name varchar(25),
@speciesname varchar(30))
AS
DECLARE @speciesID AS int
DECLARE @foodID AS int
IF(@Price is null or @Price = '') 
BEGIN
	Print 'Price cannot be null or empty.';
	RETURN (1)
END 
IF @name is null 
BEGIN
	Print 'Frequency cannot be null or empty.';
	RETURN (2)
END 
IF @speciesname is null 
BEGIN
	Print 'Species cannot be null or empty.';
	RETURN (3)
END 

SELECT @speciesID = Species.ID
FROM Species
WHERE Species.Type = @speciesname

IF (@speciesID is null) 
BEGIN
	Print 'Species does not exist.';
	RETURN (4)
END

INSERT INTO Food(Price,[Name]) 
Values (@price,@name)

SELECT @foodID = @@IDENTITY

INSERT INTO Good_For(FoodID, SpeciesID)
values (@foodID, @speciesID)
GO
GRANT EXECUTE ON [add_food_for_species] TO PetCareAdmin