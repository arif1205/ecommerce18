import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	ORDER_DELIVER_RESET,
	ORDER_PAY_RESET,
} from "../constants/orderConstants";
import { getOrderDetails, listMyOrders } from "../actions/orderActions";
import { Button, Table } from "react-bootstrap";
import { getUserDetails } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { LinkContainer } from "react-router-bootstrap";

const OrdersScreen = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, error, user } = userDetails;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
	const { success } = userUpdateProfile;

	const orderListMy = useSelector((state) => state.orderListMy);
	const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

	// redirect to login when not logged in
	useEffect(() => {
		if (!userInfo) {
			navigate("/login");
		} else {
			if (!user || !user.name || success) {
				// gets the Logged In user's Id from api/users/profile and store it in state
				// and then gets the user from state by useSelector in next render
				dispatch({ type: USER_UPDATE_PROFILE_RESET });
				dispatch(getUserDetails("profile"));
				dispatch(listMyOrders());
			} else {
			}
		}
	}, [
		dispatch,
		navigate,
		user.email,
		user.name,
		user.account_number,
		userInfo,
		success,
		user,
	]);

	return (
		<div>
			<div className='w-75 mx-auto'>
				<h2>My Orders</h2>
				{loadingOrders ? (
					<></>
				) : errorOrders ? (
					<></>
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
						<tbody>
							{orders.map((order) => (
								<LinkContainer
									to={`/order/${order._id}`}
									className='cursor-pointer'>
									<tr key={order._id}>
										<td>{order._id}</td>
										<td>{order.totalPrice}</td>
										<td>
											{order.isPaid ? (
												<p className='text-green'>Paid</p>
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
								</LinkContainer>
							))}
						</tbody>
					</Table>
				)}
			</div>
		</div>
	);
};

export default OrdersScreen;
