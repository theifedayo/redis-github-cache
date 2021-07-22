process.env.NODE_ENV = 'test';


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
var request = require('supertest');
// let should = chai.should();


chai.use(chaiHttp);

describe('GET /', function(){
  it('respond with 200', function(done){
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done()
      });
  })
});

