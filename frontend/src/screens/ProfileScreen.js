import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listMyOrders } from "../actions/orderActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";

const ProfileScreen = () => {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [account_number, setAccountNo] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);

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
				setName(user.name);
				setEmail(user.email);
				setAccountNo(user.account_number);
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

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
		} else {
			// DISPATCH UPDATE PROFILE
			dispatch(
				updateUserProfile({
					id: user._id,
					name,
					email,
					account_number,
					password,
				})
			);
		}
	};

	return (
		<Row className='justify-content-center'>
			<Col md={3}>
				{loading && <Loader />}
				<div className='flex flex-col text-2xl bg-white shadow px-4 py-3 rounded-lg'>
					<div className='flex gap-3 align-items-center'>
						<p className='font-bold'>Name: </p>
						<p>{userInfo?.name}</p>
					</div>
					<div className='flex gap-3 align-items-center'>
						<p className='font-bold'>Email: </p>
						<p>{userInfo?.email}</p>
					</div>
					<div className='flex gap-3 align-items-center'>
						<p className='font-bold'>Acc No: </p>
						<p>{userInfo?.account_number}</p>
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default ProfileScreen;
