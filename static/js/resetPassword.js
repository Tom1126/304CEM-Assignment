const BASE_URL = `https://web-api-assignment-304cem.herokuapp.com`

function resetPassword() {
  const newPassword = document.getElementById('newPasswordTextBox').value
  const confirmPassword = document.getElementById('confirmPasswordTextBox').value

  if (Object.is(newPassword, confirmPassword) &&
    (newPassword.trim() !== '' && confirmPassword.trim() !== '')) {
    const passwordObj = {
      "password": newPassword
    }

    const pathname = window.location.pathname

    const pathnameArr = pathname.split('/')

    const userId = pathnameArr[2]
    const token = pathnameArr[3]
    
    fetch(`${BASE_URL}/receiveNewPassword/${userId}/${token}`, {
        method: "POST",
        body: JSON.stringify(passwordObj),
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      })
      .then(result => result.json())
      .then(jsonResult => {
        

        Swal.fire({
          icon: 'success',
          title: 'Password change success',
          text: 'Password changed successfuly. Now redirecting to home page...'
        })
        document.location.href = '/client' 

      })
      .catch(err => {
        console.error(err)
      })
  
    } else {
   
      Swal.fire({
      icon: 'error',
      title: 'Passwords not same',
      text: 'Please ensure that both passwords are the same.'
    })
  }