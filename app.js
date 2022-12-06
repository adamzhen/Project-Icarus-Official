// Creating scroll animations

// 
const observer0 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('show0');
    } else {
      entry.target.classList.remove('show0');
    }
  });
});
const hiddenElements0 = document.querySelectorAll('.hidden0')
hiddenElements0.forEach((el) => observer0.observe(el));

// Fade in from left
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
});
const hiddenElements = document.querySelectorAll('.hidden')
hiddenElements.forEach((el) => observer.observe(el));

// Fade in from below
const observer2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('show2');
    } else {
      entry.target.classList.remove('show2');
    }
  });
});
const hiddenElements2 = document.querySelectorAll('.hidden2')
hiddenElements2.forEach((el) => observer2.observe(el));

// Special fade in for inner camera view in WISPR section
const observerInner = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('showInner');
    } else {
      entry.target.classList.remove('showInner');
    }
  });
});
const hiddenElementsInner = document.querySelectorAll('.hiddenInner')
hiddenElementsInner.forEach((el) => observerInner.observe(el));

// Special fade in for inner camera view in WISPR section
const observerOuter = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting){
      entry.target.classList.add('showOuter');
    } else {
      entry.target.classList.remove('showOuter');
    }
  });
});
const hiddenElementsOuter = document.querySelectorAll('.hiddenOuter')
hiddenElementsOuter.forEach((el) => observerOuter.observe(el));