package main;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Base64;
import java.util.Random;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.swing.JOptionPane;

public class ImportPetsAndOwners {
	private Connection connection;
	private String URL;
	private static final Random RANDOM = new SecureRandom();
	private static final Base64.Encoder enc = Base64.getEncoder();
	private static final Base64.Decoder dec = Base64.getDecoder();
	
	public ImportPetsAndOwners(String URL) {
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
		BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\browneg\\OneDrive - Rose-Hulman Institute of Technology\\Desktop\\ownerdata.csv"));  
		while ((line = br.readLine()) != null)   //returns a Boolean value  
		{  
		String[] info = line.split(splitBy);    // use comma as separator  
		if (x > 0) {
			Register(info[0], info[1], info[2], info[3]);
			addPet(info[4], info[5], info[6], info[7], info[8], info[9], info[0]);
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
		String dob, String cName, String username) {
		try {
			CallableStatement stmt = connection.prepareCall("{? = call add_pet(?,?,?,?,?,?,?)}");
			stmt.setString(2, name);
			stmt.setString(3, type);
			stmt.setString(4, sex);
			stmt.setString(5, breed);
			stmt.setString(6, dob);
			stmt.setString(7, cName);
			stmt.setString(8, username);
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
	public void Register (String fname, String lname, String address, String num) {
		byte[] salt = getNewSalt();
		String hash = hashPassword(salt,fname);
		try {
			CallableStatement stmt = connection.prepareCall("{? = call register(?,?,?,?,?,?,?)}");
			stmt.setString(2, fname);
			stmt.setBytes(3, salt);
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
	
	public byte[] getNewSalt() {
		byte[] salt = new byte[16];
		RANDOM.nextBytes(salt);
		return salt;
	}
	
	public String hashPassword(byte[] salt, String password) {

		KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 65536, 128);
		SecretKeyFactory f;
		byte[] hash = null;
		try {
			f = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
			hash = f.generateSecret(spec).getEncoded();
		} catch (NoSuchAlgorithmException e) {
			JOptionPane.showMessageDialog(null, "An error occurred during password hashing. See stack trace.");
			e.printStackTrace();
		} catch (InvalidKeySpecException e) {
			JOptionPane.showMessageDialog(null, "An error occurred during password hashing. See stack trace.");
			e.printStackTrace();
		}
		return getStringFromBytes(hash);
	}
	
	public String getStringFromBytes(byte[] data) {
		return enc.encodeToString(data);
	}
}
