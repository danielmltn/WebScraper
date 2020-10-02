import express from 'express'
import fetch from 'isomorphic-fetch'
import { JSDOM } from 'jsdom'

const app = express()

// guide: https://medium.com/@bretcameron/how-to-build-a-web-scraper-using-javascript-11d7cd9f77f2

app.get('/', async (req, res) => {
  const site = 'https://www.ameriprise.com'
  const results = await scrape(site)
  res.send(results)
})

app.listen(8000, () => {
  console.log('Starting up!')
})

function validateUrl(url) {
  return url && url.includes('http')
}

async function scrape(url) {
  let results
  if(!validateUrl(url)) {
    results = `your URL of ${url} is not a valid URL`
  }

  const response = await fetch(url)
  const text = await response.text()

  const dom = new JSDOM(text)
  const document = dom.window.document
  const queryExternalLinks = (tag = 'a', attribute = 'href') => {
    const gatheredLinks = []
    const elements = document.querySelectorAll(tag)
    if (elements) {
      elements.forEach(element => {
        gatheredLinks.push(element[attribute])
      })
    }
    return gatheredLinks
  }
  results = gatherResults(queryExternalLinks) 
  return results
}

function gatherResults(queryFunc = () => {}) {
  const allAElements = queryFunc('a', 'href')
  const allImgElements = queryFunc('img', 'src')
  const allSvgElements = queryFunc('svg', 'src')

  let results = `
  A tag finds: ${allAElements.length} <br/> 
  Img tag finds: ${allImgElements.length} <br/>
  Svg tag finds: ${allSvgElements.length} <br/>
  Total finds: ${allAElements.length + allImgElements.length + allSvgElements.length} 
  <br/> <br/> <br/>
  `

  const appendElements = (elementList) => {
    elementList.forEach(element => {
      results += element + '<br/>'
    })
  }

  appendElements([...allAElements, ...allImgElements, ...allSvgElements])

  return results
}