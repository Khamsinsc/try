'use strict';

let form = document.querySelector('form');
let button = document.querySelector('button');
let radios = document.querySelectorAll('.iscorrect');
let qContainer = document.querySelector('.questionContainer');

window.onload = () => {
  getRequest();
}

button.addEventListener('click', (e) => {
  e.stopPropagation();
  e.preventDefault();
  let inputMatrix = objectifyForm(form);
  let postData = createPostObject(inputMatrix);
  postRequest(postData);
})

const serialize = (form) => {
  let serialized = [];

  for (let i = 0; i < form.elements.length; i++) {
    let field = form.elements[i];
    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

    if (field.type === 'select-multiple') {
      for (let n = 0; n < field.options.length; n++) {
        if (!field.options[n].selected) continue;
        serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
      }
    }

    else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
    }
  }
  return serialized.join('&');
};

const objectifyForm = (form) => {
  let multiArray = serialize(form).replace(/%20/g, ' ').split('&').sort().map(e => e.split('='));
  console.log(multiArray);
  if (multiArray.some(e => e[1] === '') === true) {
    alert(`please fill every input zone!`);
    return false;
  } else {
    form.reset();
    return multiArray;
  }
}

const createPostObject = (input) => {
  let answers = [];
  for (let index = 0; index < 4; index++) {
    answers[index] = {
      "answer": input[index][1],
      "is_correct": parseInt(input[5][1]) === index ? 1 : 0
    }
  }

  const data = {
    "question": input[4][1],
    "answers": answers
  }
  return data;
}

const postRequest = (postbody) => {
  fetch('/api/questions', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postbody),
  })
    .then(console.log)
    .then(getRequest)
    .catch(console.error);
}

const getRequest = () => {
  fetch('/api/questions')
    .then(response => response.json())
    .then(displayQuestions)
    .catch(console.error);
}

const displayQuestions = (data) => {
  qContainer.innerHTML = '';
  data.forEach((e, i) => {
    qContainer.insertAdjacentHTML('beforeend',
      `<p class="question">${e.question}<span class= "delete" id="${e.id}">DELETE</span></p> `)
  })
  addDeleteEvent();
}

const addDeleteEvent = () => {
  document.querySelectorAll('.delete').forEach(element => {
    element.addEventListener('click', (e) => {
      deleteRequest(e.target.id);
    })
  });
}

const deleteRequest = (inputID) => {
  fetch(`/api/questions/${inputID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then(console.log)
    .then(getRequest)
    .catch(console.error);
}