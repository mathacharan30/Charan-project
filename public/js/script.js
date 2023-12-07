//this is the js logic for the error meassage for the form validation 
//ths is taken from the bootstrap and added in the boilerplate code
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false);
    });
  })();
  //this adds custom validation from boot strap to the forms where class is mentioned as needs-validation
  