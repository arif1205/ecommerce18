import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const logoutHandler = () => {
		dispatch(logout());
	};
	return (
		<header>
			<Navbar expand='lg' className='bg-body-tertiary'>
				<Container>
					<Navbar.Brand href='#home'>Ecom-Bank</Navbar.Brand>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='me-auto'>
							{userInfo ? (
								<>
									<Nav.Link href='/'>Home</Nav.Link>
									<Nav.Link href='/profile'>Profile</Nav.Link>
									<Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
								</>
							) : (
								<Nav.Link href='/login'>Login</Nav.Link>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
