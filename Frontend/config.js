let config = {
  server: 'titan.csse.rose-hulman.edu', 
  authentication: {
      type: 'default',
      options: {
          userName: 'PetCareAdmin', 
          password: 'DogCatFish'  //update me
      }
  },
  options: {
      // If you are on Microsoft Azure, you need encryption:
      encrypt: true,
      database: 'PetCareFinalDemo'  //update me
  }
}; 
  
  module.exports = config;