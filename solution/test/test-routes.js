'use strict';

const test = require('tape');
const request = require('supertest');
const app = require('../routes');
const dotenv = require('dotenv');
const postBody = {
  "question": "What is the lowest male voice?",
  "answers": [
     {
          "text": "Bariton",
          "is_correct": 0
      },
      {
          "text": "Bass",
          "is_correct"  : 1
      },
      {
          "text": "Tenor",
          "is_correct": 0
      },
      {
          "text": "Alt",
          "is_correct"  : 0
      }
  ]
};

dotenv.config();

test('/game endpoint', (t) => {
  request(app)
    .get('/game')
    .expect('Content-Type', /html/i)
    .expect(200)
    .end(function (err, res) { 
      t.error(err, 'No error');    
      t.end();
    });
});

test('/questions endpoint', (t) => {
  request(app)
    .get('/questions')
    .expect('Content-Type', /HTML/i)
    .expect(200)
    .end(function (err, res) {     
      t.error(err, 'No error');    
      t.end();
    });
});

test('GET /api/game endpoint', (t) => {
  request(app)
    .get('/api/game')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {      
      let expected = [true,true,true];
      let testCase = [
        typeof res.body === 'object',
        'id' in res.body,
        res.body.answers.length === 4
      ]      
      t.error(err, 'No error');
      t.same(testCase,expected);     
      t.end();
    });
}); 


test('GET /api/questions endpoint', (t) => {
  request(app)
    .get('/api/questions')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {      
      let expected = [true,true,true];
      let testCase = [
        res.body.length > 0,
        'id' in res.body[0],
        'question' in res.body[0]
      ]      
      t.error(err, 'No error');
      t.same(testCase,expected);     
      t.end();
    });
}); 


test('POST /api/questions endpoint', (t) => {
  request(app)
    .post('/api/questions')
    .send(postBody)
    .expect('Content-Type', /text/i)
    .expect(200)
    .end(function (err, res) {      
      console.log(res.text);      
      let expected = 'query successfully processed';
     
      t.error(err, 'No error');
      t.same(res.text,expected);     
      t.end();
    });
}); 

test('DELETE /api/questions endpoint', (t) => {
  request(app)
    .delete('/api/questions/' + '38')     
    .expect(204)
    .end(function (err, res) {           
      t.error(err, 'No error');  
      t.end();
    });
}); 


