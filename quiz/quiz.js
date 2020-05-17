const startButton = document.querySelector('#start-btn')
const nameInput = document.getElementById('name-input')
const nameInputDiv = document.querySelector('.input')
const nextButton = document.querySelector('#next-btn')
const questionContainerElement = document.querySelector('#question-container')
const questionElement = document.querySelector('#question')
const answerButtonsElement = document.querySelector('#answer-buttons')
var points = [0,0,0,0];
var cas = {};
var shuffledQuestions, currentQuestionIndex;
var jmeno; 

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  cas.start = Date.now();
  jmeno = nameInput.value
  startButton.classList.add('hide')
  nameInputDiv.classList.add('hide')
  shuffledQuestions = otazky.sort(() => Math.random() - .5)
  currentQuestionIndex = 0
  questionContainerElement.classList.remove('hide')
  setNextQuestion()
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(otazka) {
  questionElement.innerText = otazka.otazka
  otazka.odpovedi.forEach(odpovedi => {
    const button = document.createElement('button')
    button.innerText = odpovedi.text
    button.classList.add('btn')
    if (odpovedi.spravne) {
      button.dataset.correct = odpovedi.spravne
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  bodySetStatusClass(document.body, correct)
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct)
  })
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    startButton.innerText = 'Restartovat'
    startButton.classList.remove('hide')
    var resetBtn = startButton.outerHTML;
    startButton.outerHTML = "<a href='quiz.html'>" + resetBtn + "</a>"
    startButton.removeEventListener('click', startGame)
    var celkem = 0;
    for (let c = 0; c < points.length; c++) {
      celkem += points[c];
    }
    if (celkem >= otazky.length - 1) {
      var text = 'Gratulujeme, tvůj výsledek byl úžasný, tvá známka je 1.'
    } else if (celkem >= otazky.length - 3) {
      var text = 'Gratulujeme, tvůj výsledek byl pěkný, tvá známka je 2.'
    } else if (celkem >= otazky.length - 5) {
      var text = 'Tvůj výsledek nebyl moc pěkný, měl by ses více naučit o výživě, tvá známka je 3.'
    } else if (celkem >= otazky.length - 7) {
      var text = 'Tvůj výsledek byl špatný, měl by ses více naučit o výživě, tvá známka je 4.'
    } else {
      var text = 'Tvůj výsledek byl velice špatný, měl by ses naučit jak se lépe stravovat, tvá známka je 5.'
    }
    cas.end = Date.now();
    cas.rozdil = cas.end - cas.start
    cas.rozdil /= 1000; 
    var stav = celkem + '/' + otazky.length + ' správných odpovědí\nZa ' + cas.rozdil + ' sekund\n\n' + text
    $.ajax({
      url : 'zapis-quiz.php',
      type : 'POST',
      data : {
        cas: cas.rozdil,
        jmeno: jmeno,
        body: celkem + '/' + otazky.length
      }
    });
    alert(stav);
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function bodySetStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
    if (!points[currentQuestionIndex]) {
      points[currentQuestionIndex] = 1;
      console.log(points[currentQuestionIndex]);
    } 
  } else {
    element.classList.add('wrong')
    if (!points[currentQuestionIndex]) {
      points[currentQuestionIndex] = 0;
      console.log(points[currentQuestionIndex]);
    } 
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}