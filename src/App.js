//CSS
import './App.css';

// REACT
import { useCallback, useEffect, useState } from "react";

// COMPONENTS
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import Game from './components/Game';

// DATA
import { wordsList } from './data/words'


const stages = [ 
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessesQty = 3

function App() {
  const [ gameStage, setGameStage ] = useState(stages[0].name);
  const [ words ] = useState(wordsList);

  const [ pickedWord, setPickedWord ] = useState("")
  const [ pickedCategory, setPickedCategory ] = useState("")
  const [ letters, setLetters ] = useState([])

  const [ guessedLetters, setGuessedLetters ] = useState([])
  const [ wrongLetters, setWrongLetters ] = useState([])
  const [ guesses, setGuesses ] = useState(guessesQty)
  const [ score, setScore ] = useState(50)


  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words)
    const category = 
          categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log(category)

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    console.log(word)

    return { word, category }
  }, [words])
  
  // STARTS THe SECRET WORD GAME
  const startGame = useCallback(() => {
    // CLEAR ALL LETTERS
    clearLetterStates()

    // Pick word and pick category 
   const { word, category } = pickWordAndCategory()

   //CREATE AN ARRAY OF LETTERS
   let wordLetters = word.split("")

   wordLetters = wordLetters.map(( l ) => l.toLowerCase()) 

   console.log( word, category )
   console.log( wordLetters )

   // fill states 
   setPickedWord( word )
   setPickedCategory( category )
   setLetters( wordLetters )

    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  // PROCESS THE LETTER INPUT
  const verifyLetter = (letter) => {
    
    const normalizedLetter = letter.toLowerCase()

    // CHECK IF LETTER HAS ALREADY BEN UTILIZED  
    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter))
    {
      return;
    }

    // PUSH GUESSED LETTER OR REMOVE A GUESS
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters(( actualGuessedLetters ) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters(( actualWrongLetters ) => [
        ...actualWrongLetters,
        normalizedLetter,
      ])

      setGuesses(( actualGuesses ) => actualGuesses - 1)

    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  } 

  // CHECK IF GUESSES ENDED


  useEffect(() => {

    if( guesses <= 0 ) {
      // RESET ALL STATES

     setGameStage(stages[2].name) 

    }

  }, [guesses])


  // CHECK WIN CONDITION
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    // WIN CONDITION
    if(guessedLetters.length === uniqueLetters.length) {
      //ADD SCORE 
      setScore(( actualScore ) => actualScore += 100)

      // RESTART GAME WITH NEW WORD
      startGame()
      console.log(uniqueLetters)
    }
  }, [ guessedLetters, letters, startGame ])



  // Restarts the game 
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      { gameStage === 'start' && <StartScreen startGame={startGame} /> }
      { gameStage === 'game' && 
      <Game 
      verifyLetter={verifyLetter} 
      pickedWord={ pickedWord } 
      pickedCategory={ pickedCategory } 
      letters={ letters } 
      guessedLetters={ guessedLetters }
      wrongLetters = { wrongLetters }
      guesses = { guesses }
      score = { score }
      /> }
      { gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;