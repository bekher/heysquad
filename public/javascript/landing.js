document.addEventListener('DOMContentLoaded',function(event){
  // array with texts to type in typewriter
  var dataText = [ "play basketball.",
                   "go to a hackathon.",  
                   "get chinese food.", 
                   "play Smash Bros.", 
                   "build a robot.", 
                   "get coffee.",
                   "go see a movie.", 
                   "go to the mall.", 
                   "talk politics." ];

  function typeDeleter(text, i, fnCallback) {
    if (i > 0) {
     // add next character to h1
     document.getElementById('description-action').innerHTML = text.substring(0, i-1) +'<span aria-hidden="true"></span>';

      // wait for a while and call this function again for next character
      setTimeout(function() {
        typeDeleter(text, i - 1, fnCallback)
      }, 60);
    }
    // text finished, call callback if there is a callback function
    else if (typeof fnCallback == 'function') {
      // call callback after timeout
      setTimeout(fnCallback, 10);
    }
  }

  // type one text in the typwriter
  // keeps calling itself until the text is finished
  function typeWriter(text, i, fnCallback) {
    // chekc if text isn't finished yet
    if (i < (text.length)) {
      // add next character to h1
     document.getElementById('description-action').innerHTML = text.substring(0, i+1) +'<span aria-hidden="true"></span>';

      // wait for a while and call this function again for next character
      setTimeout(function() {
        typeWriter(text, i + 1, fnCallback)
      }, 120);
    }
    // text finished, call callback if there is a callback function
    else if (typeof fnCallback == 'function') {
      // call callback after timeout
      setTimeout(fnCallback, 900);
    }
  }
  // start a typewriter animation for a text in the dataText array
   function StartTextAnimation(i) {
     if (typeof dataText[i] == 'undefined'){
        setTimeout(function() {
          StartTextAnimation(0);
        }, 0); // repeat
     }
     // check if dataText[i] exists
    if (i < dataText[i].length) {
      // text exists! start typewriter animation
     typeWriter(dataText[i], 0, function(){
      // delete the text
       typeDeleter(dataText[i], dataText[i].length, function(){
          // after callback (and whole text has been animated), start next text
          StartTextAnimation(i + 1);
       });
     });
    }
  }
  // start the text animation
  StartTextAnimation(0);
});