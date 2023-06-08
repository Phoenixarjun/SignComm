
const Register = document.getElementById('register-page');
const Login = document.getElementById('login-page');
const signin = document.querySelector('#signin-link');
const registerin = document.querySelector('#register-link');


registerin.addEventListener('click',function(){
    Login.classList.toggle('not-visible');
    Register.classList.toggle('visible');
    Register.classList.add('visible');
    Register.classList.remove('not-visible');
})

signin.addEventListener('click',function(){
    Login.classList.toggle('visible');
    Register.classList.toggle('not-visible');
    Login.classList.add('visible');
    Login.classList.remove('not-visible');
})