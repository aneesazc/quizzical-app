import React from "react"

export default function Intro(props){
    return (
        <div className="intro">
            <h2>Quizzical</h2>
            <p>Welcome to the ultimate Quiz</p>
            <button onClick={props.startQuiz}>Start Quiz</button>
        </div>
    )
}