let addToy = false
var totalToys;
var totalPages;

document.addEventListener("DOMContentLoaded", ()=>{
  
  getToys()
  addPageListeners()
  const addBtn = document.querySelector('#new-toy-btn')
  addBtn.addEventListener('click', toggleToyForm)
  getToyForm().addEventListener('submit', processToyForm)
  document.querySelector('#random-image').addEventListener('click', addRandomImageUrl)
  document.querySelector('#toy-header img').addEventListener('click', flipBody)

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

function addPageListeners() {
  let back = document.getElementById('back')
  let next = document.getElementById('next')

  back.addEventListener('click', shufflePage)
  next.addEventListener('click', shufflePage)
}

function shufflePage(event) {
  let action = event.currentTarget.id
  let currentPage = document.querySelector('#current-page')
  let page = Number(currentPage.innerText)
  currentPage.innerText = ''

  if (action === "next") {
    page += 1
  } else {
    page -= 1
  } 
  getToys(page)
}

function getToys(page=1, limit=3) {
  // let totalPages;
  getTotalToys()
  document.querySelector('#toy-collection').innerHTML = ''
  

  fetch(`http://localhost:3000/toys/?_limit=${limit}&_page=${page}`)
    .then(response => response.json())
    .then(toys => toys.forEach(toy => renderToy(toy)))
    .catch(error => console.log(error.message))

    let currentPage = document.querySelector('#current-page')
    currentPage.innerText = page
    if (page === 1) {
      document.querySelector('#back').disabled = true
    } else if (page >= totalPages) {
      document.querySelector('#next').disabled = true
      document.querySelector('#back').disabled = false
    } else {
      document.querySelector('#next').disabled = false
      document.querySelector('#back').disabled = false
    }  
}

function getTotalToys() {
  // debugger
  fetch(`http://localhost:3000/toys/`)
    .then(response => response.json())
    .then(toys => {
      totalToys = toys.length
      totalPages = totalToys/3
    })
    .catch(error => console.log(error.message))
}

// function returnTotalToys(number) {
//   console.log(number.length)
//   return number
// }

function renderToy(toy, action="append") {
  let container = document.querySelector('#toy-collection')

  let card = document.createElement('div')
  card.classList.add('card')
  card.id = `toy-${toy.id}`
  card.addEventListener('click', setRandomBackground)
  if (action === "append") {
    container.appendChild(card)
  } else {
    container.prepend(card)
    // container.querySelector('card:last-of-type').remove()
  }

  let toyName = document.createElement('h2')
  toyName.innerText = toy.name

  let toyImage = document.createElement('img')
  toyImage.classList.add('toy-avatar')
  toyImage.src = toy.image 

  let toyLikes = document.createElement('p')
  toyLikes.classList.add('toy-likes')
  toyLikes.innerText = toy.likes

  card.appendChild(toyName)
  card.appendChild(toyImage)
  card.appendChild(toyLikes)

  let buttonContainer = document.createElement('div')
  card.appendChild(buttonContainer)

  let likeButton = document.createElement('button')
  likeButton.innerText = "Like"
  likeButton.addEventListener('click', increaseLikes)

  let unlikeButton = document.createElement('button')
  unlikeButton.innerText = "Unlike"
  unlikeButton.classList.add("unlike-button")
  unlikeButton.style.display = "inline"
  unlikeButton.addEventListener('click', decreaseLikes)

  let deleteButton = document.createElement('button')
  deleteButton.innerText = "Delete"
  deleteButton.style.display = "inline"
  deleteButton.addEventListener('click', deleteToy)
  deleteButton.addEventListener('mouseover', moveDeleteButton)

  buttonContainer.appendChild(likeButton)
  buttonContainer.appendChild(unlikeButton)
  buttonContainer.appendChild(deleteButton)

}

function processToyForm(event) {
  event.preventDefault()
  let toyName = document.querySelector('#toy-name').value
  let toyImage = document.querySelector('#toy-image').value

  if (toyName === '' || toyImage === ''){
    alert("Please fill out the entire form")
  } else {
    let formData = {
      name: toyName,
      image: toyImage,
      likes: 0
    }

    let configOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    }

    fetch('http://localhost:3000/toys', configOptions)
      .then(response => response.json() )
      .then(json => renderToy(json, "prepend") )
      .catch(error => console.log(error.message))

    getToyForm().reset()
    toggleToyForm()
    console.log('form submitted')
  }

}

function increaseLikes(event) {
    let likes = event.currentTarget.parentElement.parentElement.querySelector('.toy-likes')
    let likesNumber = Number(likes.innerText)
    likesNumber += 1
    let id = event.currentTarget.parentElement.parentElement.id.split('-')[1]

  let configOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: likesNumber})
  }
    fetch(`http://localhost:3000/toys/${id}`, configOptions)
    // .then(response => {})
    .then(response => {likes.innerText = likesNumber})
    .catch(error => alert(error.message))
}

function decreaseLikes(event) {
    let likes = event.currentTarget.parentElement.parentElement.querySelector('.toy-likes')
    let likesNumber = Number(likes.innerText)
    likesNumber -= 1
    let id = event.currentTarget.parentElement.parentElement.id.split('-')[1]

  let configOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: likesNumber})
  }
    fetch(`http://localhost:3000/toys/${id}`, configOptions)
    .then(response => {likes.innerText = likesNumber})
    .catch(error => alert(error.message))
}

function deleteToy(event) {
    let toyCard = event.currentTarget.parentElement.parentElement
    let id = toyCard.id.split('-')[1]

  let configOptions = {
    method: "DELETE"
  }
    fetch(`http://localhost:3000/toys/${id}`, configOptions)
    .then( toyCard.remove() )
    .catch(error => console.log(error.message))
}

function moveDeleteButton(event) {  
  let button = event.currentTarget
  button.classList.add('flipped-element')
  setTimeout(doThis => {
    button.style.display = "none"}, 1000)
}

function flipBody(event) {
  if (document.body.classList.contains("flipped-element")){
    document.body.classList.remove('flipped-element')
    document.body.classList.add('unflipped-element')
  }else {
    document.body.classList.remove('unflipped-element')
    document.body.classList.add('flipped-element')
  }
}


function addRandomImageUrl(event) {
  event.preventDefault()
  let urlField = document.querySelector('#toy-image')
  // debugger

  let url = 'https://source.unsplash.com/1200x1500/?toy'
  if (document.body.classList.contains("flipped-element")){
    // console.log("we're upsidedown")
    url = 'https://source.unsplash.com/1200x1500/?scary-monster'
  }

  fetch(url)
    .then(response => urlField.value = response.url)
    .catch(error => console.log(error.message))
}

function setRandomBackground(event) {
  event.currentTarget.style.background = `#${Math.floor(Math.random()*16777215).toString(16)}`
}