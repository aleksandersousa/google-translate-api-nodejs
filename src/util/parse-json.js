export function getTranslation (data) {
  const translationSize = data[0].length
  let translation = ''

  for (let i = 0; i < translationSize; i++) {
    if (data[0][i][0] !== null) {
      translation += data[0][i][0]
    }
  }

  return translation
}

export function getSynonyms (data) {
  if (data[1] === null) {
    return []
  }

  const synonymsSize = data[1][0][1].length
  const synonyms = []

  for (let i = 0; i < synonymsSize; i++) {
    if (data[1][0][1][i] !== null) {
      synonyms[i] = data[1][0][1][i]
    }
  }

  return synonyms
}
