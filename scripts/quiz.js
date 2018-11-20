var quesEl = document.getElementById('quiz-ques');
var optionsEl = document.getElementsByClassName('option');
var scoresEl = document.getElementById('scores');
var timerEl = document.getElementById('timer');
var currentCategoryEl = document.getElementById('score-category')
var chances=1,points=0,correct=0,timer=0,time,allInfo=[],totalQues=0,shuffledArr,correctOption,width=0,maxScore=0,ratio=0;



var newArr = [];
(window.location.search).slice(1).split('&').forEach((arr)=>{
	var arrIndex = arr.indexOf('=');
	newArr.push(arr.slice(arrIndex+1));
})
var user_name = newArr[0];

function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function resultNav() {
	ratio = (correct/(totalQues-1))*100;
	ratio = ratio.toPrecision(2);
if(ratio==NaN)ratio=0;

  document.getElementById("resultNav").style.height = "100%";
  document.getElementById('greet').style.marginTop = '80px;'
  document.getElementById('greet').innerHTML = `Thank You <ins>${user_name}</ins> for playing the game!!`;
  document.getElementById('showScore').innerHTML = `You got ${ratio}% questions right <br> Keep on Working!!!  :)`
}

function closeResultNav() {
  document.getElementById("resultNav").style.height = "0%";
}

const quizGenerator = async () =>{
	const response = await fetch(`https://opentdb.com/api.php?amount=${Number(newArr[2])}&category=${Number(newArr[1])}&difficulty=${newArr[3]}&type=multiple`);
	 if(response.status===200){
	 	let data = await response.json();
	 	var i;
	 	for(i=0;i<Number(newArr[2]);i++){
	 		var options = data.results[i].incorrect_answers;
	 		options.push(data.results[i].correct_answer);
	 		information = {
	 			category:data.results[i].category,
	 			question:data.results[i].question,
	 			all_options:options,
	 			correct_option:data.results[i].correct_answer
	 		}
	 		allInfo.push(information);
	 	}
	}
	quizShow();
}
maxScore = localStorage.getItem('max-score');

const quizShow = () => {
	timer=0;
	if(totalQues<Number(newArr[2])){
		if(points<0)points==0;
		scoresEl.innerHTML = `Scores : ${points}`;
	 	chances=1;

	 	quesEl.innerHTML = `${allInfo[totalQues].question}`;
	 	currentCategoryEl.innerHTML = ` <ins>Category</ins> : <bold>${allInfo[totalQues].category}</bold>`
	 	function shuffle(array) {
				  var currentIndex = array.length, temporaryValue, randomIndex;
				  while (0 !== currentIndex) {
				    randomIndex = Math.floor(Math.random() * currentIndex);
				    currentIndex -= 1;
				    temporaryValue = array[currentIndex];
				    array[currentIndex] = array[randomIndex];
				    array[randomIndex] = temporaryValue;
				  }
				 return array; 
		}
		correctOption = allInfo[totalQues].correct_option;
		shuffledArr = shuffle(allInfo[totalQues].all_options);
		var i;
		for(i=0;i<4;i++){
	 		optionsEl[i].innerHTML = `${shuffledArr[i]}`;
	 		optionsEl[i].style.backgroundColor = '#4E9DB4';
	 	}
	}
	if(totalQues==(Number(newArr[2]))-1){
		document.getElementById('next').innerHTML = `Results!`;
	}
	totalQues+=1;
	if(totalQues>(Number(newArr[2]))){
		timerEl.style.display = 'none';
		document.getElementById('next').addEventListener(onclick,resultNav());
	}	
	timer = 0;
	 time = setInterval(()=>{
		timer+=1;
		timerEl.innerHTML = `Timer : ${timer}s`;
		if(timer>=15){
			if(points<=0)points=0;
			else points-=5;
			scoresEl.innerHTML = `Scores : ${points}`;
			clearInterval(time);
			chances--;
			var index = shuffledArr.indexOf(correctOption);
			optionsEl[index].style.backgroundColor = 'green';
			optionsEl[index].classList.add('style');
		}
	},1000);
}

function move() {
    var elem = document.getElementById("myBar"); 
    		var inc = 100/Number(newArr[2]);
            width+=inc; 
            if(width>=100){
            	width=100;
            }	
            elem.style.width = width + '%'; 
            elem.innerHTML = width * 1 + '%';
     } 

 function check(value){
 	clearInterval(time);
		if(value===correctOption){
			chances--;
			if(!chances){
				correct++;
				points+=10;
				scoresEl.innerHTML = `Scores : ${points}`;
			}
		return 'green'
		}
		else{
			chances--;
			var index = shuffledArr.indexOf(correctOption);
			optionsEl[index].style.backgroundColor = 'green';
			optionsEl[index].classList.add('style');
			if(!chances){
				if(points==0)points=0;
				else if(points<0)points=0;
				else points-=5;
				scoresEl.innerHTML = `Scores : ${points}`;
			return '#D60707'	
			}	
		}	
}