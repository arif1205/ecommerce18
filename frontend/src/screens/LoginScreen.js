import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";

const LoginScreen = () => {
	const { search } = useLocation();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { loading, error, userInfo } = userLogin;

	const redirect = search ? search.split("=")[1] : "/";

	// redirect when logged in : redirect to it's value, homescreen otherwise
	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [navigate, redirect, userInfo]);

	const submitHandler = (e) => {
		e.preventDefault();
		// DISPATCH LOGIN
		dispatch(login(email, password));
	};

	return (
		<FormContainer>
			<h1>Login</h1>
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={submitHandler}>
				<Form.Group controlId='email'>
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
				</Form.Group>
				<Form.Group controlId='password'>
					<div className='flex items-center mb-4'>
						<label htmlFor='password' className='font-[600] min-w-[120px]'>
							Password:{" "}
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
				</Form.Group>

				<Button
					type='submit'
					variant=''
					className='btn btn-sm !bg-green !text-white'>
					Sign In
				</Button>
			</Form>

			<Row className='py-3'>
				<Col>
					New Customer?{" "}
					<Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>
						Register
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
};

export default LoginScreen;
