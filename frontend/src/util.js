export const NON_HINT_CHARS = new Set(" /$_',.")
export const FREE_HINT_CHARS = new Set('rstlne')

export const GIVEN = '1'
export const GUESSED = '2'

export function addHints (haiku = [], letters = '') {
  const letterSet = new Set(letters)
  return haiku.map(haikuLetter =>
    letterSet.has(haikuLetter) || NON_HINT_CHARS.has(haikuLetter)
      ? haikuLetter
      : '*'
  )
}

export function charactersTo2DStringArray (characters = []) {
  return characters
    .slice(0, -2)
    .join('')
    .split(' / ')
    .map(line => line.split(' '))
}

export function addInputToHaiku (haiku = [], input = '') {
  const newHaiku = [...haiku]
  const meta = [...haiku]

  let haikuIndex = 0
  let inputIndex = 0

  while (haikuIndex < haiku.length) {
    if (haiku[haikuIndex] === '*' && inputIndex < input.length) {
      newHaiku[haikuIndex] = input[inputIndex]
      meta[haikuIndex] = GUESSED
      inputIndex++
    } if (haiku[haikuIndex].match(/[a-z\\'\\.]/)) {
      meta[haikuIndex] = GIVEN
    }
    haikuIndex++
  }

  return {
    characters: newHaiku,
    meta
  }
}

/*
* Returns a string of characters that can be given as hints for the censored haiku
* Each character returned will fill in a previously un-guessed or incorrectly guessed tile
*/
export function generateHintSequence (haiku = [], censoredHaiku = [], input = '') {
  const haikuWords = haiku.join('').split(' ')
  const haikuWithInputString = addInputToHaiku(censoredHaiku, input).characters.join('').split(' ')

  let index = 0
  for (let i = 0; i < haikuWords.length; i++) {
    const word = haikuWords[i]
    if (word !== haikuWithInputString[i]) {
      const missingChars = new Set()
      for (let j = 0; j < word.length; j++) {
        const char = haikuWords[i][j]
        // console.log({ char, _: censoredHaiku[index + j] })
        if (censoredHaiku[index + j] !== char) {
          missingChars.add(char)
        }
      }
      return [...missingChars].sort().join('')
    }
    index += word.length + 1
  }

  return ''
}

export function isSolved (censoredHaiku = [], haiku = '') {
  for (let i = 0; i < censoredHaiku.length; i++) {
    if (censoredHaiku[i] !== haiku[i]) {
      return false
    }
  }
  return true
}

export function isHintAllowed (haiku = '', censoredHaiku = []) {
  const remaining = new Set()

  for (let i = 0; i < censoredHaiku.length; i++) {
    if (censoredHaiku[i] === '*') {
      remaining.add(haiku[i])
      if (remaining.size > 4) return true
    }
  }
  return false
}

export function incrementWinStats ({ today, streakStart, streakEnd, totalWins = 0 } = {}) {
  // Prevent duplicate updates changing the totalWins twice
  if (today === streakEnd) {
    return { today, streakStart, streakEnd, totalWins }
  }

  const daysSinceStreakEnd = subtractDays(streakEnd, today)
  const isNewStreak = daysSinceStreakEnd > 1 || !streakStart
  const newStreakStart = isNewStreak
    ? today
    : streakStart

  const newStreakEnd = today

  return {
    today,
    streakStart: newStreakStart,
    streakEnd: newStreakEnd,
    totalWins: totalWins + 1
  }
}

export function subtractDays (start, end) {
  return (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
}

export function canAddInput (censoredHaiku = [], input = '') {
  const { characters } = addInputToHaiku(censoredHaiku, input)
  return characters.includes('*')
}
