import React, { useState,Fragment, useEffect } from 'react'
import "./ForgotPassword.css"
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { clearErrors, forgotPassword } from '../../actions/userAction';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const {error, message, loading} = useSelector((state)=> state.forgotPassword);
  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) =>{
    // console.log("a")
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email)
    dispatch(forgotPassword(myForm));
  }
  useEffect(()=>{
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    if(message){
      alert.success(message);
      
    }
  }, [navigate, error,alert, dispatch, message])
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>

              <form
                className="forgotPasswordForm"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="forgotPasswordEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Send"
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

export default ForgotPassword