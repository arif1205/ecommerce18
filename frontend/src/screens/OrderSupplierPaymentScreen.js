import React, { useEffect, useState, useCallback } from "react";
import {
	Button,
	Card,
	Col,
	ListGroup,
	ListGroupItem,
	Row,
	Form,
	Table,
	Alert,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	deliverOrder,
	getOrderSupplierPaymentDetails,
	payOrderSupplier,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import axios from "axios";

// payment button click -> payOrderSupplier dispatch
// if success supplier payment then delivery request to supplier
// if deliveryRequest is successul then deliver to user

const OrderSupplierPaymentScreen = () => {
	const [order, setOrder] = useState({});

	const { id: orderId } = useParams();

	console.log("eta orderId", orderId);
	console.log("eta order", order);

	const [BankPin, setPin] = useState("");
	const [InvalidPinMessage, setInvalidPinMessage] = useState(false);
	const [PinMessage, setPinMessage] = useState("");

	const navigate = useNavigate();

	const dispatch = useDispatch();

	// this state is for loading the supplier payment table
	const orderSupplierPayDetails = useSelector(
		(state) => state.orderSupplierPayDetails
	);
	const {
		loading: loadingSupplierPayDetails,
		data: dataSupplierPayDetails,
		error: errorSupplierPayDetails,
	} = orderSupplierPayDetails;

	// this state is for loading the payment to supplier button
	const orderSupplierPay = useSelector((state) => state.orderSupplierPay);
	const {
		loading: loadingSupplierPay,
		// supplierPaymentResult sent bynk to ecommerce is stored here
		supplierPay: supplierPaymentResultListObject,
		error: errorSupplierPay,
		success: successSupplierPay,
	} = orderSupplierPay;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	// to get the order supplier payment status
	const getOrderDetails = useCallback(async () => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userInfo.token}`,
			},
		};

		try {
			const isOrderResponse = axios.get(`/api/orders/${orderId}`, config);

			console.log("isOrderResponsethen er age");

			isOrderResponse.then(function (result) {
				console.log("isOrderResponse then er pore");
				const order = result.data;
				console.log("eta then  er pore result data", result.data);
				console.log("eta order", order);
				setOrder(order);
			});
		} catch (error) {
			console.error(error);
		}
	}, [orderId, userInfo.token]);

	////////////////////////////

	// function for sending api request to supplier with delivery request
	const deliveryRequestToSuppliers = useCallback(
		async (order, supplierPaymentResultList) => {
			try {
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userInfo.token}`,
					},
				};

				console.log(
					"eta deliveryRequest er vetor supplierPaymentResultList",
					supplierPaymentResultList
				);
				// send delivery request to supplier api
				const isDeliveryRequestSuccessfulResponse = axios.post(
					`/supplierapi/deliveryRequests`,
					supplierPaymentResultList,
					config
				);

				console.log("eta .then er age ", isDeliveryRequestSuccessfulResponse);

				isDeliveryRequestSuccessfulResponse.then(function (result) {
					const isDeliveryRequestSuccessful =
						result.data.isDeliveryRequestSuccessful;

					if (isDeliveryRequestSuccessful) {
						if (!order.isDeliverd) dispatch(deliverOrder(order));
					}
				});
			} catch (error) {}
		},

		[dispatch, userInfo.token]
	);

	// send delivery request after paying supplier
	if (successSupplierPay) {
		console.log("delivery request je order ke dicchi", order);
		if (!order.isDeliverd)
			deliveryRequestToSuppliers(order, supplierPaymentResultListObject);
	}

	/////////////////////////////////

	useEffect(() => {
		if (!userInfo || !userInfo.isAdmin) {
			navigate("/login");
		}
	}, [navigate, userInfo]);

	useEffect(() => {
		getOrderDetails();
		dispatch(getOrderSupplierPaymentDetails(orderId));

		console.log("inside second useEffect");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const payOrderSupplierHandler = () => {
		if (!order?.isSupplierPaid) {
			dispatch(payOrderSupplier(orderId, dataSupplierPayDetails, BankPin));
		}
	};

	return (
		<div className='w-75 mx-auto'>
			<h1>Order id: {orderId}</h1>

			<Table striped bordered hover responsive className='table-sm text-black'>
				<thead>
					<tr>
						<th>SUPPLIER NAME</th>
						<th>SUPPLIER EMAIL</th>
						<th>SUPPLIER BANK ACCOUNT</th>
						<th>AMOUNT</th>
					</tr>
				</thead>
				<tbody className='!text-black'>
					{dataSupplierPayDetails &&
						dataSupplierPayDetails.map((supplier) => (
							<tr key={supplier.bankAccount}>
								<td>{supplier.name}</td>
								<td>{supplier.email}</td>
								<td>{supplier.bankAccount}</td>
								<td>BDT. {supplier.amount}</td>
							</tr>
						))}
				</tbody>
			</Table>

			{/* payment button */}

			{loadingSupplierPayDetails ? (
				<></>
			) : loadingSupplierPay ? (
				<Loader />
			) : errorSupplierPay ? (
				<>
					<Form>
						<div className='flex gap-2 items-center'>
							<label htmlFor='PIN' className='font-[600] min-w-[120px]'>
								PIN:{" "}
							</label>
							<input
								type='text'
								placeholder='Enter PIN'
								value={BankPin}
								id='PIN'
								name='PIN'
								className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
								required
								onChange={(e) => setPin(e.target.value)}
							/>
						</div>
					</Form>

					<Button
						variant=''
						className='btn-sm !bg-green text-white'
						onClick={() => payOrderSupplierHandler()}>
						Pay Now
					</Button>
				</>
			) : order?.isSupplierPaid || successSupplierPay ? (
				<div className='text-green font-bold'>Paid</div>
			) : (
				<>
					<div className='flex gap-2 items-center'>
						<label htmlFor='PIN' className='font-[600] min-w-[120px]'>
							PIN:{" "}
						</label>
						<input
							type='password'
							placeholder='Enter PIN'
							value={BankPin}
							id='PIN'
							name='PIN'
							className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
							required
							onChange={(e) => setPin(e.target.value)}
						/>
					</div>

					<Button
						variant=''
						className='btn-sm !bg-green text-white mt-4'
						onClick={() => payOrderSupplierHandler()}>
						Pay Now
					</Button>
				</>
			)}
		</div>
	);
};

export default OrderSupplierPaymentScreen;
