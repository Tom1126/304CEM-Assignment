function resetPassword() {
  const newPassword = document.getElementById('newPasswordTextBox').value
  const confirmPassword = document.getElementById('confirmPasswordTextBox').value

  if (Object.is(newPassword, confirmPassword) &&
    (newPassword.trim() === '' && confirmPassword.trim() === '')) {
    const passwordObj = {
      "password": newPassword
    }

    const pathname = window.location.pathname

    console.log(pathname)

    /*
    fetch('http://localhost:3000/', {
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
  else {
    Swal.fire({
      icon: 'error',
      title: 'Passwords not same',
      text: 'Please ensure that both passwords are the same.'
    })
  }
  */
  }
}