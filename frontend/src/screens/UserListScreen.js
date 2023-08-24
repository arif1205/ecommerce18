import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { listUsers, deleteUser } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const UserListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userList = useSelector((state) => state.userList);
	const { loading, error, users } = userList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDelete = useSelector((state) => state.userDelete);
	const { success: successDelete } = userDelete;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listUsers());
		} else {
			navigate("/login");
		}
	}, [dispatch, navigate, userInfo, successDelete]);

	const deleteHandler = (id) => {
		if (window.confirm("Are you sure")) {
			dispatch(deleteUser(id));
		}
	};

	return (
		<div className='w-75 mx-auto'>
			<Table
				striped
				bordered
				hover
				responsive
				className='table-sm !text-black text-center table-fixed'>
				<thead>
					<tr>
						<th>ID</th>
						<th>NAME</th>
						<th>EMAIL</th>
						<th>ADMIN</th>
						<th>Delete?</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((order) => (
						<tr key={order._id}>
							<td>{order._id}</td>
							<td>{order.name}</td>
							<td>{order.email}</td>
							<td className='font-bold'>
								{order.isAdmin ? (
									<span className='text-green bg-green-/50 px-2 py-1 rounded'>
										True
									</span>
								) : (
									"false"
								)}
							</td>
							<td>
								<Button
									variant=''
									className='btn-sm'
									onClick={() => deleteHandler(order._id)}>
									<i className='fas fa-trash'></i>
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default UserListScreen;
