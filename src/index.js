let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{
  getToys()
  const addBtn = document.querySelector('#new-toy-btn')
  addBtn.addEventListener('click', toggleToyForm)
  getToyForm().addEventListener('submit', processToyForm)

})

function toggleToyForm() {
  const toyForm = document.querySelector('.container')
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
}

function getToyForm() {
  return document.querySelector('.add-toy-form')
}

function getToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => toys.forEach(toy => renderToy(toy)))
    .catch(error => console.log(error.message))
}

function renderToy(toy) {
  let container = document.querySelector('#toy-collection')

  let card = document.createElement('div')
  card.classList.add('card')
  card.id = `toy-${toy.id}`
  container.appendChild(card)

  let toyName = document.createElement('h2')
  toyName.innerText = toy.name
  let toyImage = document.createElement('img')
  toyImage.classList.add('toy-avatar')
  toyImage.src = toy.image 
  let toyLikes = document.createElement('p')
  toyLikes.classList.add('toy-likes')
  toyLikes.innerText = toy.likes

  let toyButton = document.createElement('button')
  toyButton.innerText = "Like this toy"
  toyButton.addEventListener('click', increaseLikes)

  card.appendChild(toyName)
  card.appendChild(toyImage)
  card.appendChild(toyLikes)
  card.appendChild(toyButton)

}

function processToyForm(event) {
  event.preventDefault()
  let toyName = document.querySelector('#toy-name').value
  let toyImage = document.querySelector('#toy-image').value

  let formData = {
    name: toyName,
    image: toyImage,
    likes: 0
  }

  let configOptions = 
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch('http://localhost:3000/toys', configOptions)
    .then(response => response.json() )
    .then(json => renderToy(json) )
    // .catch(error => console.log(error.message))

  getToyForm().reset()
  toggleToyForm()
  console.log('form submitted')
}

  function increaseLikes(event) {
    let likes = event.currentTarget.parentElement.querySelector('.toy-likes')
    let likesNumber = Number(likes.innerText)
    likesNumber += 1
    let id = event.currentTarget.parentElement.id.split('-')[1]

  let configOptions = 
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: likesNumber})
  }
    fetch(`http://localhost:3000/toys/${id}`, configOptions)
    .then(likes.innerText = likesNumber)
    .catch(error => console.log(error.message))
  }