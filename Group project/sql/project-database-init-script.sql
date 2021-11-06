/*
 * Upon submission, this file should contain the SQL script to initialize your database.
 * It should contain all DROP TABLE and CREATE TABLE statments, and any INSERT statements
 * required.
 */
DROP TABLE if EXISTS comment_votes;
DROP TABLE if EXISTS Comments;
DROP TABLE if EXISTS Articles;
DROP TABLE if EXISTS Users;


CREATE TABLE Users(
	id INTEGER NOT NULL PRIMARY KEY,
	fname varchar(20) NOT NULL,
	lname varchar(20) NOT NULL,
	DOB date NOT NULL,
	username varchar(20) UNIQUE NOT NULL,
	description varchar NOT NULL,
	avatar_image varchar NOT NULL,
	hashPassword varchar(64),
	saltRounds INTEGER NOT NULL,
	authToken varchar(64),
	isAdmin varchar NOT NULL
	);
	
 CREATE TABLE Articles(
	id INTEGER NOT NULL PRIMARY KEY,
	title varchar,
	content varchar NOT NULL,
	articleImageUrl varchar,
	publishTime timestamp NOT NULL,
	userID INTEGER NOT NULL,
	authorName varchar,
	FOREIGN KEY (userID) REFERENCES Users(id)
 );
 
 CREATE TABLE Comments(
	id INTEGER NOT NULL PRIMARY KEY,
	texts varchar NOT NULL,
	likes INTEGER DEFAULT 0,
	dislikes INTEGER DEFAULT 0,
	commentTime timestamp NOT NULL,
	articleID INTEGER NOT NULL,
	commentPosterID INTEGER NOT NULL,
	commenterName varchar,
	parentCommentID INTEGER DEFAULT 0,
	FOREIGN KEY (commentPosterID) REFERENCES Users(id),
	FOREIGN KEY (articleID) REFERENCES Articles(id)
 );

 CREATE TABLE comment_votes(
	id INTEGER NOT NULL PRIMARY KEY,
	comment_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	is_up INTEGER
 );
 
