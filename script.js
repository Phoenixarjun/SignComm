const toggleBtn = document.querySelector('.toggle_btn');
const navbar = document.querySelector('.navbar');
const learnMore = document.querySelector('#LearnMoreBtn');
const heroPara = document.querySelector('.heroPara');
toggleBtn.addEventListener('click',function(){
    navbar.classList.toggle('open');
})
learnMore.addEventListener('click',function(){
    heroPara.classList.toggle('show');
})



