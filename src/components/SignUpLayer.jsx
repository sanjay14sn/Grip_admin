import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link } from "react-router-dom";

const SignUpLayer = () => {
  return (
    <section className='auth mainpage bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex d-none align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/grip-signup.jpg' alt='' />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='insidebox max-w-464-px mx-auto w-100'>
          <div>
            <Link to='/' className='mb-40 max-w-150-px'>
              <img src='assets/images/logo.png' alt='' />
            </Link>
            <h4 className='mb-12'>Sign Up to your Account</h4>
            {/* <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p> */}
          </div>
          <form action='#'>

               <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:person' />
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Username'
              />
            </div>
               <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:building' />
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Company Name'
              />
            </div>
                 <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='f7:phone' />
              </span>
              <input
                type='text'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Mobile Number'
              />
            </div>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
                type='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
              />
            </div>


            <button
              type='submit'
              className='btn btn-primary grip text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
            >
              {" "}
             <Link to='/membership-application' className=' fw-semibold text-white'>
                Sign up
                </Link>
            </button>


            <div className='mt-32 text-center text-sm'>
              <p className='mb-0'>
                Already have an account?{" "}
                <Link to='/' className='text-primary-600 fw-semibold'>
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUpLayer;
