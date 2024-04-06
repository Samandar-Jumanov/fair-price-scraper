"use server";

import Product from "../model/product.model";
import { connectDb } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper/index"
import { getLowestPrice , getHighestPrice , getAveragePrice } from "../utils";
import { revalidatePath } from "next/cache";
import { User } from "@/types/index";
import { generateEmailBody, sendEmail } from "../nodemailer/nodemailer";


export async function scrapeAndStoreProduct(productUrl: string) {
  if(!productUrl) return;

  try {
    connectDb();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if(!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if(existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice }
      ]

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    console.log(error.message)
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}



export const getProductById = async (  productId : string ) =>{
      connectDb()


      try {

        const product = await Product.findOne({
             id : productId 
        })



        if(!product) {
            throw new Error("Product not found ")
        }


        return product
      }catch(err : any ){
           console.log({
             errorGettingSingle : err.message
           })
      }
}



export const getAllProducts = async ( ) =>{
   connectDb();

     try {

      const allProducts = await Product.find()
      return allProducts

     }catch( error : any ){
          console.log({
            getAllProductsError :  error.message
          })
        throw new Error(error.message)
     }

}


export const addUserEmailToProduct = async ( productId : string , email : string ) =>{

        try {

          const product = await Product.findById(productId);

          if(!product) return;


          const isUserExists = await product.users.find(( user : User ) => user.email === email);

          if(!isUserExists) {
               await product.users.push({ email : email})
          };


          const emailContent = await generateEmailBody(product , "WELCOME")

          await sendEmail(emailContent , [email])

        }catch(err : any ){
            console.log({
              userEmail : err.message
            })


            throw new Error(err.message)
        }
}