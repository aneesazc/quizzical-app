import React from "react"

export default function Quiz(props){
    const { question, options, id, selectOption, selectedOption, correctAnswer, isCheckingAnswers } = props

    function getOptionStyle(option){
        if (isCheckingAnswers) {
            // Styles for when answers are being checked
            if (option === selectedOption) {
                if (option === correctAnswer) {
                    return { background: '#94D7A2', border: "none"}; // Correct selection
                } else {
                    return { background: '#F8BCBC', opacity: 0.5, border: "none" }; // Incorrect selection
                }
            }
            if (option === correctAnswer) {
                return { background: '#94D7A2', border: "none"}; // Correct unselected option
            } else {
                return { opacity: 0.5 }; // Neither selected nor correct
            }
        } else {
            // Original styles for when selecting options
            return { 
                backgroundColor: selectedOption === option ? "#D6DBF5" : "transparent",
                cursor: 'pointer',
                border: selectedOption === option ? "none" : "1px solid #4D5B9E"
            };
        }
        return {}; // Default style
    }

    return (
        <div className="quiz">
            <h3>{question}</h3>
            {options.map((option, index) => (
                <div 
                    key={index}
                    onClick={() => !isCheckingAnswers && selectOption(id, option)}
                    style={getOptionStyle(option)}
                >
                    {option}
                </div>
            ))}
            <hr />
        </div>
    )
}
