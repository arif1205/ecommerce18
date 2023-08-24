import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { listOrders, payOrderSupplier } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const OrderListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [pin, setPin] = useState("");
	const [order, setOrder] = useState(null);

	const orderList = useSelector((state) => state.orderList);
	const { loading, error, orders } = orderList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listOrders());
		} else {
			navigate("/login");
		}
	}, [dispatch, navigate, userInfo]);

	return (
		<>
			<div className='w-75 mx-auto'>
				<h1>Orders</h1>
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Table
						striped
						bordered
						hover
						responsive
						className='table-sm !text-black text-center table-fixed'>
						<thead>
							<tr>
								<th>ID</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
							</tr>
						</thead>
						<tbody className='font-bold'>
							{orders.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.totalPrice}</td>
									<td>
										{order.isPaid ? (
											<p
												className='text-green cursor-pointer'
												onClick={() => {
													navigate(`/admin/order/${order._id}/supplierPayment`);
												}}>
												Pay supplier
											</p>
										) : (
											<p className='text-red-500'>Not Paid</p>
										)}
									</td>
									<td>
										{order.isDelivered ? (
											<p className='text-green'>Delivered</p>
										) : (
											<p className='text-red-500'>Not delivered</p>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</div>
		</>
	);
};

export default OrderListScreen;
