import React from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  bestSellerOne,
  bestSellerTwo,
  bestSellerThree,
  bestSellerFour,
} from "../../../assets/images/index";

const BestSellers = () => {
  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        <Product
          _id="1011"
          img="https://www.tg-computers.co.uk/wp-content/uploads/2018/10/Computer-Accessories-for-Sale-in-Pontyclun-Mid-Glamorgan-1.jpg"
          productName="Mouse"
          price="35.00"
          color="Blank and White"
          badge={true}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1012"
          img="https://3.imimg.com/data3/GT/PN/MY-2762950/computer-accessories-1000x1000.jpg"
          productName="Conectors"
          price="180.00"
          color="Gray"
          badge={false}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1013"
          img="https://cdn.bdstall.com/product-image/giant_29118.jpg"
          productName="Canon Printer"
          price="25.00"
          color="Mixed"
          badge={true}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1014"
          img="https://www.pngplay.com/wp-content/uploads/12/Printer-Free-PNG.png"
          productName="Inkjet Printer"
          price="220.00"
          color="Black"
          badge={false}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
      </div>
    </div>
  );
};

export default BestSellers;
