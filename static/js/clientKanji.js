const BASE_URL = 'https://web-api-assignment-304cem.herokuapp.com'

/**
 * Funvtion to make a modal disappear
 * @param {String} action String to specify what modal is it 
 */
function makeModalDisapper(action) {
  const modal = document.querySelector(`.${action}-main-modal`);

  modal.classList.remove('fadeIn');
  modal.classList.add('fadeOut');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 500);
}

/**
 * Function show modal with action
 * @param {*} action 
 */
function makeModalAppear(action) {
  const modal = document.querySelector(`.${action}-main-modal`);

  modal.classList.remove('fadeOut');
  modal.classList.add('fadeIn');
  modal.style.display = 'flex';

}

function addModalListeners(action) {
  const modal = document.querySelector(`.${action}-main-modal`);
  const button = document.querySelectorAll(`.${action}-modal-close`);

  const modalClose = () => {
    modal.classList.remove('fadeIn');
    modal.classList.add('fadeOut');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 500);
  }

  const openModal = () => {
    modal.classList.remove('fadeOut');
    modal.classList.add('fadeIn');
    modal.style.display = 'flex';
  }

  for (let i = 0; i < button.length; i++) {

    const elements = button[i];

    elements.onclick = (e) => modalClose();

    modal.style.display = 'none';

    window.onclick = function (event) {
      if (event.target == modal) modalClose();
    }
  }

  return openModal
}

document.getElementById('registerLnk').onclick = addModalListeners('register')
document.getElementById('loginLnk').onclick = addModalListeners('login')
document.getElementById('logoutLnk').onclick = addModalListeners('logout')
document.getElementById('deleteLnk').onclick = addModalListeners('delete-account')
document.getElementById('resetLnk').onclick = addModalListeners('reset')

addModalListeners('newPassword')
addModalListeners('delete-favourite')
addModalListeners('deleteAllFavourite')

function loadKanjiFromSearch(kanji) {
  resetDiv('kanjisDiv')

  const kanjiArray = []
  kanjiArray.push(kanji)

  loadKanjisToDiv(kanjiArray, 'kanjisDiv', false)
}

/**
 * Function to get all kanji and load them at the html
 */
async function getKanjiFromDatabase() {

  const isLogined = sessionStorage.getItem('isLogined')

  if (Object.is(isLogined, 'true')) {
    toggleFavouriteTab(true)
  }

  resetDiv('kanjisDiv')

  const kanjiList = await fetch(`${BASE_URL}/getAllKanji`).catch(err => null)
  const jsonKanjiList = Object.is(kanjiList, null) ? null : await kanjiList.json()
  if (Object.is(jsonKanjiList, null)) {
    //Gives user an alert about loading failed
    Swal.fire({
      icon: 'error',
      title: 'Error loading kanjis from database',
      text: 'Loading kanjis from database failed. Please try again later.'
    })
  } else {
    loadKanjisToDiv(jsonKanjiList.reverse(), 'kanjisDiv', false)
  }
}

function resetDiv(id) {
  document.getElementById(id).innerHTML = ''
}

function createKanjiElement(kanji) {

  const kanjiListElement = `
  
                  <tr>
                      <th class="text-left text-gray-600">Kanji</th>
                      <td class="p-2 text-gray-100">${kanji.character}</td>
                  </tr>
                  
                  <tr><td><br></td></tr>
                  
                  <tr>
                  <th class="text-left text-gray-600">Image</th>
                    <td class="p-2 text-gray-100"><img style="background:white;" width="64" height="64" src=${kanji.image} /></td>
                  </tr>
                  
                  <tr><td><br></td></tr>
                  
                  <tr>
                  <th class="text-left text-gray-600">Readings</th>
                    <td class="p-2 text-gray-100">${joinKanjiMeanings(kanji.readings)}</td>
                  </tr>
                  
                  <tr><td><br></td></tr>
                  
                  <tr>
                  <th class="text-left text-gray-600">Meanings</th>
                    <td class="p-2 text-gray-100">${joinKanjiMeanings(kanji.meanings)}</td>
                  </tr>

                  <tr><td><br></td></tr>
                  <tr><td><br></td></tr>

                  <tr>
                  <th class="text-left text-gray-600">Examples</th>
                    ${createExampleDivs(kanji.kanjiExamples)}
                  </tr>

                  <tr><td><br></td></tr>

  `;
  return kanjiListElement
}

/**
 * Function to join all readings into a single string
 * @param {Array[]} readings array of readings of the kaji
 */
