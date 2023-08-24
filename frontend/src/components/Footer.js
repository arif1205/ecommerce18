import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
	return (
		<footer className='bg-white text-slate-800'>
			<Container>
				<Row>
					<Col className='text-center py-3'>
						Copyright &copy; Orgranic Store{" "}
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
