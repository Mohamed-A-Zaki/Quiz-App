let content = document.querySelector(".quiz-app .content");
let submit_btn = document.querySelector(".quiz-app .submit");
let current_question_number = 0;
let right_answers = 0;

axios
  .get("json/main.json")
  .then(({ data }) => {
    // show number of qyestions
    let q_count_span = document.querySelector(".quiz-app .info .count span");
    q_count_span.innerHTML = data.length;

    return data;
  })
  .then((data) => {
    // create bullets function
    createBullets(data);

    return data;
  })
  .then((data) => {
    // triger createQuestion function
    createQuestion(data);

    return data;
  })
  .then((data) => {
    submit_btn.onclick = function () {
      // triger checkAnswer function
      if (current_question_number < data.length) checkAnswer(data);

      // increase current_question_number
      current_question_number++;

      // triger activeBullets function to add active to cuurent bullet
      activeBullets(data);

      // triger createQuestion function
      if (current_question_number < data.length) createQuestion(data);

      // triger showResult function
      if (current_question_number >= data.length) showResult(data);
    };

    return data;
  })
  .then((data) => {
    // triger timing function
    timing(data, 150);

    return data;
  });

function createQuestion(data) {
  content.innerHTML = "";
  /******************* start create question *************************** */
  let question = document.createElement("div");
  question.className = "question";
  // create question number element
  let q_num_span = document.createElement("span");
  q_num_span.className = "number";
  q_num_span.innerHTML = current_question_number + 1;
  // append question number element
  question.appendChild(q_num_span);
  // Add question text
  let q_text = document.createTextNode(data[current_question_number].title);
  // append question text
  question.appendChild(q_text);
  // appned question element to content
  content.appendChild(question);
  /******************* end create question ***************************** */

  /******************* start create answers *************************** */
  let answers = document.createElement("div");
  answers.className = "answers";

  for (let i = 0; i < 4; i++) {
    // create choice element
    let div = document.createElement("div");

    // create input field
    let input = document.createElement("input");
    input.setAttribute("type", "radio");
    input.setAttribute("name", "chice");
    input.setAttribute("id", `answer_${i + 1}`);
    div.appendChild(input);

    // if (i === 0) input.checked = true;

    // create label
    let label = document.createElement("label");
    label.setAttribute("for", `answer_${i + 1}`);
    label.textContent = data[current_question_number][`answer_${i + 1}`];
    div.appendChild(label);

    answers.appendChild(div);
  }

  content.appendChild(answers);
  /******************* end create answers ***************************** */
}

function checkAnswer(data) {
  let radios = document.querySelectorAll(".content .answers div input");

  radios.forEach((element) => {
    if (element.checked === true) {
      // get user answer
      let user_ans = element.nextElementSibling.textContent;
      // get right answer
      let right_ans = data[current_question_number].right_answer;

      // compare user answer with right answer
      if (user_ans === right_ans) {
        right_answers++;
        console.log("true");
        console.log(right_answers);
      } else {
        console.log("false");
        console.log(right_ans);
      }
    }
  });
}

function createBullets(data) {
  // show bullets
  let bullets = document.querySelector(".quiz-app .indicator .bullets");
  for (let i = 0; i < data.length; i++) {
    // create span
    let span = document.createElement("span");
    // first span => active
    if (i === 0) span.className = "active";
    // append span in bullets element
    bullets.appendChild(span);
  }
}

function activeBullets(data) {
  // get all bullets
  let bullets = document.querySelectorAll(".indicator .bullets span");
  // add active class to current bullet
  if (current_question_number < data.length) {
    bullets[current_question_number].className = "active";
  }
}

function showResult(data) {
  // remove question after finish
  content.innerHTML = "<div class='finish'>Quiz Finished</div>";

  // remove indicator
  let indicator = document.querySelector(".quiz-app .indicator");
  indicator.remove();
  // rermove submit button
  submit_btn.remove();

  // show result box
  let result = document.querySelector(".quiz-app .result");
  result.style.display = "block";

  // add scored points
  let scored = document.querySelector(".quiz-app .result span.scored");
  scored.innerHTML = right_answers;

  // add totol number of questions
  let total = document.querySelector(".quiz-app .result span.total");
  total.innerHTML = data.length;

  // add status [ good or bad ]
  let status = document.querySelector(".quiz-app .result .status");
  if (right_answers < data.length / 2) {
    status.innerHTML = "Bad";
    status.classList.add("bad");
    scored.classList.add("bad");
  } else if (right_answers < data.length) {
    status.innerHTML = "Good";
  } else {
    status.innerHTML = "Perfect";
  }
}

function timing(data, seconds_number) {
  // set minutes
  let minutes = document.querySelector(".minutes");
  minutes.innerHTML = Math.trunc(seconds_number / 60);
  // set secondes
  let seconds = document.querySelector(".seconds");
  seconds.innerHTML = seconds_number % 60;

  let time = setInterval(() => {
    // check first if seconds == 0 before decrease its value
    if (seconds.innerHTML == 0) {
      seconds.innerHTML = "60";
      minutes.innerHTML--;
    }

    // decrease seconds
    seconds.innerHTML--;

    if (minutes.innerHTML == 0 && seconds.innerHTML == 0) {
      // clear interval
      clearInterval(time);
      // triger showResult function
      showResult(data);
    }

    seconds.innerHTML =
      seconds.innerHTML < 10 ? `0${+seconds.innerHTML}` : seconds.innerHTML;

    minutes.innerHTML =
      minutes.innerHTML < 10 ? `0${+minutes.innerHTML}` : minutes.innerHTML;
  }, 1000);
}
