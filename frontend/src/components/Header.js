import React, { useEffect, useState } from "react";
import { Container, Modal, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";
import {
	addToCart,
	removeFromCart,
	savePaymentMethod,
	saveShippingAddress,
} from "../actions/cartActions";
import { createOrder } from "../actions/orderActions";
import { useNavigate } from "react-router-dom";
import { USER_DETAILS_RESET } from "../constants/userConstants";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const Header = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const cart = useSelector((state) => state.cart);

	const { cartItems } = cart;

	const logoutHandler = () => {
		dispatch(logout());
	};

	useEffect(() => {
		console.log(cartItems);
	}, [cartItems]);

	const [open, setOpen] = useState(false);
	const [shipOpen, setShipOpen] = useState(false);
	const [placeOpen, setPlaceOpen] = useState(false);

	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [country, setCountry] = useState("");

	useEffect(() => {
		const { shippingAddress } = cart;
		setAddress(shippingAddress.address);
		setCity(shippingAddress.city);
		setPostalCode(shippingAddress.postalCode);
		setCountry(shippingAddress.country);
	}, [cart]);

	const submitShipHandler = (e) => {
		e.preventDefault();
		dispatch(saveShippingAddress({ address, city, postalCode, country }));
		dispatch(savePaymentMethod("SUST Bank"));
		// navigate("/payment");
		setShipOpen(false);
		setPlaceOpen(true);
	};

	if (!cart.shippingAddress.address) {
		// navigate("/shipping");
	} else if (!cart.paymentMethod) {
		// navigate("/payment");
	}

	//   Calculate prices
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2);
	};

	cart.itemsPrice = addDecimals(
		cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
	);
	cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
	cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
	cart.totalPrice = (
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice)
	).toFixed(2);

	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, success } = orderCreate;

	useEffect(() => {
		if (success) {
			navigate(`/order/${order._id}`);
			dispatch({ type: USER_DETAILS_RESET });
			dispatch({ type: ORDER_CREATE_RESET });
		}
		// eslint-disable-next-line
	}, [history, success]);

	console.log(cart);

	return (
		<>
			<header>
				<div className='w-full bg-white px-8 py-4 text-slate-800'>
					<div className='flex justify-between'>
						{/* left  */}
						{/* logo  */}
						<div className='flex gap-4 items-center'>
							<div>
								<LinkContainer to='/'>
									<img
										src='https://websitedemos.net/organic-shop-02/wp-content/uploads/sites/465/2019/06/organic-store-logo5.svg'
										alt='logo'
										className='w-32'
									/>
								</LinkContainer>
							</div>
							{/* home link  */}
							<LinkContainer to='/'>
								<div className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'>
									Home
								</div>
							</LinkContainer>
							<LinkContainer to='/profile'>
								<div className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'>
									profile
								</div>
							</LinkContainer>

							<LinkContainer to='/ordersList'>
								<div className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'>
									Orders
								</div>
							</LinkContainer>
							<LinkContainer to='/admin/userList'>
								<div className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'>
									All users
								</div>
							</LinkContainer>
							<LinkContainer to='/admin/orderList'>
								<div className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'>
									All Orders
								</div>
							</LinkContainer>
						</div>
						{/* right  */}
						<div className='flex gap-4 items-center'>
							{/* cart icon  */}

							<div
								className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'
								onClick={() => setOpen(true)}>
								<i className='fas fa-shopping-cart'></i> Cart (
								{cartItems.length})
							</div>

							<div
								className='text-xl uppercase font-medium cursor-pointer pb-1 border-b-[3px] border-transparent hover:border-green hover:text-green duration-200'
								onClick={logoutHandler}>
								Logout
							</div>
						</div>
					</div>
				</div>
				{/* <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Shopaholic</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
          
            <div className="ms-auto">
              <SearchBox/>
            </div>
          
          
          
            <Nav className='ms-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <i className='fas fa-shopping-cart'></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (<LinkContainer to='/login'>
              <Nav.Link>
                <i className='fas fa-user'></i> Sign In
              </Nav.Link>
            </LinkContainer>
            )}   
              {userInfo && userInfo.isAdmin && (
                                <NavDropdown title={'Admin'} id='adminmenu'>
                                <LinkContainer to='/admin/userList'>
                                  <NavDropdown.Item>Users</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/productList'>
                                  <NavDropdown.Item>Products</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/admin/orderList'>
                                  <NavDropdown.Item>Orders</NavDropdown.Item>
                                </LinkContainer>
                                
                              </NavDropdown>
              )}     
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
			</header>

			<Modal
				show={open}
				className=''
				centered
				onHide={() => {
					setOpen(false);
				}}
				size='lg'>
				<div className='bg-white rounded-lg !border-0 px-4 py-3'>
					<h1 className='text-[32px] font-medium !text-slate-800 mb-4'>CART</h1>
					<div className='cartItems flex flex-col gap-2 text-slate-800'>
						{cartItems.length &&
							cartItems.map((item, i) => {
								return (
									<div key={item.product} className='text-2xl'>
										<div className='flex gap-4 items-center'>
											<p className='index'>{i + 1}.</p>
											<p className=''>{item.name}</p>
											<input
												type='number'
												className='bg-slate-300 px-4 py-1 max-w-[90px] rounded-xl text-red-500'
												value={item.qty}
												min={1}
												onChange={(e) =>
													dispatch(addToCart(item.product, e.target.value))
												}
											/>
											<p
												className='cursor-pointer'
												onClick={() => {
													dispatch(removeFromCart(item.product));
												}}>
												<i className='fas fa-trash'></i>
											</p>
										</div>
									</div>
								);
							})}
					</div>

					<h1 className='text-[32px] font-medium !text-slate-800 my-4'>
						SUBTOTAL
					</h1>
					<div className='flex flex-col gap-4'>
						<p className='text-2xl'>
							Total amount:{" "}
							<span className='bg-slate-300 text-red-500 px-2 py-1 rounded-lg'>
								{cartItems
									.reduce((acc, item) => acc + item.qty * item.price, 0)
									.toFixed(2)}
							</span>
						</p>

						<button
							type='button'
							className='btn !bg-dark-green text-white tex max-w-max'
							disabled={cartItems.length === 0}
							onClick={() => {
								// navigate("/login?redirect=/shipping");
								setOpen(false);
								setShipOpen(true);
							}}>
							Checkout
						</button>
					</div>
				</div>
			</Modal>

			<Modal
				show={shipOpen}
				className=''
				centered
				onHide={() => {
					setShipOpen(false);
				}}
				size=''>
				<div className='bg-white rounded-lg !border-0 px-4 py-3'>
					<h1>Shipping</h1>

					<div className='mt-4'>
						<div className='text-[20px]'>
							<form onSubmit={submitShipHandler}>
								<div className='flex flex-col gap-3'>
									<div className='flex gap-2 items-center'>
										<label
											htmlFor='address'
											className='font-[600] min-w-[120px]'>
											Address:{" "}
										</label>
										<input
											type='text'
											placeholder='Enter address'
											value={address}
											id='address'
											name='address'
											className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
											required
											onChange={(e) => setAddress(e.target.value)}
										/>
									</div>
									<div className='flex gap-2 items-center'>
										<label htmlFor='city' className='font-[600] min-w-[120px]'>
											City:{" "}
										</label>
										<input
											type='text'
											placeholder='Enter city'
											value={city}
											id='city'
											name='city'
											className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
											required
											onChange={(e) => setCity(e.target.value)}
										/>
									</div>
									<div className='flex gap-2 items-center'>
										<label
											htmlFor='postalCode'
											className='font-[600] min-w-[120px]'>
											Postal Code:{" "}
										</label>
										<input
											type='text'
											placeholder='Enter postal Code'
											value={postalCode}
											id='postalCode'
											name='postalCode'
											className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
											required
											onChange={(e) => setPostalCode(e.target.value)}
										/>
									</div>
									<div className='flex gap-2 items-center'>
										<label
											htmlFor='country'
											className='font-[600] min-w-[120px]'>
											Country:{" "}
										</label>
										<input
											type='text'
											placeholder='Enter postal Code'
											value={country}
											id='country'
											name='country'
											className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
											required
											onChange={(e) => setCountry(e.target.value)}
										/>
									</div>

									<button
										type='submit'
										className='btn !bg-dark-green text-white tex max-w-max'>
										Continue
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</Modal>

			<Modal
				show={placeOpen}
				className=''
				centered
				onHide={() => {
					setPlaceOpen(false);
				}}
				size='lg'>
				<div className='bg-white rounded-lg !border-0 px-4 py-3'>
					<h1 className='text-[32px] font-medium !text-slate-800 mb-4'>
						Order Summary
					</h1>

					<div className='flex flex-col gap-4'>
						<p className='text-2xl'>
							Items price:{" "}
							<span className='bg-slate-300 text-red-500 px-2 py-1 rounded-lg'>
								{cart.itemsPrice}
							</span>
						</p>
						<p className='text-2xl'>
							Shipping Cost:{" "}
							<span className='bg-slate-300 text-red-500 px-2 py-1 rounded-lg'>
								{cart.shippingPrice}
							</span>
						</p>
						<p className='text-2xl'>
							Tax Amount:{" "}
							<span className='bg-slate-300 text-red-500 px-2 py-1 rounded-lg'>
								{cart.taxPrice}
							</span>
						</p>
						<p className='text-2xl'>
							Total amount:{" "}
							<span className='bg-slate-300 text-red-500 px-2 py-1 rounded-lg'>
								{cart.totalPrice}
							</span>
						</p>

						<button
							type='button'
							className='btn !bg-dark-green text-white tex max-w-max'
							disabled={cart.cartItems === 0}
							onClick={() => {
								dispatch(
									createOrder({
										orderItems: cart.cartItems,
										shippingAddress: cart.shippingAddress,
										paymentMethod: cart.paymentMethod,
										itemsPrice: cart.itemsPrice,
										shippingPrice: cart.shippingPrice,
										taxPrice: cart.taxPrice,
										totalPrice: cart.totalPrice,
									})
								);
								setPlaceOpen(false);
							}}>
							Place Order
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Header;
