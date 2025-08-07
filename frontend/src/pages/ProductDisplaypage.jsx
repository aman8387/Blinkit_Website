import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  // ✅ Left/Right Click to change main image
  const handleScrollRight = () => {
    setImage(prev => (prev + 1) % data.image.length)
  }
  const handleScrollLeft = () => {
    setImage(prev => (prev - 1 + data.image.length) % data.image.length)
  }

  return (
    <section className='container mx-auto p-4 grid lg:grid-cols-2'>
      <div>
        {/* Main image display */}
        <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
          <img
            src={data.image[image]}
            className='w-full h-full object-scale-down'
          />
        </div>

        {/* ✅ Clickable dot indicators */}
        <div className='flex items-center justify-center gap-3 my-2'>
          {
            data.image.map((img, index) => (
              <div
                key={img + index + "point"}
                onClick={() => setImage(index)}
                className={`w-3 h-3 lg:w-5 lg:h-5 rounded-full cursor-pointer transition-all duration-200 ${
                  index === image ? 'bg-slate-600 scale-110' : 'bg-slate-300'
                }`}
              />
            ))
          }
        </div>

        {/* ✅ Thumbnail carousel with highlighted border */}
        <div className='grid relative'>
          <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
            {
              data.image.map((img, index) => (
                <div
                  key={img + index}
                  onClick={() => setImage(index)}
                  className={`w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md border-2 rounded ${
                    index === image ? 'border-green-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt='min-product'
                    className='w-full h-full object-scale-down'
                  />
                </div>
              ))
            }
          </div>

          {/* ✅ Left/Right buttons to change image */}
            <div className='w-full -ml-3 h-full flex justify-between absolute items-center'>
            <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleLeft />
            </button>
            <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* Desktop-only product details */}
        <div className='my-4 hidden lg:grid gap-3'>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => (
              <div key={index}>
                <p className='font-semibold'>{element}</p>
                <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* Right section with product info */}
      <div className='p-4 lg:pl-7 text-base lg:text-lg'>
        <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
        <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
        <p>{data.unit}</p>
        <Divider />
        <div>
          <p>Price</p>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
              <p className='font-semibold text-lg lg:text-xl'>
                {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
              </p>
            </div>
            {
              data.discount > 0 && (
                <>
                  <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
                  <p className="font-bold text-green-600 lg:text-2xl">
                    {data.discount}% <span className='text-base text-neutral-500'>Discount</span>
                  </p>
                </>
              )
            }
          </div>
        </div>

        
        <div className='my-4'>
          {data.stock === 0 ? (
            <p className='text-lg text-red-500'>Out of Stock</p>
          ) : (
            <div className='my-4'>
              <AddToCartButton data={data}/>
            </div>
          )}
        </div>
       

        <h2 className='font-semibold'>Why shop from binkeyit?</h2>
        <div>
          <div className='flex items-center gap-4 my-4'>
            <img src={image1} alt='superfast delivery' className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>Superfast Delivery</div>
              <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4'>
            <img src={image2} alt='Best prices offers' className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>Best Prices & Offers</div>
              <p>Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className='flex items-center gap-4 my-4'>
            <img src={image3} alt='Wide Assortment' className='w-20 h-20' />
            <div className='text-sm'>
              <div className='font-semibold'>Wide Assortment</div>
              <p>Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>

        {/* Mobile-only product details */}
        <div className='my-4 grid gap-3'>
          <div>
            <p className='font-semibold'>Description</p>
            <p className='text-base'>{data.description}</p>
          </div>
          <div>
            <p className='font-semibold'>Unit</p>
            <p className='text-base'>{data.unit}</p>
          </div>
          {
            data?.more_details && Object.keys(data?.more_details).map((element, index) => (
              <div key={index}>
                <p className='font-semibold'>{element}</p>
                <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default ProductDisplayPage
