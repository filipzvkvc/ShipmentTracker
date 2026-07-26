// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest');
const { app } = require('../app');
const { USER_ATTR } = require('../constants/modelConstants');
const User = require('../models/User');


const request = supertest.agent(app);

const testUser = {
  [USER_ATTR.FULL_NAME] : "Petar Petrovic",
  [USER_ATTR.EMAIL] : "__petar",
  [USER_ATTR.PASSWORD] : "__petar",
  [USER_ATTR.USER_TYPE] : 1
}

expect.extend({
  toBeOneOf(received, possibleValuesArray ){
    const pass = possibleValuesArray.some( el => received === el)
    if(pass){
      return {
        message : `expected ${received} not to be in array ${possibleValuesArray}`,
        pass : true
      }
    }else {
      return {
        message : `expected ${received} to be in array ${possibleValuesArray}`,
        pass : false
      }
    }
  }
})


describe('authentication tests', () =>{
  beforeAll( async done => {    
    await User.destroy({where : {[USER_ATTR.EMAIL] : testUser[USER_ATTR.EMAIL]}, force : true });
    await request
    .post('/v1/users/')
    .set('Content-Type', 'application/json')
    .send(testUser)    
    
    done();
  })
    

  test('login', async done => {
    await request
      .post('/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        [USER_ATTR.EMAIL] : testUser[USER_ATTR.EMAIL],
        [USER_ATTR.PASSWORD] : testUser[USER_ATTR.PASSWORD]
      })
      .then(response => {        
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('token')
        done();
      })
  })

})