import { JSDOM } from 'jsdom'
import { stringify } from 'querystring'
import { openBrowser } from './browser/init-browser'
import { getTKK } from './browser/tkk-scrapper'
import { calcHash } from './util/tk-hash'
import { isSupported } from './util/languages'
import { startServer } from './server/server'

let browser, tkk
const URL = 'https://translate.google.com.br/translate_a/single'

async function translate (sourceLang, targetLang, text) {
  if (!isSupported(sourceLang)) {
    return `{
      "languageError": "The language that want to translate is not supported."
    }`
  } else if (!isSupported(targetLang)) {
    return `{
      "languageError": "The translation goal language is not supported."
    }`
  }

  const tkHash = calcHash(text, tkk)
  const data = {
    client: 'webapp',
    sl: sourceLang,
    tl: targetLang,
    dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't', 'gt'],
    otf: '1',
    ssel: '0',
    tsel: '0',
    xid: '1782844',
    kc: '1',
    tk: tkHash,
    q: text
  }

  const urlQueryString = URL + '?' + stringify(data)

  await browser.get('view-source:' + urlQueryString)

  const dom = new JSDOM(await browser.getPageSource())

  return dom.window.document.querySelector('pre').textContent
}

async function start () {
  console.log('opening server...')

  browser = await openBrowser()
  tkk = await getTKK(browser)

  startServer(translate)
}

start()
