import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
	return (
		<div className='rounded px-4'>
			<img src={product.image} alt='product' />

			<div className='text-center py-2 px-4 shadow-sm'>
				<div className='text-slate-800 hover:text-green duration-200'>
					<strong>{product.name}</strong>
				</div>

				<p>BDT. {product.price}</p>
			</div>
		</div>
	);
};

export default Product;
