import React, { Fragment, useState } from "react";
import store from "../../../store";
import { useSelector } from "react-redux";
import { loadUser } from "../../../actions/userAction";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import UserOptions from "../Header/UserOptions";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate } from "react-router-dom";

function INavbar() {
  //   const { isAuthenticated, user } = useSelector((state) => state.user);

  //   React.useEffect(() => {
  //     store.dispatch(loadUser());
  //   }, []);

  const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const searchSubmitHandler = (e)=>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`);
        }
        else{
            navigate(`/products`);
        }
    }

  return (
    <Fragment>
      {/* <Navbar bg="light" variant="light" style={{ "max-height": "50px" }}> */}
      {["sm",].map((expand) => (
        <Navbar key={expand} bg="light" expand={expand} className="mb-3">
          <Container fluid>
            <Navbar.Brand href="/">Ecommerce</Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Ecommerce
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="/products">Products</Nav.Link>
                  <Nav.Link href="/contact">Contact</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>
                  
                </Nav>
                
                <Form className="d-flex" onSubmit={searchSubmitHandler}>
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e)=>setKeyword(e.target.value)}
                  />
                  <Button variant="outline-success" type="submit">Search</Button>
                </Form>
                
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </Fragment>
  );
}

export default INavbar;

// {isAuthenticated && <UserOptions user={user} />}
