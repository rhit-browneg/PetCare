package main;

import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Base64;
import java.util.Random;

public class DBConnection {
	private Connection connection;
	private String URL;
	private static final Random RANDOM = new SecureRandom();
	private static final Base64.Encoder enc = Base64.getEncoder();
	private static final Base64.Decoder dec = Base64.getDecoder();
	
	public DBConnection(String URL) {
		this.URL = URL;
	}
	
	public void connect() {
		try {
			connection = DriverManager.getConnection(URL);
			System.out.println("Connected to DB");
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	public void populate() {
		ImportPetsAndOwners PO = new ImportPetsAndOwners(this.connection);
		PO.parseCSV();
		ImportNeeds NE = new ImportNeeds(this.connection);
		NE.parseCSV();
		ImportExercise foods = new ImportExercise(this.connection);
		foods.parseCSV();
		try {
			connection.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
