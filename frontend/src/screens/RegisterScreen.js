import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { register } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";

const RegisterScreen = () => {
	const { search } = useLocation();
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [account_number, setAccountNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);

	const dispatch = useDispatch();

	const userRegister = useSelector((state) => state.userRegister);
	const { loading, error, userInfo } = userRegister;

	const redirect = search ? search.split("=")[1] : "/";

	// redirect when logged in : redirect to it's value, homescreen otherwise
	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const submitHandler = (e) => {
		e.preventDefault();
		// DISPATCH REGISTER
		if (password !== confirmPassword) {
			setMessage("Passwords do not match");
		} else {
			dispatch(register(name, email, account_number, password));
		}
	};

	return (
		<FormContainer>
			<h1>Sign Up</h1>
			{message && <Message variant='danger'>{message}</Message>}
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				<div className='flex items-center mb-4'>
					<label htmlFor='Name' className='font-[600] min-w-[120px]'>
						Name:{" "}
					</label>
					<input
						type='text'
						placeholder='Enter Name'
						value={name}
						id='Name'
						name='Name'
						className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
						required
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div className='flex items-center mb-4'>
					<label htmlFor='email' className='font-[600] min-w-[120px]'>
						Email:{" "}
					</label>
					<input
						type='email'
						placeholder='Enter email'
						value={email}
						id='email'
						name='email'
						className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className='flex items-center mb-4'>
					<label htmlFor='account_number' className='font-[600] min-w-[120px]'>
						Account Number:{" "}
					</label>
					<input
						type='text'
						placeholder='Enter account number'
						value={account_number}
						id='account_number'
						name='account_number'
						className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
						required
						onChange={(e) => setAccountNumber(e.target.value)}
					/>
				</div>
				<div className='flex items-center mb-4'>
					<label htmlFor='password' className='font-[600] min-w-[120px]'>
						password:{" "}
					</label>
					<input
						type='password'
						placeholder='Enter password'
						value={password}
						id='password'
						name='password'
						className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className='flex items-center mb-4'>
					<label htmlFor='confirmPassword' className='font-[600] min-w-[120px]'>
						password:{" "}
					</label>
					<input
						type='password'
						placeholder='Re-type password'
						value={confirmPassword}
						id='onfirmPassword'
						name='confirmPassword'
						className='bg-slate-200 px-4 py-1 rounded-xl focus:outline-none'
						required
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>

				<Button
					type='submit'
					variant=''
					className='btn btn-sm !bg-green !text-white'>
					Register
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					Have an Account?{" "}
					<Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>
						Login
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default RegisterScreen;
