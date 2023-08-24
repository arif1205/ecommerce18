import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	Col,
	Image,
	ListGroup,
	ListGroupItem,
	Row,
	Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

import { ADMIN_BANK_ACCOUNT } from "../constants/adminConstants";

const OrderScreen = () => {
	const { id } = useParams();
	const orderId = id;

	const [BankPin, setPin] = useState("");
	const [InvalidPinMessage, setInvalidPinMessage] = useState(false);
	const [PinMessage, setPinMessage] = useState("");

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const orderDeliver = useSelector((state) => state.orderDeliver);
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	if (!loading) {
		//   Calculate prices
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2);
		};

		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		);
	}

	useEffect(() => {
		if (!userInfo) {
			navigate("/login");
		}
		if (!order || successPay || successDeliver || order._id !== orderId) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch({ type: ORDER_DELIVER_RESET });
			dispatch(getOrderDetails(orderId));
		}
	}, [
		dispatch,
		orderId,
		successPay,
		order,
		successDeliver,
		userInfo,
		navigate,
	]);

	const payNowHandler = async (e) => {
		e.preventDefault();
		const paymentData = {
			email: order.user.email,
			account_number: order.user.account_number,
			amount: order.totalPrice,
			receiver_account_number: ADMIN_BANK_ACCOUNT,
			password: BankPin,
		};

		try {
			const bank_api_call = axios
				.post(`/bankapi/payment`, paymentData)
				.catch((error) => {
					console.log("eta kaj korse", error.response.data.message);
					setInvalidPinMessage(true);
					setPinMessage("Invalid PIN");
				});
			console.log("promise er age:", bank_api_call.result);
			// if(!bank_api_call.result.data.id)
			// {
			//   throw new error("Invalid PIN or your account number is invalid")
			// }
			bank_api_call.then(function (result) {
				console.log("ekhane bank_api: " + result.data);
				console.log("hoise mama");
				const DataReceivedFromBankApi = {
					id: result.data.id,
					email: result.data.email,
					status: result.data.status,
					update_time: result.data.update_time,
				};
				setInvalidPinMessage(false);
				dispatch(payOrder(orderId, DataReceivedFromBankApi));
			});
		} catch (error) {
			console.log("paycall err: ", error.message);
		}
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<h1 className='text-center'>
				<span className='text-green'>Order id: </span>
				{order._id}
			</h1>
			<Row className='justify-content-center'>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item className='mx-auto'>
							{order.isPaid ? (
								<button className='btn btn-danger !bg-green !border-green'>
									Paid
								</button>
							) : (
								<button className='btn btn-danger !bg-red-500 !border-red-500'>
									Not Paid
								</button>
							)}
						</ListGroup.Item>
					</ListGroup>

					<div className='mb-2 w-50 mx-auto'>
						<p className='text-2xl text-center'>
							Total amount:{" "}
							<span className='bg-slate-300 text-red-500 px-2 py-1 rounded-lg'>
								{order.totalPrice}
							</span>
						</p>

						{!order.isPaid && (
							<div className='flex align-items-center justify-content-center'>
								<input
									type='password'
									className='bg-slate-300 px-4 py-1 w-full max-w-[150px] mb-4 rounded-xl text-red-500'
									placeholder='Enter your PIN'
									value={BankPin}
									onChange={(event) => {
										setPin(event.target.value);
									}}
								/>
							</div>
						)}
						{!order.isPaid && (
							<div className='flex justify-content-center align-items-center'>
								<button
									className='btn btn-danger !bg-green !border-green mx-auto w-[100px]'
									onClick={payNowHandler}>
									Pay
								</button>
							</div>
						)}

						{loadingDeliver && <Loader />}
					</div>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
