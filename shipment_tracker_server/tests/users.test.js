const request = require('supertest');
const { app } = require('../app');
const User = require('../models/User');
const { USER_ATTR } = require('../constants/modelConstants');
const { USER_TYPES } = require('../constants/appConstants');

const testUser = {
  [USER_ATTR.FULL_NAME] : "Petar Petrovic",
  [USER_ATTR.EMAIL] : "__petar",
  [USER_ATTR.PASSWORD] : "__petar",
  [USER_ATTR.USER_TYPE] : 1
}


describe('users routes test', () => {  
  
  beforeAll( async ()=> {    
    return await User.destroy({where : {[USER_ATTR.EMAIL] : testUser[USER_ATTR.EMAIL] }, force : true })
  })

  let tempDbUserId = null;

  test('create user', async (done) => {
    let response = await request(app)
    .post('/v1/users/')
    .set('Content-Type', 'application/json')
    .send(testUser)
    
    const tempResponseUser = {... testUser};
    delete tempResponseUser[USER_ATTR.PASSWORD];
    
    let temp = await request(app)
    .get(`/v1/users/${response.body[USER_ATTR.USER_ID]}`)
    .then( response => {
      expect( response.statusCode).toBe(200);
      expect( response.body).toMatchObject( tempResponseUser);      
      tempDbUserId = response.body[USER_ATTR.USER_ID];      
    })        
    done();
  })

  test('get all users', (done) => {
    let tempTestUser = {...testUser};
    delete tempTestUser[USER_ATTR.PASSWORD]
    request(app)    
    .get('/v1/users')
    .then( response => {      
      expect( response.body ).toBeArray();
      expect( response.body).toEqual( expect.arrayContaining([
        expect.objectContaining(tempTestUser)
      ]) );
      done();
    })
  })

  test('delete user', (done) => {    
    request(app)
    .delete(`/v1/users/${tempDbUserId}`)
    .then( response => {
      expect( response.statusCode ).toBe(204);      
      done()    //note: if function is not async done should go inside then handler function
    })    
  })

})


describe('simple test package', () => {    
  test("test1", (done) => {    
      request( app )
      .get('/v1/users')
      .then( response => {
        expect( response.statusCode).toBe(200);
        expect( response.body).toBeArray();
        done();
      })
  })

  test("test2", (done) => {
    expect(true).toBeTruthy();    
    done();
  })
  

  test("testroute test", (done) => {
    return request(app)
            .get('/test/testroute')
            .then( response => {
              expect( response.statusCode).toBe(200);
            }).then( done );
  })

}) 
