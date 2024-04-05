import Image from "next/image";
import { CgArrowRightO } from "react-icons/cg";
import Searchbar from "@/components/SearchBar";
import  HeroCarousel from "@/components/Hero";
import { getAllProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard";
export default  async  function Home() {

  const allProducts = await getAllProducts();
  return (
     <>
        <section className="px-6 border-2 md:px-20 py-24 border-green-600">
          <div className="flex max-xl:flex-col gap-16">
            <div className="fex flex-col justify-center">
                  <p className="small-text cursor-pointer">
                       Small shopping starts here  < CgArrowRightO />
                  </p>


                  <h1 className="head-text">
                      Unleash the power of 
                      <br/>
                        <span className="text-green-600">
                                   Fair price 
                        </span>
                  </h1>

                  <p className="mt-6">
                            Powerfull , simple , easy to find 
                  </p>
                  

                  < Searchbar/>
            </div>

          < HeroCarousel/>
          </div>
        </section>

       
      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

     </>
  );
}
