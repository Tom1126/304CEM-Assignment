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

   const kanjiList = await fetch('http://localhost:3000/getAllKanji').catch(err => null)
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
     kanjiListElement += createKanjiElement(kanjiList[i])
     kanjiListElement += `
    </tbody>
  </table>
  <br/>
  
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
     //alert('Enter only 1 kanji.')
     Swal.fire({
      icon: 'error',
      title: 'Single kanji only',
      text: 'Please enter only 1 kanji.'
    })
    } 
   else if(kanjiToSearch.length === 0) {
     getKanjiFromDatabase()
   }
   else {
     const encodedString = encodeURIComponent(kanjiToSearch)
     console.log(`Encodedstring: ${encodedString}`)
     fetch(`http://localhost:3000/getSingleKanji/${encodedString}`)
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

 document.onload = getKanjiFromDatabase()