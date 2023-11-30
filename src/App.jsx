import React from "react"
import Intro from "./Intro"
import Quiz from "./Quiz"

export default function App(){
    const [start, setStart] = React.useState(true)
    const [quizArr, setQuizArr] = React.useState([])
    const [selectedOptions, setSelectedOptions] = React.useState({})
    const [optionsArr, setOptionsArr] = React.useState({})
    const [correctAnswers, setCorrectAnswers] = React.useState({})
    const [isCheckingAnswers, setIsCheckingAnswers] = React.useState(false)
    const [score, setScore] = React.useState(0)
    
    
    function startQuiz(){
        setStart(prev => !prev)
        setIsCheckingAnswers(false)
        setSelectedOptions({})
        setScore(0)
    }
    
    function decodeHtml(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    
    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(data => {
                const updatedData = data.results.map(item => ({
                    ...item,
                    question: decodeHtml(item.question),
                    correct_answer: decodeHtml(item.correct_answer),
                    incorrect_answers: item.incorrect_answers.map(answer => decodeHtml(answer))
                }));
                setQuizArr(updatedData);
                const initialOptions = {}
                const answers = {}
                updatedData.forEach((item, index) => {
                    const options = shuffleArray([...item.incorrect_answers, item.correct_answer])
                    initialOptions[index] = options
                    answers[index] = item.correct_answer
                })
                setOptionsArr(initialOptions)
                setCorrectAnswers(answers)
            })
    }, [])
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function selectOption(questionId, option){
        setSelectedOptions(prev => {
            const newState = prev[questionId] === option ? 
                            { ...prev, [questionId]: null } : // Unselect if already selected
                            { ...prev, [questionId]: option } // Select the new option

            // console.log("Selected Options:", newState)
            return newState;
        })
    }
    
    function checkAnswers(){
        let newScore = 0;
        for (let questionId in selectedOptions) {
            if (selectedOptions[questionId] === correctAnswers[questionId]) {
                newScore++;
            }
        }
        setScore(newScore);
        setIsCheckingAnswers(true);
    }
    
    const quizElements = quizArr.map((item, index) => {
        return <Quiz 
                key={index}
                id={index}
                question={item.question} 
                options={optionsArr[index] || []}
                selectOption={selectOption}
                selectedOption={selectedOptions[index]}
                correctAnswer={correctAnswers[index]}
                isCheckingAnswers={isCheckingAnswers}
                />
    })
    
    
    return (
        <div className="container">
            <svg xmlns="http://www.w3.org/2000/svg" width="126" height="131" viewBox="0 0 126 131" fill="none" className="top-right-svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M63.4095 71.3947C35.1213 40.8508 -2.68211 11.7816 1.17274 -29.6933C5.43941 -75.599 39.854 -115.359 82.4191 -133.133C122.797 -149.994 170.035 -140.256 205.822 -115.149C235.947 -94.0141 236.823 -53.8756 246.141 -18.271C256.17 20.0508 282.521 60.8106 260.501 93.7792C237.538 128.159 188.991 133.432 147.931 128.768C112.318 124.723 87.7505 97.6768 63.4095 71.3947Z" fill="#FFFAD1"/>
            </svg>
            {start ? <Intro startQuiz={startQuiz}/> :
            <>
                {quizElements}
                {isCheckingAnswers ? 
                    <div className="results">
                        <p>You scored {score}/{quizArr.length} correct answers</p>
                        <button className="play-again-btn" onClick={startQuiz}>Play Again</button>
                    </div> :
                    <button className="check-btn" onClick={checkAnswers}>Check Answers</button>
                }
            </>
            }
            <svg xmlns="http://www.w3.org/2000/svg" width="65" height="62" viewBox="0 0 65 62" fill="none" className="bottom-right-svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M-38.919 2.96445C-10.8241 1.07254 20.4975 -5.87426 40.8434 11.5469C63.3629 30.8293 69.9281 62.0589 61.4141 88.8747C53.3376 114.313 28.2818 132.992 -0.0909882 140.475C-23.9759 146.775 -45.6063 132.093 -68.3914 123.11C-92.9153 113.441 -125.606 110.575 -133.794 87.7612C-142.333 63.9714 -124.677 39.0277 -104.912 21.3621C-87.7687 6.03978 -63.0936 4.59238 -38.919 2.96445Z" fill="#DEEBF8"/>
            </svg>
        </div>
    )
}