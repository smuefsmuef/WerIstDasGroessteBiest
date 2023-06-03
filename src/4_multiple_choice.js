d3.csv("./data/4_multiple_choice.csv").then(function (data) {
    var currentQuestion = 0;
    var score = 0;
    // Variablen deklarieren
    var questionElement = d3.select("#question");
    var optionsElement = d3.select("#options");
    var resultElement = d3.select("#result");

    // Funktion zum Anzeigen der nächsten Frage
    function showNextQuestion() {
        if (currentQuestion < data.length) {
            var questionData = data[currentQuestion];

            // Frage anzeigen
            questionElement.text(questionData.Question);

            // Antwortmöglichkeiten anzeigen
            var options = optionsElement.selectAll("div")
                .data(d3.range(1, 5))
                .join("div");

            // Radio Buttons für die Antwortmöglichkeiten
            var radioButtons = options.append("input")
                .attr("type", "radio")
                .attr("name", "answer")
                .attr("value", function (d) {
                    return d;
                });

            // Text für die Antwortmöglichkeiten
            options.append("span")
                .text(function (d) {
                    return questionData["Option" + d];
                });

            // Ereignishandler für die Antwortauswahl
            radioButtons.on("change", function (d) {
                var selectedOption = d3.select(this).attr("value");
                var correctAnswer = questionData.Answer;
                var resultText = "";

                if (selectedOption === correctAnswer) {
                    score++;
                    resultText = "Correct!";
                } else {
                    resultText = "Wrong!";
                }

                // Ergebnis anzeigen
                resultElement.text(resultText);

                // Nächste Frage anzeigen
                optionsElement.selectAll("div").remove(); // Vorherige Frage löschen
                currentQuestion++;
                setTimeout(showNextQuestion, 1000); // Verzögerung für die Anzeige der nächsten Frage
            });

            // Verhindern des Neuladens der Seite beim Absenden des Formulars
            d3.select("#quizForm").on("submit", function (event) {
                event.preventDefault();
            });
        } else {
            // Alle Fragen wurden beantwortet, Ergebnis anzeigen
            questionElement.node().textContent = "Quiz abgeschlossen!";
            optionsElement.selectAll("div").remove(); // Entfernen der Antwortmöglichkeiten
            resultElement.node().textContent = "Punktzahl: " + score + " / " + data.length;
        }
    }

    // Erste Frage anzeigen
    showNextQuestion();
});