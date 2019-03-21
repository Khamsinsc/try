'use strict';

const express = require('express');
const app = express();
const path = require('path');
const database = require('./database');
const connection = database.connection;

app.use(express.json());
app.use(express.urlencoded());
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, './index.html'));
});

app.post('/add', (req, res) => {
  console.log(req.body);

  if (checkAllFields(req.body) === true) {
    if ('id' in req.body === false) {
      insertQuery(req.body, res);
    } else if ('id' in req.body === true) {
      let id = req.body.id;
      delete req.body.id;
      updateQuery(req.body, res, id);
    }
  }
});

app.get('/attractions', (req, res) => {
  console.log(req.query);

  if ('category' in req.query === true || 'city' in req.query === true) {
    filterQuery(req.query)
      .then((rows) => res.status(200).send(rows))
      .catch(console.log);
  } else {
    selectQuery()
      .then((rows) => res.status(200).send(rows))
      .catch(console.log);
  }
})

app.get('/attractions/:id', (req, res) => {
  connection.query(
    `SELECT * FROM attractions
      WHERE id = '${req.params.id}'`,
    (err, rows) => {
      err ? console.log(err) : res.status(200).send(rows);
    }
  )
})

const selectQuery = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM attractions`, (error, rows) => {
        error ? reject(error) : resolve(rows);
      }
    )
  })
}


const filterQuery = (inputQuery) => {
  console.log(Object.values(inputQuery), Object.keys(inputQuery));
  let filterString = Object.values(inputQuery).length === 1 ?
    `${Object.keys(inputQuery)[0]} = "${Object.values(inputQuery)[0]}"` :
    Object.values(inputQuery).length === 2 ?
      `${Object.keys(inputQuery)[0]} = "${Object.values(inputQuery)[0]}" AND 
  ${Object.keys(inputQuery)[1]} = "${Object.values(inputQuery)[1]}"` : null;

  console.log(inputQuery.length);
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM attractions WHERE ${filterString};`, (error, rows) => {
        error ? reject(error) : resolve(rows);
      }
    )
  })
}

const insertQuery = (inputReqBody, inputRes) => {
  connection.query(
    `INSERT INTO attractions SET ?`, inputReqBody, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      inputRes.status(200).send({
        "status": 'ok',
        "id": results.insertId
      });
    }
  )
}

const updateQuery = (inputReqBody, inputRes, inputid) => {
  connection.query(
    `UPDATE attractions SET ? WHERE id = ?`, [inputReqBody, inputid], (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      inputRes.status(200).send({
        "status": 'ok',
        "id": inputid
      });
    }
  )
}

const checkAllFields = (inputReqBody) => {
  const fieldArray = ["attr_name", "city",
    "price", "lattitude",
    "longitude", "category",
    "duration", "recommended_age"];

  return fieldArray.some(e => e in inputReqBody === false) === true ? false : true;
}
/* 
app.get('/api/game', (req, res) => {//return a random question with its answers with JSON file from a database
  connection.query(
    'SELECT * FROM questions;',
    (err, rows1) => {
      if (err) {
        console.error(err);
      } else if (rows1.length > 0) {
        let questionQuantity = rows1.length;
        let randomQuestion = rows1[getRandomIndex(questionQuantity)];
        connection.query(
          `SELECT * FROM answers
          WHERE question_id = '${randomQuestion['id']}';`,
          (err, rows2) => {
            if (err) {
              console.error(err);
            } else {
              res.status(200).send(processQuestion(randomQuestion, rows2));
            }
          },
        );
      } else {
        res.status(404).send();
      }
    },
  );
});

app.get('/api/questions', (req, res) => {  //return all questions database select * ...
  connection.query(
    'SELECT * FROM questions;',
    (err, resQuestions) => {
      if (err) {
        console.error(err);
      } else if (resQuestions.length > 0) {
        res.status(200).send(resQuestions)
      } else {
        res.status(404).send();
      }
    },
  );
});

app.post('/api/questions', (req, res) => {  //insert into database with data variable
  const data = req.body;
  connection.query(
    `INSERT INTO questions (question)
    VALUES ('${data.question}');`
    ,
    (err, ansOne) => {
      if (err) {
        console.error(err);
      } else {
        data.answers.forEach((element) => {
          connection.query(
            `INSERT INTO answers (question_id, answer, is_correct)
            VALUES (${ansOne["insertId"]}, '${element.answer}', '${element.is_correct}');`,
            (err, ansTwo) => {
              if (err) {
                console.error(err);
              }
            }
          )
        });
      } res.status(200).send('query successfully processed');
    }
  )
})

app.delete('/api/questions/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`
  SELECT * FROM questions
  WHERE id = '${id}'`, (err, delrows) => {
      err ?
        console.log(err) : (delrows.length < 1) ?
          res.status(404).send() : delrows.length > 0 ?
            deleteQuestion(id, res, delrows) : res.status(500).send();
    }
  )
})


const getRandomIndex = (length) => {
  return Math.floor(Math.random() * length);
}

const processQuestion = (question, answers) => {
  const responseObject = {
    'id': question.id,
    'question': question.question,
    'answers': answers
  }
  return responseObject;
}

const deleteQuestion = (id, res, rows) => {
  console.log(rows);
  connection.query(
    `DELETE FROM questions
    WHERE id = '${id}';
    DELETE FROM answers
    WHERE question_id ='${id}';`,
    (err, rows) => {
      err ? console.error(err) : res.status(204).send();
    },
  )
} */

module.exports = app;