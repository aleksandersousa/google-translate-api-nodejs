import express from 'express'
import { getTranslation, getSynonyms } from '../util/parse-json'

const app = express()

export function startServer (translate) {
  app.listen(5000, (err) => {
    if (err) {
      return console.log(`failed to open server with error: ${err}`)
    }
    console.log('server running on port 5000')
  })

  app.get('/api/v1/translation', (req, res) => {
    const sourceLang = req.query.sourceLang
    const targetLang = req.query.targetLang
    const text = req.query.text

    async function getData () {
      const data = JSON.parse(await translate(sourceLang, targetLang, text))

      if (data.languageError === undefined) {
        const translation = getTranslation(data)
        const synonyms = getSynonyms(data)

        res.status(200).json({
          translation: translation,
          synonyms: synonyms,
          originalResponse: data
        })
      } else {
        res.status(400).json({
          response: data
        })
      }
    }
    getData()
  })
}
