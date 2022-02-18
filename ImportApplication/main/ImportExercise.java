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
public class ImportExercise {
	private Connection connection;
	
	public ImportExercise(Connection con) {
		this.connection = con;
	}

	public void parseCSV() {
		String line = "";  
		String splitBy = ",";  
		try   
		{  
		//parsing a CSV file into BufferedReader class constructor  
		int x = 0;
		String currentPath = new java.io.File(".").getCanonicalPath();
		BufferedReader br = new BufferedReader(new FileReader(currentPath + "\\main\\needs.csv"));  
		while ((line = br.readLine()) != null)   //returns a Boolean value  
		{  
		String[] info = line.split(splitBy);    // use comma as separator  
		if (x > 0) {
			addExercise(info[1],info[2], info[3], info[0]);
		}
		x++;
		}  
		}   
		catch (IOException e)   
		{  
		e.printStackTrace();  
		}  
	}

	private void addExercise(String type, String description, String frequency, String species) {
		CallableStatement stmt;
		try {
			stmt = connection.prepareCall("{? = call add_exercise_for_species(?,?,?,?)}");
			stmt.setString(2,type );
			if (description.isBlank()) stmt.setString(3, null);
			else stmt.setString(3, description);
			
			stmt.setString(4, frequency);
			stmt.setString(5, species);
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
}
