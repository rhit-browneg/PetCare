package main;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;



public class ImportPetsAndOwners {
	private Connection connection;
	
	public ImportPetsAndOwners(Connection con) {
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
		BufferedReader br = new BufferedReader(new FileReader(currentPath + "\\main\\ownerdata.csv"));  
		while ((line = br.readLine()) != null)   //returns a Boolean value  
		{  
		String[] info = line.split(splitBy);    // use comma as separator  
		if (x > 0) {
			Register(info[9], info[10], info[0], info[1], info[2], info[3]);
			addPet(info[4], info[5], info[6], info[7], info[8], info[0]);
		}
		x++;
		}  
		}   
		catch (IOException e)   
		{  
		e.printStackTrace();  
		}  
	}
	
	public void addPet (String name, String type, String sex, String breed,
		String dob, String username) {
		try {
			CallableStatement stmt = connection.prepareCall("{? = call add_pet(?,?,?,?,?,?)}");
			stmt.setString(2, name);
			stmt.setString(3, type);
			stmt.setString(4, sex);
			stmt.setString(5, breed);
			stmt.setString(6, dob);
			stmt.setString(7, username);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue != 0) {
				System.out.println("failed to add pet");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("failed to add pet");
			e.printStackTrace();
		}
	}
	public void Register (String salt, String hash, String fname, String lname, String address, String num) {
		try {
			CallableStatement stmt = connection.prepareCall("{? = call register(?,?,?,?,?,?,?)}");
			stmt.setString(2, fname);
			stmt.setString(3, salt);
			stmt.setString(4, hash);
			stmt.setString(5, fname);
			stmt.setString(6, lname);
			stmt.setString(7, address);
			stmt.setString(8, num);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue != 0) {
				System.out.println("failed to register user");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("failed to register user");
			e.printStackTrace();
		}
	}
	
}
