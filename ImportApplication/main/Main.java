package main;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class Main {
	
	public static void main(String[] args) {
		String SampleURL = "jdbc:sqlserver://${dbServer};databaseName=${dbName};user=${user};"
				+ "password={${pass}}";
		String databaseName = "PetCareFinalDemo";
		String serverName = "titan.csse.rose-hulman.edu";
		String username = "PetCareAdmin";
		String password = "DogCatFish";
		String finalUrl = SampleURL
				.replace("${dbServer}", serverName)
				.replace("${dbName}", databaseName)
				.replace("${user}", username)
				.replace("${pass}", password);

		DBConnection connection = new DBConnection(finalUrl);
		connection.connect();
		connection.populate();


	}
}