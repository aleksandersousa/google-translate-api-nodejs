import { Builder } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/firefox'

const URL = 'https://translate.google.com.br/'

export async function openBrowser () {
  const options = new Options()
  options.addArguments('-headless')

  const driver = new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build()

  await driver.get(URL)

  return driver
}
