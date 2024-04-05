
import axios from "axios"
import { extractPrice , extractDescription , extractCurrency } from "../utils"
import * as cheerio from "cheerio"


export const scrapeAmazonProduct = async ( url : string ) =>{
    const brightDataUserName = String(process.env.BRIGHT_DATA_USERNAME)
    const brightDataPassword = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const sessionId = (100000 * Math.random()) | 0;


    const options = {
          auth : {
              username : `${brightDataUserName}-session-${sessionId}`,
              password : brightDataPassword 
          },
          host : "brd.superproxy.io",
          port : port ,
          rejectUnauthorized : false 
    }

    try {


        const res  = await axios.get(url , options)
        const $ =  await cheerio.load(res.data);
        const title = $('#productTitle').text()
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
          );


       const originalPrice = extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')
      );
  
      const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
  

    const images = 
    $('#imgBlkFront').attr('data-a-dynamic-image') || 
    $('#landingImage').attr('data-a-dynamic-image') ||
    '{}'

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($('.a-price-symbol'))
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    const description = extractDescription($)

    const data = {
        url,
        currency: currency || '$',
        image: imageUrls[0],
        title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice),
        priceHistory: [],
        discountRate: Number(discountRate),
        category: 'category',
        reviewsCount:100,
        stars: 4.5,
        isOutOfStock: outOfStock,
        description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
      }
  
      console.log(data)
      return data;


    }catch(err :any ){
         throw new Error(`Failded to scrape product ${err.message}`)
    }
}