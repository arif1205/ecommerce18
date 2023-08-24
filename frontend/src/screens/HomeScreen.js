import React, { useEffect, useState } from "react";
import { Col, Row, Card, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import { useParams, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { addToCart } from "../actions/cartActions";

const HomeScreen = () => {
	const { keyword } = useParams();
	const dispatch = useDispatch();
	const [qty, setQty] = useState(1);
	const [open, setOpen] = useState(false);
	const [modalProduct, setModalProduct] = useState(null);

	const productList = useSelector((state) => state.productList); // productList is a reducer
	const { loading, error, products } = productList;
	useEffect(() => {
		dispatch(listProducts(keyword));
	}, [dispatch, keyword]);

	const navigate = useNavigate();

	const categoryOneHandler = () => {
		navigate(`/category/?category=Gadget`);
	};
	const categoryTwoHandler = () => {
		navigate(`/category/?category=Furniture`);
	};
	const categoryThreeHandler = () => {
		navigate(`/category/?category=Plant`);
	};

	const addToCartHandler = () => {
		const id = modalProduct?._id;
		dispatch(addToCart(id, qty));
		setOpen(false);
		setModalProduct(null);
	};
	return (
		<>
			<Banner />
			<div className='products bg-white container py-28'>
				<div className='header flex flex-col justify-center items-center pb-10'>
					<h1 className='text-[42px] font-bold !text-slate-800'>
						Latest Products
					</h1>
					<img
						src='https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/2019/07/logo-leaf-new.png'
						alt='leave'
						className='w-16'
					/>
				</div>
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<div className='flex justify-center items-center'>
						{products.map((product) => (
							<div
								className='basis-[25%] cursor-pointer'
								onClick={() => {
									setModalProduct(product);
									setOpen(true);
								}}>
								<Product product={product} />
							</div>
						))}
					</div>
				)}
			</div>

			<Modal
				show={open && modalProduct}
				className=''
				centered
				onHide={() => {
					setModalProduct(null);
					setOpen(false);
				}}>
				<div className='bg-white rounded-lg !border-0 px-4 py-3'>
					<h1 className='text-[32px] font-medium !text-slate-800'>
						Add to cart?
					</h1>
					{/* input for quantity  */}
					<input
						type='number'
						name='qty'
						id='qty'
						className=' appearance-textfield w-full bg-slate-300 px-4 py-2 rounded '
						placeholder='Enter quantity'
						min={1}
						required
						value={qty}
						onChange={(e) => setQty(e.target.value)}
					/>

					{/* div.buttons  */}
					<div className='buttons flex justify-content-end gap-4 mt-5'>
						<button
							type='button'
							className='btn btn-danger'
							onClick={() => {
								setModalProduct(null);
								setOpen(false);
							}}>
							Cancel
						</button>
						<button
							type='button'
							className='btn btn-success'
							onClick={addToCartHandler}>
							Submit
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};
export default HomeScreen;
