 //Add modal open and close modal
 const BASE_URL = 'https://web-api-assignment-304cem.herokuapp.com'
 
 const addModal = document.querySelector('.add-main-modal');
 const addCloseButton = document.querySelectorAll('.add-modal-close');

 const addModalClose = () => {
   addModal.classList.remove('fadeIn');
   addModal.classList.add('fadeOut');
   setTimeout(() => {
     addModal.style.display = 'none';
   }, 500);
 }

 const openAddModal = () => {
   addModal.classList.remove('fadeOut');
   addModal.classList.add('fadeIn');
   addModal.style.display = 'flex';
 }

 for (let i = 0; i < addCloseButton.length; i++) {

   const elements = addCloseButton[i];

   elements.onclick = (e) => addModalClose();

   addModal.style.display = 'none';

   window.onclick = function (event) {
     if (event.target == addModal) addModalClose();
   }
 }

 //Edit modal open and close modal
 const editModal = document.querySelector('.edit-main-modal');
 const editCloseButton = document.querySelectorAll('.edit-modal-close');

 const editModalClose = () => {
   editModal.classList.remove('fadeIn');
   editModal.classList.add('fadeOut');
   setTimeout(() => {
     editModal.style.display = 'none';
   }, 500);
 }

 const openEditModal = () => {
   editModal.classList.remove('fadeOut');
   editModal.classList.add('fadeIn');
   editModal.style.display = 'flex';
 }

 for (let i = 0; i < editCloseButton.length; i++) {

   const elements = editCloseButton[i];

   elements.onclick = (e) => editModalClose();

   editModal.style.display = 'none';

   window.onclick = function (event) {
     if (event.target == editModal) editModalClose();
   }
 }

 //Delete modal open and close modal
 const deleteModal = document.querySelector('.delete-main-modal');
 const deleteCloseButton = document.querySelectorAll('.delete-modal-close');

 const deleteModalClose = () => {
   deleteModal.classList.remove('fadeIn');
   deleteModal.classList.add('fadeOut');
   setTimeout(() => {
     deleteModal.style.display = 'none';
   }, 500);
 }

 const openDeleteModal = encodedString => {
   deleteModal.classList.remove('fadeOut');
   deleteModal.classList.add('fadeIn');
   deleteModal.style.display = 'flex';

   console.log(encodedString)
   const deleteBtn = document.getElementById('deleteKanjiBtn')
   deleteBtn.onclick = () => {
     deleteKanji(encodedString)
   }
 }

 for (let i = 0; i < deleteCloseButton.length; i++) {

   const elements = deleteCloseButton[i];

   elements.onclick = (e) => deleteModalClose();

   deleteModal.style.display = 'none';

   window.onclick = function (event) {
     if (event.target == deleteModal) deleteModalClose();
   }
 }

 //Delete all modal
 const deleteAllModal = document.querySelector('.delete-all-main-modal');
 const deleteAllCloseButton = document.querySelectorAll('.delete-all-modal-close');

 const deleteAllModalClose = () => {
   deleteAllModal.classList.remove('fadeIn');
   deleteAllModal.classList.add('fadeOut');
   setTimeout(() => {
     deleteAllModal.style.display = 'none';
   }, 500);
 }

 const openAllDeleteModal = () => {
   deleteAllModal.classList.remove('fadeOut');
   deleteAllModal.classList.add('fadeIn');
   deleteAllModal.style.display = 'flex';

   const deleteBtn = document.getElementById('deleteAllKanjiBtn')
   deleteBtn.onclick = () => {
     deleteAllKanji()
   }
 }

 for (let i = 0; i < deleteAllCloseButton.length; i++) {

   const elements = deleteAllCloseButton[i];

   elements.onclick = (e) => deleteAllModalClose();

   deleteAllModal.style.display = 'none';

   window.onclick = function (event) {
     if (event.target == deleteAllModal) deleteAllModalClose();
   }
 }

 //Delete all modal end
 function loadKanjiFromSearch(kanji) {
   resetDiv('kanjisDiv')

   const kanjiArray = []
   kanjiArray.push(kanji)

   loadKanjisToDiv(kanjiArray)
 }

 /**
  * Function to get all kanji and load them at the html
  */
 async function getKanjiFromDatabase() {

   resetDiv('kanjisDiv')

   const kanjiList = await fetch(`${BASE_URL}/getAllKanji`).catch(err => null)
   const jsonKanjiList = Object.is(kanjiList, null) ? null : await kanjiList.json()
   if (Object.is(jsonKanjiList, null)) {
     //alert('Error loading kanjis from database')
     Swal.fire({
      icon: 'error',
      title: 'Error loading kanjis from database',
      text: 'Loading kanjis from database failed. Please try again later.'
    })
   } else {
     loadKanjisToDiv(jsonKanjiList.reverse())
   }

 }

 function resetDiv(id) {
   document.getElementById(id).innerHTML = ''
 }

 function createKanjiElement(kanji, index) {

   const kanjiListElement = `
  
                  <tr>
                      <th class="text-left text-gray-600">Kanji</th>
                      <td class="p-2 text-gray-100">${kanji.character}</td>
                      <td><input style="display: none;" type="text" id="newKanjiTextBox${index}" placeholder="Enter new single kanji" value="${kanji.character}"/></td>
                  </tr>
                  
                  <tr><td><br></td></tr>
                  
                  <tr>
                  <th class="text-left text-gray-600">Image</th>
                    <td class="p-2 text-gray-100"><img style="background:white;" width="64" height="64" src=${kanji.image} /></td>
                  </tr>
                  
                  <tr><td><br></td></tr>

                  <tr>
                  <th class="text-left text-gray-600">JLPT Level</th>
                    <td class="p-2 text-gray-100">${kanji.jlpt}</td>
                  </tr>
                  
                  <tr><td><br></td></tr>
                  
                  <tr>
                  <th class="text-left text-gray-600">Readings</th>
                    <td class="p-2 text-gray-100">${joinKanjiMeanings(kanji.readings)}</td>
                    <td><input style="display: none;" id="newReadingsTextBox${index}" type="text" placeholder="Enter new readings for kanji" value="${joinKanjiMeanings(kanji.readings)}"/></td>
                  </tr>
                  
                  <tr><td><br></td></tr>
                  
                  <tr>
                  <th class="text-left text-gray-600">Meanings</th>
                    <td class="p-2 text-gray-100">${joinKanjiMeanings(kanji.meanings)}</td>
                    <td><input style="display: none;" id="newMeaningsTextBox${index}" type="text" placeholder="Enter new meanings" value="${joinKanjiMeanings(kanji.meanings)}"/></td>
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

 function joinKanjiMeanings(readings) {
   let joinedString = ''
   for (const reading of readings) joinedString += `${reading}, `
   return joinedString.substring(0, joinedString.length - 2)
 }

 function loadKanjisToDiv(kanjiList) {
   const kanjisListDiv = document.getElementById('kanjisDiv')
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
    `
     kanjiListElement += createKanjiElement(kanjiList[i], i)
     kanjiListElement += `
    </tbody>
  </table>
  <br/>
  <div id="editAndDeleteDiv${i}" class="flex">
  <button id="editBtn" onclick='toggleEditVisibility(${true}, ${i})' class="pull-right bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Edit</button>
  <div class="px-3"></div>
  <button id="deleteBtn" onclick="openDeleteModal('${kanjiList[i].encodedString}')" class="pull-right bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">Delete</button>
  </div>
  <div style="display: none;" id="editBtnsDiv${i}" class="flex">
  <button id="editCancelBtn${i}" onclick="toggleEditVisibility(${false}, ${i})" class="pull-right bg-gray-500 hover:bg-gray-400 text-white font-semibold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded">Cancel</button>
  <div class="px-3"></div>
  <button onclick='updateToDatabase(${JSON.stringify(kanjiList[i])}, ${i})' id="editConfirmBtn${i}" onclick="" class="pull-right bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">Update</button>
  </div>
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

 function deleteKanji(encodedString) {
   fetch(`${BASE_URL}/deleteKanji/${encodedString}`, {
       method: 'DELETE'
     })
     .then(() => {
       getKanjiFromDatabase()
       deleteModalClose()
     })
     .catch(err => {
       //alert(`An error occured. Error: ${err}`)
       Swal.fire({
        icon: 'error',
        title: 'Error deleting kanji',
        text: 'Kanji failed to be deleted from database. Please try again later.'
      })
       deleteModalClose()
     })
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
     getKanjiFromDatabase()
   } else {
     const encodedString = encodeURIComponent(kanjiToSearch)
     console.log(`Encodedstring: ${encodedString}`)
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
          text: 'Kanji may not be in database. Please check and add to database if necessary.'
        })
        getKanjiFromDatabase()
       })
   }
 }

 async function deleteAllKanji() {
   fetch(`${BASE_URL}/deleteAllKanji`, {
       method: 'DELETE'
     })
     .then(response => {
       return response.json()
     })
     .then(jsonResponse => {
       const msgObj = jsonResponse
       if (msgObj['error']) {
         //alert(`Deletion error. Something went wrong. Please try again later`)
         Swal.fire({
          icon: 'error',
          title: 'Delete all kanjis failed',
          text: 'Deletion of all kanjis failed. Please try again later.'
        })
         deleteAllModalClose()
       } else {
         getKanjiFromDatabase()
         deleteAllModalClose()
       }
     })
     .catch(err => {
       //alert('Deletion error. Try again later.')
       Swal.fire({
        icon: 'error',
        title: 'Delete all kanjis failed',
        text: 'Deletion of all kanjis failed. Please try again later.'
      })
       console.error(err)
       deleteAllModalClose()
     })
 }

 /**
  * Function to toggle the edit buttons on or off
  * @param {Boolean} isVisible If the edit buttons should be visible
  * @param {Number} index The index of the current kanji
  */
 function toggleEditVisibility(isVisible, index) {

   const toBeDisplay = isVisible ? `` : `none`

   document.getElementById(`newKanjiTextBox${index}`).style.display = toBeDisplay
   document.getElementById(`newReadingsTextBox${index}`).style.display = toBeDisplay
   document.getElementById(`newMeaningsTextBox${index}`).style.display = toBeDisplay
   document.getElementById(`editBtnsDiv${index}`).style.display = toBeDisplay

   document.getElementById(`editAndDeleteDiv${index}`).style.display = isVisible ? 'none' : ''

 }

 /**
  * 
  * @param {*} kanjiObject 
  * @param {*} index 
  */
 async function updateToDatabase(kanjiObject, index) {

   const newKanjiObject = {
     ...kanjiObject
   }

   const checkEncodedString = newKanjiObject.encodedString
   let newEncodedString = document.getElementById(`newKanjiTextBox${index}`).value
   let encodedNewEncodedString = encodeURIComponent(newEncodedString)
   const newReadings = document.getElementById(`newReadingsTextBox${index}`).value
   const newMeanings = document.getElementById(`newMeaningsTextBox${index}`).value

   if (newEncodedString.length === 0) {
     alert('Please enter a single kanji.')
     Swal.fire({
      icon: 'error',
      title: 'Single kanji only',
      text: 'Please enter only 1 kanji.'
    })
     return
   }

   if (newEncodedString.length === 1) {


     if (Object.is(encodedNewEncodedString, checkEncodedString)) {

       const readingsArray = []
       readingsArray.push(newReadings)
       newKanjiObject.readings = readingsArray

       const meaningsObject = newMeanings.split(',')

       newKanjiObject.meanings = meaningsObject

       console.log(newKanjiObject)

       fetch(`${BASE_URL}/updateKanji/${newKanjiObject.encodedString}`, {
           method: "PUT",
           body: JSON.stringify(newKanjiObject),
           headers: {
             "Content-Type": "application/json;charset=utf-8"
           }
         })
         .then(result => {
           console.log(`Success`)
           console.log(result)
           toggleEditVisibility(false, index)
           getKanjiFromDatabase()
         })
         .catch(err => {
           //alert('Update to database error. Try again later')
           Swal.fire({
            icon: 'error',
            title: 'Update kanji failed',
            text: 'Kanji failed to be updated. Please try again later.'
          })
           console.error(err)
         })

     } else {

       newKanjiObject.encodedString = encodedNewEncodedString

       const isFromDatabase = await fetch(`${BASE_URL}/getSingleKanji/${newEncodedString}`)
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
          title: 'Check kanji failed',
          text: 'Kanji failed to be checked from database. Please try again later.'
        })
         return
       }

       if (!Object.is(isFromDatabase, null)) {
         //alert('Kanji already exists in database. Enter another kanji not in database.')
         Swal.fire({
          icon: 'error',
          title: 'Kanji already exists',
          text: 'Kanji already exists in database. Please enter another kanji not found in database.'
        })
         return
       }

       const newKanjiDetails = await fetch(`${BASE_URL}/getKanjiDetails/${newKanjiObject.encodedString}`)
         .then(resp => {
           return resp.json()
         })
         .then(jsonResp => jsonResp)
         .catch(err => null)

       if (Object.is(newKanjiDetails, null)) {
         //alert('Invalid kanji. Please enter a valid one and try again')
         Swal.fire({
          icon: 'error',
          title: 'Failed to get kanji details',
          text: 'Kanji details failed to be retrieved. Please try again later.'
        })
         return
       }

       const newKanjiExamples = await fetch(`${BASE_URL}/getKanjiExamples/${newKanjiObject.encodedString}`)
         .then(resp => resp.json())
         .then(jsonResp => jsonResp)
         .catch(err => null)

       if (Object.is(newKanjiExamples, null)) {
         //alert('Invalid kanji. Please enter a vaid one and try again')
         Swal.fire({
          icon: 'error',
          title: 'Delete all kanjis failed',
          text: 'Deletion of all kanjis failed. Please try again later.'
        })
         return
       }

       newKanjiObject.kanjiExamples = newKanjiExamples.examples
       newKanjiObject.image = newKanjiExamples.image
       newKanjiObject.character = newKanjiDetails.kanji
       newKanjiObject.jlpt = newKanjiDetails.jlpt
       newKanjiObject.meanings = newKanjiDetails.meanings
       newKanjiObject.readings = newKanjiDetails.on_readings

       fetch(`${BASE_URL}/updateKanji/${checkEncodedString}`, {
           method: "PUT",
           body: JSON.stringify(newKanjiObject),
           headers: {
             "Content-Type": "application/json;charset=utf-8"
           }
         })
         .then(result => {

           getKanjiFromDatabase()
         })
         .catch(err => {
           //alert('Update to database error. Try again later')
           Swal.fire({
            icon: 'error',
            title: 'Update to database failed',
            text: 'Update to database failed. Please try again later.'
          })
           console.error(err)
         })

     }

   } else {
     //alert('Please enter only 1 kanji.')
     Swal.fire({
      icon: 'error',
      title: 'Single kanji only',
      text: 'Please enter only 1 kanji.'
    })
    }

 }

 /**
  * Function to logout
  */
 function logout() {

  sessionStorage.removeItem('token')
  sessionStorage.removeItem('isLogined')
  sessionStorage.removeItem('userType')
  document.location.href = '/client'

}

 document.onload = getKanjiFromDatabase()