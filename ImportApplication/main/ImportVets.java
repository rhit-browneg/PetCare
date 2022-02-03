package main;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;

import javax.swing.JOptionPane;

public class ImportVets {
	private Connection connection;
	private String URL;
	public ImportVets(String URL) {
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
		BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\browneg\\OneDrive - Rose-Hulman Institute of Technology\\Desktop\\vetdata.csv"));  
		while ((line = br.readLine()) != null)   //returns a Boolean value  
		{  
		String[] vet = line.split(splitBy);    // use comma as separator  
		if (x > 0) {
			addVet(vet[0], vet[1], vet[2]);
		}
		x++;
		}  
		}   
		catch (IOException e)   
		{  
		e.printStackTrace();  
		}  
		
	}
	
	private void addVet(String name, String address, String number) {
		System.out.println(name + " " + address + " " + number);
		try {
			CallableStatement stmt = connection.prepareCall("{? = call add_vet(?,?,?)}");
			stmt.setString(2, name);
			stmt.setString(3, number);
			stmt.setString(4, address);
			stmt.registerOutParameter(1, Types.INTEGER);
			stmt.execute();
			int returnValue = stmt.getInt(1);
			if (returnValue == 1 || returnValue == 2 || returnValue == 3) {
				System.out.println("Value cannot be null or empty");
			}
			if (returnValue == 4) {
				System.out.println("Vet name already exists");
			}

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("failed to add vet");;
			e.printStackTrace();
		}
	}

}
