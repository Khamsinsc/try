'use strict';
let tableBodyTag = document.querySelector('.tablebody');
let tableHeadRow = document.querySelector('.tableHead');
let form = document.querySelector('form');


window.onload = () => {
  fetchAttractions();
}

const fetchAttractions = () => {
  let URL = '/attractions';
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      renderHTML(data);
      renderForm(data);
    }).then(() => {
      addSubmitEvent();
    }).then(() => {
      addEditEvent();
    })
    .catch(error => console.error(error.message));
}

const renderHTML = (data) => {
  tableHeadRow.innerHTML = '';
  tableBodyTag.innerHTML = '';
  Object.keys(data[0]).forEach((e, i) => {
    if (i !== 0) {

      tableHeadRow.insertAdjacentHTML('beforeend', `<th>${e}</th>`);
    }
  })

  data.forEach(e => {
    let values = Object.values(e);
    let startString = '<tr>';
    let endString = `<td  ><button class="edit" id="${values[0]}">EDIT</button></td></tr>`;
    let middlestring = '';

    for (let index = 1; index < values.length; index++) {
      middlestring += `<td>${values[index]}</td>`;
    }
    tableBodyTag.insertAdjacentHTML('beforeend', startString + middlestring + endString);
  })
}

const renderForm = (data) => {

  form.innerHTML = ''
  Object.keys(data[0]).forEach((e, i) => {
    if (i !== 0) {
      form.insertAdjacentHTML('beforeend', `
      <label for="${e}">${e}: </label> <input type="text" name="${e}" required></input><br>      
      `);
    }
  })
  form.insertAdjacentHTML('beforeend', `<button type="submit" class= "submit">Submit</button>`);
}

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
    } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
    }
  }
  return serialized.join('&');
};

const addSubmitEvent = () => {
  let submit = document.querySelector('.submit');
  submit.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    let valueString = serialize(form);
    let valueObject = objectifyFormValues(valueString);
    postRequest(valueObject);
  })
}

const objectifyFormValues = (valueString) => {
  console.log(valueString);
  let valueMatrix = valueString.replace(/%20/g, ' ').split('&').map(e => e.split('='));

  if (valueMatrix.some(e => e[1] === '') === true) {
    alert(`please fill every input zone!`);
    return false;
  } else {
    form.reset();
    let valueObject = {};
    valueMatrix.forEach(e => {
      valueObject[e[0]] = e[1];
    })
    return valueObject;
  }
}

const postRequest = (inputObject) => {
  fetch('/add', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputObject),
  })
    .then(console.log)
    .then(fetchAttractions)
    .catch(console.error);
}

const addEditEvent = () => {
  let editButtons = document.querySelectorAll('.edit');

  editButtons.forEach(e => {
    e.addEventListener('click', (e) => {
      fetch('/attractions/' + e.target.id)
        .then(response => response.json())
        .then(fillInputs)
        .then(console.log)
        .catch(console.error);
    })
  })
}

const fillInputs = (data) => {
  let inputs = document.querySelectorAll('input');
  let keys = ['attr_name', 'city', 'category', 'price', 'longitude', 'lattitude', 'recommended_age', 'duration'];

  inputs.forEach((e,i)=>{
    e.value = data[0][keys[i]];
  })
}

