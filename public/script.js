const submitButton = document.getElementById('mybtn')
const form = document.getElementById('xss-form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const commentInput = document.getElementById('myinput')
  let comment = commentInput.value.trim().toString()
  comment = comment.replace(/'/g, "\\'")
  const commentContainer = document.getElementById('thirdcontainer')
  const commentElement = document.createElement('p')
  commentElement.innerHTML = comment
  commentContainer.appendChild(commentElement)
  commentInput.value = ''

  fetch('http://localhost:3000/api/comment/createComment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 200) {
        console.log(data)
        //window.location.href = '/STEP-3'
      } else {
        console.log('error: ', data)
      }
    })
    .catch((err) => {
      console.log(err)
    })
})

// load all comments from database and display them
const loadComments = () => {
  fetch('http://localhost:3000/api/comment/getComments')
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 200) {
        console.log(data)
        let comments = data.response

        const commentContainer = document.getElementById('thirdcontainer')
        comments.forEach((comment) => {
          const commentElement = document.createElement('p')
          // replace \x3C with <
          commentElement.innerHTML = comment.comment.replace(/\x3C/g, '<')
          commentContainer.appendChild(commentElement)
        })
      } else {
        console.log('error: ', data)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

loadComments()
