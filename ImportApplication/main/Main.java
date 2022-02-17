package main;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class Main {
	
	private String databaseName = "PetCare";
	private String serverName = "titan.csse.rose-hulman.edu";
	private String username = "PetCareAdmin";
	private String password = "DogCatFish";
	
	public static void main(String[] args) {
		String SampleURL = "jdbc:sqlserver://${dbServer};databaseName=${dbName};user=${user};"
				+ "password={${pass}}";
		String databaseName = "PetCare";
		String serverName = "titan.csse.rose-hulman.edu";
		String username = "browneg";
		String password = "Crachiolo1@";
		String finalUrl = SampleURL
				.replace("${dbServer}", serverName)
				.replace("${dbName}", databaseName)
				.replace("${user}", username)
				.replace("${pass}", password);
//		ImportVets IV = new ImportVets(finalUrl);
//		IV.connect();
//		IV.parseCSV();
		ImportPetsAndOwners PO = new ImportPetsAndOwners(finalUrl);
		PO.connect();
		PO.parseCSV();
		ImportNeeds NE = new ImportNeeds(finalUrl);
		NE.connect();
		NE.parseCSV();

	}
}