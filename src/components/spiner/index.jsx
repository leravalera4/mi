import React from 'react'
import Image from 'next/image'
import image from '../../app/images/sp.gif'

const index = () => {
  return (
    <div>
        <Image width={120} height={120} src={image} alt="spiner"/>
    </div>
  )
}

export default index