export { hideScrollUpBtn };

function hideScrollUpBtn() {
  let scroll = window.pageYOffset;

  const scrollUpButton = document.querySelector('.scroll-up-btn');

  if (scroll > 300) {
    scrollUpButton.classList.remove('scroll-up-btn--show');
    return;
  }
  scrollUpButton.blur();
  scrollUpButton.classList.add('scroll-up-btn--show');
}
