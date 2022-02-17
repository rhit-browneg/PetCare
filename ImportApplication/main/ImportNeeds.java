package main;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.SecureRandom;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Base64;
import java.util.Random;
public class ImportNeeds {
	private Connection connection;
	private String URL;
	private static final Random RANDOM = new SecureRandom();
	private static final Base64.Encoder enc = Base64.getEncoder();
	private static final Base64.Decoder dec = Base64.getDecoder();
	
	public ImportNeeds(String URL) {
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
	public void parseCSV() {
		String line = "";  
		String splitBy = ",";  
		try   
		{  
		//parsing a CSV file into BufferedReader class constructor  
		int x = 0;
		BufferedReader br = new BufferedReader(new FileReader("")); //TODO:File directory needed 
		while ((line = br.readLine()) != null)   //returns a Boolean value  
		{  
		String[] info = line.split(splitBy);    // use comma as separator  
		if (x > 0) {
			addFood(info[0], info[1]);
			addGoodFor(info[2], info[3]);
			addExercise(info[4],info[5]); //TODO: Update arguments
			addNeeds(info[6],info[7],info[8]);
		}
		x++;
		}  
		}   
		catch (IOException e)   
		{  
		e.printStackTrace();  
		}  
	}
	private void addNeeds(String ExerciseID, String SpeciesID, String Frequency) {
		CallableStatement stmt;
		try {
			stmt = connection.prepareCall("{? = call add_needs(?,?,?)}");
			stmt.setString(2, ExerciseID);
			stmt.setString(3, SpeciesID);
			stmt.setString(4, Frequency);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue != 0) {
				System.out.println("failed to add needs");
			}
			
		} catch (SQLException e) {
			System.out.println("failed to add needs");
			e.printStackTrace();
		}
		
	}
	private void addExercise(String type, String description) {
		CallableStatement stmt;
		try {
			stmt = connection.prepareCall("{? = call add_exercise(?,?)}");
			stmt.setString(2,type );
			stmt.setString(3, description);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue != 0) {
				System.out.println("failed to add exercise");
			}
		} catch (SQLException e) {
			System.out.println("failed to add exercise");
			e.printStackTrace();
		}
		
		
	}
	private void addGoodFor(String FoodID, String SpeciesID) {
		CallableStatement stmt;
		try {
			stmt = connection.prepareCall("{? = call add_good_for(?,?)}");
			stmt.setString(2,FoodID );
			stmt.setString(3, SpeciesID);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue != 0) {
				System.out.println("failed to add Good_for");
			}
		} catch (SQLException e) {
			System.out.println("failed to add Good_for");
			e.printStackTrace();
		}
		
	}
	public void addFood(String FName, String Price) {
		CallableStatement stmt;
		try {
			stmt = connection.prepareCall("{? = call add_food(?,?)}");
			stmt.setString(2, FName);
			stmt.setString(3, Price);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue != 0) {
				System.out.println("failed to add food");
			}
		} catch (SQLException e) {
			System.out.println("failed to add food");
			e.printStackTrace();
		}
		
	}
}
