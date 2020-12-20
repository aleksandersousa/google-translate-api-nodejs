export async function getTKK (browser) {
  const TKK = await browser.executeScript('return window.TKK')
  return TKK
}
