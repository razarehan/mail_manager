const email = document.getElementById('user_email').textContent
document.querySelector('.admin-function').style.display = 'none';

if(email.includes('admin')) {
  document.querySelector('.admin-function').style.display = 'block';
}