function joinKanjiMeanings(readings) {
  let joinedString = ''
  for (const reading of readings) joinedString += `${reading}, `
  return joinedString.substring(0, joinedString.length - 2)
}

function loadKanjisToDiv(kanjiList, elementId, isFavouritesList) {
  const kanjisListDiv = document.getElementById(elementId)
  let kanjiListElement = ''

  for (let i = 0; i < kanjiList.length; i++) {
    kanjiListElement += `
 
  <!--Table Card-->
  <div class="bg-gray-900 border border-gray-800 rounded shadow p-3 w-full">
      
  `
    kanjiListElement += `
    <div class="border-b border-gray-800 p-3">
  <h5 class="font-bold uppercase text-gray-600">Kanji #${i + 1}</h5>
</div>
<div class="p-5">
  <table class="w-full p-5 text-gray-700">
      <tbody>
      <input id="${isFavouritesList ? 'favKanjiDetails' + i : 'kanjiDetails' + i}" type="hidden" value='${JSON.stringify(kanjiList[i])}' />
    `
    kanjiListElement += createKanjiElement(kanjiList[i])
    kanjiListElement += `
    </tbody>
  </table>
  <br/>`
    if (Object.is(isFavouritesList, false)) {
      const isLogined = sessionStorage.getItem('isLogined')
      if (Object.is(isLogined, 'true')) {
        kanjiListElement += `
    <div id="addToFavouritesDiv${i}" class="flex">
      <button id="addToFavouritesBtn" onclick='saveToFavourite(${i})' class="pull-right bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Add to Favourites</button>
      <div class="px-3"></div>
      </div>
    `
      }

    } else if (Object.is(isFavouritesList, true)) {
      kanjiListElement += `
    <div id="deleteFavouritesDiv${i}" class="flex">
      <button id="deleteFavBtn" onclick='openDeleteFavModal(${i})' class="pull-right bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete Favourite</button>
      <div class="px-3"></div>
      </div>
    `
    }

    kanjiListElement +=
      `
  </div>
</div>
<div class="my-6 mx-4"></div>
    `
  }

  kanjisListDiv.innerHTML = kanjiListElement

}

function createExampleElement(kanjiExample, index) {
  return `
   
   <tr>
      <th class="text-left text-gray-600">Example #${index + 1}</th>
        
    </tr>
    

    <tr><td><br></td></tr>
    
    <tr>
      <th class="text-left text-gray-600">Example words</th>
      <td class="text-gray-100">${kanjiExample.japanese}</td>  
    </tr>
    
    <tr><td><br></td></tr>
    
    <tr>
    <th class="text-left text-gray-600">Meaning</th>
    <td class="text-gray-100">${kanjiExample.meaning.english}</td>  
    </tr>
    
    <tr><td><br></td></tr>
    
    <tr>
   <th class="text-left text-gray-600">Audio</th>
   <td class="text-gray-100"><audio controls><source src="${kanjiExample.audio.mp3}"></audio></td>  
    </tr>
    
    `

}

function createExampleDivs(kanjiExamples, index) {
  let examplesListElement = ''
  for (let i = 0; i < kanjiExamples.length; i++) {

    examplesListElement += createExampleElement(kanjiExamples[i], i)
    examplesListElement += `
    <tr><td><br></td></tr>
    `
  }
  return examplesListElement
}

function searchKanji() {

  const kanjiToSearch = document.getElementById('searchBox').value.trim()

  if (kanjiToSearch.length > 1) {
    
    Swal.fire({
      icon: 'error',
      title: 'Single kanji only',
      text: 'Please enter only 1 kanji.'
    })

  } else if (kanjiToSearch.length === 0) {
  
    document.getElementById('searchBox').value = ''
    getKanjiFromDatabase()
  
  } else {
  
    document.getElementById('searchBox').value = ''
    const encodedString = encodeURIComponent(kanjiToSearch)
    
    fetch(`${BASE_URL}/getSingleKanji/${encodedString}`)
      .then(kanjiSearched => {
        return kanjiSearched.json()
      })
      .then(jsonResponse => {
        const resp = jsonResponse
        loadKanjiFromSearch(resp)
      })
      .catch(err => {
        //alert(`Kanji may not be in database. Please check and add to database if necessary.`)
        Swal.fire({
          icon: 'error',
          title: 'Kanji not in database',
          text: 'The kanji is not in database. Please check and add to database if necessary.'
        })
        getKanjiFromDatabase()
      })
  }
}

