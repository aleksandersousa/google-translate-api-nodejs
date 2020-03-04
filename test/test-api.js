const expect = require('chai').expect
const request = require('request')

describe('Status and content', () => {
  describe('Main page', () => {
    const rightUrl =
    'http://localhost:5000/api/v1/translation?sourceLang=en&targetLang=pt&text=test'

    it('response status', done => {
      request(rightUrl, (_error, response, body) => {
        expect(response.statusCode).to.equal(200)
        done()
      })
    })

    it('json translation content', done => {
      request(rightUrl, (_error, response, body) => {
        expect(JSON.parse(body).translation).to.equal('teste')
        done()
      })
    })

    it('json synonyms content', done => {
      request(rightUrl, (_error, response, body) => {
        expect(JSON.parse(body).synonyms).to.be.a('array')
        done()
      })
    })

    it('json originalResponse content', done => {
      request(rightUrl, (_error, response, body) => {
        expect(JSON.parse(body).originalResponse).to.be.a('array')
        done()
      })
    })
  })
})

describe('Handle errors', () => {
  it('invalid original language', done => {
    const errorUrlSourceLang =
    'http://localhost:5000/api/v1/translation?sourceLang=EN&targetLang=pt&text=test'

    const sourceLangErrorMessage = 'The language that want to translate is not supported.'

    request(errorUrlSourceLang, (_error, response, body) => {
      expect(response.statusCode).to.equal(400)
      expect(JSON.parse(body).response.languageError).to.equal(sourceLangErrorMessage)
      done()
    })
  })

  it('invalid goal language', done => {
    const errorUrlTargetLang =
    'http://localhost:5000/api/v1/translation?sourceLang=en&targetLang=PT&text=test'

    const targetLangErrorMessage = 'The translation goal language is not supported.'

    request(errorUrlTargetLang, (_error, response, body) => {
      expect(response.statusCode).to.equal(400)
      expect(JSON.parse(body).response.languageError).to.equal(targetLangErrorMessage)
      done()
    })
  })

  it('invalid both language', done => {
    const errorUrlBoth =
    'http://localhost:5000/api/v1/translation?sourceLang=EN&targetLang=PT&text=test'

    const bothErrorMessage = 'The language that want to translate is not supported.'
    request(errorUrlBoth, (_error, response, body) => {
      expect(response.statusCode).to.equal(400)
      expect(JSON.parse(body).response.languageError).to.equal(bothErrorMessage)
      done()
    })
  })

  it('Character limit reached', done => {
    const CHARACTER_LIMIT = 7400
    let randomText = ''

    for (let i = 0; i < CHARACTER_LIMIT; i++) {
      randomText += 'testing '
    }

    const url = 'http://localhost:5000/api/v1/translation?sourceLang=en&targetLang=pt&text=' + randomText

    request(url, (_error, response, body) => {
      expect(response).to.equal(undefined)
      done()
    })
  })
})
