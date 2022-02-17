package main;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class Main {
	
	public static void main(String[] args) {
		String SampleURL = "jdbc:sqlserver://${dbServer};databaseName=${dbName};user=${user};"
				+ "password={${pass}}";
		String databaseName = "PetCare";
		String serverName = "titan.csse.rose-hulman.edu";
		String username = "";
		String password = "";
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