function loginUser() {
  const email = document.getElementById('loginEmailTxt').value
  const password = document.getElementById('loginPasswordTxt').value

  const loginObj = {
    "email": email,
    "password": password
  }

  if (!Object.is(email.trim(), '') && !Object.is(password.trim(), '')) {

    fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify(loginObj),
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      })
      .then(result => {
        return result.json()
      })
      .then(jsonResult => {
        const result = jsonResult
        
        // Clears the user input
        document.getElementById('loginEmailTxt').value = ''
        document.getElementById('loginPasswordTxt').value = ''

        toggleLoginVisible(false)

        if (Object.is(result['auth'], true)) {
          const {
            userType,
            token
          } = result

          sessionStorage.setItem('token', token)
          sessionStorage.setItem('isLogined', 'true')
          sessionStorage.setItem('userType', userType)
          sessionStorage.setItem('email', email)
          document.getElementById('greetMsg').innerText = `Hi, ${email}`
          document.getElementById('loginEmailTxt').value = ''
          document.getElementById('loginPasswordTxt').value = ''

          if (Object.is(userType, `admin`)) {


            document.location.href = `${BASE_URL}/admin`

          } else {
            makeModalDisapper('login')
            getKanjiFromDatabase()
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Password incorrect',
            text: 'Password entered is incorrect. Please try again.'
          })
        }

      })
      .catch(err => {
        console.error(err)
        Swal.fire({
          icon: 'error',
          title: 'Login error',
          text: 'Login Error. Please try again.'
        })
      })

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Email or password is empty',
      text: 'Email of password has not been filled in. Please enter the email or password.'
    })
  }


}

/**
 * Function to register user
 */
