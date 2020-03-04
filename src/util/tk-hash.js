function shiftLeftOrRightThenSumOrXor (num, opArray) {
  return opArray.reduce((acc, opString) => {
    const op1 = opString[1]
    const op2 = opString[0]
    const xd = opString[2]

    const shiftAmount = hexCharAsNumber(xd)
    const mask = (op1 === '+') ? acc >>> shiftAmount : acc << shiftAmount

    return (op2 === '+') ? (acc + mask & 0xffffffff) : (acc ^ mask)
  }, num)
}

function hexCharAsNumber (xd) {
  return (xd >= 'a') ? xd.charCodeAt(0) - 87 : Number(xd)
}

function transformQuery (query) {
  const e = []

  for (let f = 0, g = 0; g < query.length; g++) {
    let l = query.charCodeAt(g)

    if (l < 128) {
      e[f++] = l
    } else if (l < 2048) {
      e[f++] = l >> 6 | 0xC0
      e[f++] = l & 0x3F | 0x80
    } else if ((l & 0xFC00) === 0xD800 && g + 1 < query.length && (query.charCodeAt(g + 1) & 0xFC00) === 0xDC00) {
      l = (1 << 16) + ((l & 0x03FF) << 10) + (query.charCodeAt(++g) & 0x03FF)
      e[f++] = l >> 18 | 0xF0
      e[f++] = l >> 12 & 0x3F | 0x80
      e[f++] = l & 0x3F | 0x80
    } else {
      e[f++] = l >> 12 | 0xE0
      e[f++] = l >> 6 & 0x3F | 0x80
      e[f++] = l & 0x3F | 0x80
    }
  }

  return e
}

function normalizeHash (encondindRound2) {
  if (encondindRound2 < 0) {
    encondindRound2 = (encondindRound2 & 0x7fffffff) + 0x80000000
  }

  return encondindRound2 % 1E6
}

export function calcHash (query, windowTkk) {
  const bytesArray = transformQuery(query)

  const d = windowTkk.split('.')
  const tkkIndex = Number(d[0]) || 0
  const tkkKey = Number(d[1]) || 0

  const encondingRound1 = bytesArray.reduce((acc, current) => {
    acc += current

    return shiftLeftOrRightThenSumOrXor(acc, ['+-a', '^+6'])
  }, tkkIndex)

  const encondingRound2 = shiftLeftOrRightThenSumOrXor(encondingRound1, ['+-3', '^+b', '+-f']) ^ tkkKey
  const normalizedResult = normalizeHash(encondingRound2)

  return normalizedResult.toString() + '.' + (normalizedResult ^ tkkIndex)
}