function registerUser() {

  const emailToRegister = document.getElementById('registerEmailTxt').value
  const passwordToRegister = document.getElementById('registerPasswordTxt').value

  const registerObj = {
    "email": emailToRegister,
    "password": passwordToRegister
  }

  fetch(`${BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify(registerObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    })
    .then(result => result.json())
    .then(jsonResult => {
      const authResult = jsonResult
      
      // Clear the user inputs
      document.getElementById('registerEmailTxt').value = ''
      document.getElementById('registerPasswordTxt').value = ''

      if (Object.is(authResult['error'], true)) {
        Swal.fire({
          icon: 'error',
          title: 'Email already in used',
          text: 'An account using this email has already been created. Please login.'
        })
      } else {
        makeModalDisapper('register')
      }

    })
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Register error',
        text: 'Failed to register. Please try again.'
      })
    })

}

/**
 * Function to reset password
 */
async function resetPassword() {
  const email = document.getElementById('resetEmailTextBox').value

  if (!Object.is(email.trim(), '')) {

    const emailObj = {
      "email": email
    }

    const checkUser = await fetch(`${BASE_URL}/findUserInDatabase`, {
        method: 'POST',
        body: JSON.stringify(emailObj),
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }).then(result => result.json())
      .catch(err => {
        console.error(err)
        return null
      })

    if (Object.is(checkUser.error, false)) {

      fetch(`${BASE_URL}/resetPassword/${email}`, {
          method: "POST"
        })
        .then(result => result.json())
        .then(jsonResult => {

          const resetUrl = jsonResult['resetURL']
          document.getElementById('resetUrl').value = resetUrl

          // Remove the reset password modal and send an alert
          // to let the user know that the email has been sent

          const resetModal = document.getElementsByClassName('reset-main-modal')[0]

          resetModal.classList.remove('fadeIn');
          resetModal.classList.add('fadeOut');
          setTimeout(() => {
            resetModal.style.display = 'none';
          }, 500);

          Swal.fire({
            icon: 'success',
            title: 'Reset password email sent',
            text: 'Reset password email has been sent. Check your inbox or spam.'
          })

        })
        .catch(err => {
          console.error(err)
        })

    }

    else {
      
      //Send an alert to let the user know
      //that the email is not in database

      Swal.fire({
        icon: 'error',
        title: 'User not in database',
        text: 'The user with this email cannot be found in database. Please register first.'
      })

    }

  }

  else {

    //Sends an alert to user that email is empty
    Swal.fire({
      icon: 'error',
      title: 'Email field empty',
      text: 'The email field is empty. Please enter an email.'
    })

  }

}

/**
 * Function to update password
 */

function updatePassword() {

  const resetUrl = document.getElementById('resetUrl').value
  const passwordObj = {
    "password": document.getElementById('newPasswordTextBox').value
  }
  
  fetch(resetUrl, {
      method: "POST",
      body: JSON.stringify(passwordObj),
      headers: {
        "Content-Type": "application/json;charset=utf-8"
      }
    })
    .then(result => result.json())
    .then(jsonResult => {
      console.log(jsonResult)
      const newPasswordModal = document.getElementsByClassName('newPassword-main-modal')[0]

      newPasswordModal.classList.remove('fadeIn');
      newPasswordModal.classList.add('fadeOut');
      setTimeout(() => {
        newPaswordModal.style.display = 'none';
      }, 500);

      resetPasswordLogOut()

    })
    .catch(err => {
      console.error(err)
    })
}

function toggleLoginVisible(isVisible) {
  const toDisplay = isVisible ? '' : 'none'

  document.getElementById('loginLnk').style.display = toDisplay
  document.getElementById('registerLnk').style.display = toDisplay
  document.getElementById('deleteLnk').style.display = isVisible ? 'none' : ''
  document.getElementById('logoutLnk').style.display = isVisible ? 'none' : ''
  document.getElementById('favLnk').style.display = isVisible ? 'none' : ''
  document.getElementById('addDiv').style.display = isVisible ? 'none' : ''

}

function toggleFavouriteTab(isVisble) {
  const toDisplay = isVisble ? '' : 'none'

  document.getElementById('homeDiv').style.display = toDisplay
  document.getElementById('userDiv').style.display = isVisble ? 'none' : ''
}

/**
 * Function to log out user
 */
function logout() {

  sessionStorage.removeItem('token')
  sessionStorage.removeItem('isLogined')
  sessionStorage.removeItem('userType')
  sessionStorage.removeItem('email')
  toggleLoginVisible(true)
  getKanjiFromDatabase()
  makeModalDisapper('logout')
  document.getElementById('greetMsg').innerText = `Hi, User`

}

/**
 * Function to log out user after reseting password
 */
function resetPasswordLogOut() {
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('isLogined')
  sessionStorage.removeItem('userType')
  sessionStorage.removeItem('email')
  toggleLoginVisible(true)
  document.getElementById('greetMsg').innerText = `Hi, User`
}

/**
 * Function to delete user account
 */
function deleteAccount() {
  const token = sessionStorage.getItem('token')

  fetch(`${BASE_URL}/deleteUser`, {
      method: 'DELETE',
      headers: {
        'x-access-token': token
      }
    })
    .then(resp => {
      logout()
      getKanjiFromDatabase()
      makeModalDisapper('delete-account')
    })
    .catch(err => {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Account failed to delete error',
        text: 'Failed to delete account. Please try again.'
      })
    })
}

/**
 * Function to load user favourites from home page
 */
async function getUserFavouritesFromDatabase() {
  
  resetDiv('userFavourites')

  const token = sessionStorage.getItem('token')

  const kanjiList = await fetch(`${BASE_URL}/getUserFavourites`, {
    headers: {
      "x-access-token": token
    }
  }).catch(err => null)

  const jsonKanjiList = Object.is(kanjiList, null) ? null : await kanjiList.json()
  
  if (Object.is(jsonKanjiList, null)) {
    // Alerts user about error loading user favourites
    Swal.fire({
      icon: 'error',
      title: 'Error loading kanjis from database',
      text: 'Loading kanjis from database failed. Please try again later.'
    })
  } else {
    loadKanjisToDiv(jsonKanjiList.reverse(), 'userFavourites', true)
  }

}

/**
 * Function to save kanji to user favourites
 */
async function saveToFavourite(index) {
  const isLogined = sessionStorage.getItem('isLogined')

  if (Object.is(isLogined, 'true')) {

    const kanji = JSON.parse(document.getElementById(`kanjiDetails${index}`).value)
    const kanjiObj = {
      "kanji": kanji
    }
    const token = sessionStorage.getItem('token')

    let isFavAlreadyExists = false
    const kanjiList = await fetch(`${BASE_URL}/getUserFavourites`, {
      headers: {
        "x-access-token": token
      }
    }).catch(err => null)
    const jsonKanjiList = Object.is(kanjiList, null) ? null : await kanjiList.json()

    //Go through whole favourites list to find
    //if kanji already exists
    for (const favObj of jsonKanjiList) {
      if (Object.is(kanji.encodedString, favObj.encodedString)) {
        isFavAlreadyExists = true
        break
      }
    }

    if (!isFavAlreadyExists) {
      fetch(`${BASE_URL}/addUserFavourite`, {
          method: "POST",
          body: JSON.stringify(kanjiObj),
          headers: {
            "x-access-token": token,
            "Content-Type": "application/json;charset=utf-8"
          }
        })
        .then(result => result.json())
        .then(jsonResult => {
          console.log(jsonResult)
          Swal.fire({
            icon: 'success',
            title: 'Kanji added successfully',
            text: 'Kanji successfully added to your favourites'
          })
        })
        .catch(err => {
          console.error(err)
          Swal.fire({
            icon: 'error',
            title: 'Kanji falied to be aded',
            text: 'Failed to add kanji to favourites. Please try again later'
          })
        })

    } else {
      Swal.fire({
        icon: 'info',
        title: 'Kanji already in favourites',
        text: 'Kanji already in favourites. Add another kanji.'
      })

    }

  }
}

/**
 * Function to delete user favourite
 */

function deleteUserFavourite() {
  const isLogined = sessionStorage.getItem('isLogined')
  const index = Number(document.getElementById('curFavIndex').value)

  if (Object.is(isLogined, 'true')) {
    const kanji = JSON.parse(document.getElementById(`favKanjiDetails${index}`).value)
    const kanjiObj = {
      "kanji": kanji
    }
    const token = sessionStorage.getItem('token')

    fetch(`${BASE_URL}/deleteUserFavourite`, {
        method: "DELETE",
        body: JSON.stringify(kanjiObj),
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json;charset=utf-8"
        }
      })
      .then(result => result.json())
      .then(jsonResult => {

        makeModalDisapper('delete-favourite')
        getUserFavouritesFromDatabase()
        Swal.fire({
          icon: 'success',
          title: 'Kanji deleted successfully',
          text: 'Kanji successfully deleted to your favourites'
        })
      })
      .catch(err => {
        console.error(err)
        makeModalDisapper('delete-favourite')
        Swal.fire({
          icon: 'error',
          title: 'Kanji falied to be deleted',
          text: 'Failed to delete user kanji to favourites. Please try again later'
        })
      })

  }
}

/**
 * Function to delete all user favourites
 */
function deleteAllUserFavourites() {
  const isLogined = sessionStorage.getItem('isLogined')

  if (Object.is(isLogined, 'true')) {

    const token = sessionStorage.getItem('token')

    fetch(`${BASE_URL}/deleteAllUserFavourites`, {
        method: "DELETE",
        headers: {
          "x-access-token": token,
        }
      })
      .then(result => result.json())
      .then(jsonResult => {
        console.log(jsonResult)
        makeModalDisapper('deleteAllFavourite')
        getUserFavouritesFromDatabase()
        Swal.fire({
          icon: 'success',
          title: 'All kanji deleted successfully',
          text: 'All kanji successfully deleted to your favourites'
        })
      })
      .catch(err => {
        console.error(err)
        makeModalDisapper('deleteAllFavourite')
        Swal.fire({
          icon: 'error',
          title: 'All kanji falied to be deleted',
          text: 'Failed to delete all kanji. Please try again later'
        })
      })

  }
}

/**
 * Function to open modal with current index
 */
function openDeleteFavModal(index) {
  makeModalAppear('delete-favourite')
  document.getElementById('curFavIndex').value = index
}

/**
 * Function to addd kanji
 */
async function addKanji() {
  const kanjiToAdd = document.getElementById('addKanjiTextBox').value
  if (kanjiToAdd.length > 1) {
    //swal(`Single kanji only`)
    Swal.fire({
     icon: 'error',
     title: 'Single Kanji Only',
     text: 'Please enter only 1 kanji'
   })
  } else {
    const encodedTextToAdd = encodeURIComponent(kanjiToAdd)

    const isFromDatabase = await fetch(`${BASE_URL}/getSingleKanji/${encodedTextToAdd}`)
      .then(resp => resp.json())
      .then(jsonResp => jsonResp)
      .catch(err => {
        console.error(err)
        return "gotError"
      })

    if (Object.is(isFromDatabase, "gotError")) {
      //alert('Check if kanji exists in database error. Try again later')
      Swal.fire({
       icon: 'error',
       title: 'Check kanji error',
       text: 'Check if kanji exists in database error. Try again later'
     })
      return
    }

    if (!Object.is(isFromDatabase, null)) {
      //alert('Kanji already exists in database. Enter another kanji not in database.')
      Swal.fire({
       icon: 'error',
       title: 'Kanji already exists in database',
       text: 'Kanji already exists in database. Please enter another kanji not in database.'
     })
      return
    }

    fetch(`${BASE_URL}/addKanji/${encodedTextToAdd}`, {
        method: 'POST'
      })
      .then(() => {
        getKanjiFromDatabase()
        addModalClose()
      })
      .catch(err => {
        console.error(err)
        Swal.fire({
         icon: 'error',
         title: 'Error adding kanji',
         text: 'Kanji failed to be added to database. Please try again later.'
       })
        addModalClose()
      })

  }

}

document.onload = getKanjiFromDatabase()