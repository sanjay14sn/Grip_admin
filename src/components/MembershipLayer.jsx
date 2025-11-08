import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
// import React, { useState } from "react";


import { useNavigate } from 'react-router-dom';


const MembershipLayer = () => {

    const [networkingOrg, setNetworkingOrg] = useState("");

    const navigate = useNavigate();

    const [checkboxes, setCheckboxes] = useState({
        check1: false,
        check2: false,
        check3: false,
        check4: false,
        check5: false,
        check6: false,
    });

    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;
        setCheckboxes((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    const handleSubmit = () => {
        if (allChecked) {
            // ✅ Redirect to login
            navigate('/sign-in');
        }
    };

    const allChecked = Object.values(checkboxes).every(Boolean);

    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        if (currentStep < 7) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    return (
        <section className='membership-form-areaa  p-50 auth bg-base d-flex flex-wrap'>
            {/* <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <img src='assets/images/auth/grip-signup.jpg' alt='' />
        </div>
      </div> */}
            <div className='container'>
                <div className="row">






                    <div className='col-md-2'></div>


                    <div className='col-md-8'>
                        <div>
                            <Link to='/' className='mb-20 max-w-150-px'>
                                <img src='assets/images/logo.png' alt='' />
                            </Link>
                            <h4 className='mb-40 associate-title'>Associate Membership Application</h4>
                            {/* <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p> */}
                        </div>

                        <div className='card'>
                            <div className='card-body'>
                                {/* <h6 className='mb-4 text-xl'>Order By Following Step</h6>
                                <p className='text-neutral-500'>
                                    Fill up your details and proceed next steps.
                                </p> */}
                                {/* Form Wizard Start */}
                                <div className='form-wizard'>
                                    <form action='#' method='post'>
                                        <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
                                            <ul className='list-unstyled form-wizard-list style-two'>
                                                <li
                                                    className={`form-wizard-list__item
                      ${[2, 3, 4].includes(currentStep) && "activated"}
                    ${currentStep === 1 && "active"} `}
                                                >
                                                    <div className='form-wizard-list__line'>
                                                        <span className='count'>1</span>
                                                    </div>
                                                    <span className='text text-xs fw-semibold'>
                                                        Chapter Info{" "}
                                                    </span>
                                                </li>
                                                <li
                                                    className={`form-wizard-list__item
                      ${[3, 4].includes(currentStep) && "activated"}
                    ${currentStep === 2 && "active"} `}
                                                >
                                                    <div className='form-wizard-list__line'>
                                                        <span className='count'>2</span>
                                                    </div>
                                                    <span className='text text-xs fw-semibold'>
                                                        Personal Details
                                                    </span>
                                                </li>
                                                <li
                                                    className={`form-wizard-list__item
                      ${[4].includes(currentStep) && "activated"}
                    ${currentStep === 3 && "active"} `}
                                                >
                                                    <div className='form-wizard-list__line'>
                                                        <span className='count'>3</span>
                                                    </div>
                                                    <span className='text text-xs fw-semibold'>Business Details</span>
                                                </li>
                                                <li
                                                    className={`form-wizard-list__item

                    ${currentStep === 4 && "active"} `}
                                                >
                                                    <div className='form-wizard-list__line'>
                                                        <span className='count'>4</span>
                                                    </div>
                                                    <span className='text text-xs fw-semibold'>Completed</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <fieldset
                                            className={`wizard-fieldset ${currentStep === 1 && "show"} `}
                                        >
                                            {/* <h6 className='text-md text-neutral-500'>
                                                Chapter Information
                                            </h6> */}
                                            <div className='row gy-3'>
                                                <div className="col-6 ">
                                                    <label className="form-label">Select Zone </label>
                                                    <select class="form-control form-select">
                                                        <option value="Date">Select Zone </option>
                                                        <option value="1" selected="">Chennai</option>
                                                    </select>

                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label">Chapter Name  </label>
                                                    <select class="form-control form-select">

                                                        <option value="">Select Chapter</option>
                                                        <option value="aram Tuesday">GRIP Aram (Tuesday)</option>
                                                        <option value="virutcham Wednesday">GRIP Virutcham (Wednesday)</option>
                                                        <option value="madhuram Thursday">GRIP Madhuram (Thursday)</option>
                                                        <option value="kireedam Friday">GRIP Kireedam (Friday)</option>

                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label">Chapter Induction Directors (CID)  </label>
                                                    <select class="form-control form-select">

                                                        <option value=""> Select Name </option>
                                                        <option value="madhu">M Madhu</option>
                                                        <option value="rajesh">R Rajesh</option>
                                                        <option value="praburajan">E Praburajan</option>
                                                        <option value="gajendran">K Gajendran</option>
                                                        <option value="kirubakaran">K Kirubakaran</option>
                                                        <option value="r anand">R Anand</option>
                                                        <option value="Palanikumar">Palanikumar</option>
                                                        <option value="balasubramani">BalaSubramani</option>

                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label">Who invited you? </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label">
                                                        How did you hear about GRIP?   </label>
                                                    <select class="form-control form-select">
                                                        <option value="">Select an option </option>
                                                        <option value="Online">Online</option>
                                                        <option value="Facebook">Facebook</option>
                                                        <option value="Instagram">Instagram</option>
                                                        <option value="Friends">Friends</option>
                                                        <option value="WhatsApp">WhatsApp</option>
                                                        <option value="Other">Other</option>

                                                    </select>
                                                </div>

                                                <div className='form-group text-end'>
                                                    <button
                                                        onClick={nextStep}
                                                        type='button'
                                                        className='form-wizard-next-btn btn btn-primary grip px-32'
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>




                                        </fieldset>
                                        <fieldset
                                            className={`wizard-fieldset ${currentStep === 2 && "show"} `}
                                        >
                                            {/* <h6 className='text-md text-neutral-500'>
                                                Account Information
                                            </h6> */}
                                            <div className="row gy-3 mb-5">
                                                <div className="col-6">
                                                    <label className="form-label">First Name  </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <label className="form-label">Last Name </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-6">
                                                    <label className="form-label">Company Name </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-6">
                                                    <label className="form-label">Industry </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-6">
                                                    <label className="form-label">
                                                        Category You Represent  </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>




                                                <div className="col-4">
                                                    <label className="form-label">Date of Birth:</label>
                                                    <div className="d-flex gap-2">
                                                        {/* Day Dropdown */}
                                                        <select name="dob-day" className="form-control form-select">
                                                            <option value="">Day</option>
                                                            {[...Array(31)].map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                            ))}
                                                        </select>

                                                        {/* Month Dropdown */}
                                                        <select name="dob-month" className="form-control form-select">
                                                            <option value="">Month</option>
                                                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, i) => (
                                                                <option key={i + 1} value={i + 1}>{month}</option>
                                                            ))}
                                                        </select>

                                                        {/* Year Dropdown */}
                                                        <select name="dob-year" className="form-control form-select">
                                                            <option value="">Year</option>
                                                            {Array.from({ length: 100 }, (_, i) => {
                                                                const year = new Date().getFullYear() - i;
                                                                return <option key={year} value={year}>{year}</option>;
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>



                                                <div className="col-12">
                                                    <label className="form-label">Have you or your company ever been a member of GRIP chapter? </label>
                                                    <select class="form-control form-select">
                                                        <option value="Date">Select  </option>
                                                        <option value="yes" selected="">Yes</option>
                                                        <option value="no" >No</option>
                                                    </select>

                                                </div>


                                                <div className={networkingOrg === "yes" ? "col-6" : "col-12"}>
                                                    <label className="form-label">
                                                        Do you belong to any other networking organisations?
                                                    </label>
                                                    <select
                                                        className="form-select"
                                                        value={networkingOrg}
                                                        onChange={(e) => setNetworkingOrg(e.target.value)}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                </div>

                                                {/* Show this field only when "Yes" is selected */}
                                                {networkingOrg === "yes" && (
                                                    <div className="col-6">
                                                        <label className="form-label">Please specify the other networking
                                    organisations</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"

                                                        />
                                                    </div>
                                                )}


                                                <div className="col-12">
                                                    <label className="form-label">Education</label>
                                                    <select class="form-control form-select">
                                                        <option value="">Select Education</option>
                                                        <option value="High School">High School</option>
                                                        <option value="Diploma">Diploma in Business</option>
                                                        <option value="Bachelor">Bachelor's Degree</option>
                                                        <option value="MBA">MBA / Master's in Business</option>
                                                        <option value="Professional Degree">Professional Degree</option>
                                                        <option value="Entrepreneurship Certificate">Entrepreneurship Certificate</option>
                                                        <option value="Others">Others</option>
                                                    </select>

                                                </div>

                                            </div>


                                            <h6 className='text-md text-neutral-500'>
                                                <b>Contact Details</b>
                                            </h6>

                                            <div className="row gy-3">
                                                <div className="col-4">
                                                    <label className="form-label">Email  </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>

                                                <div className="col-4">
                                                    <label className="form-label">

                                                        Mobile Number  </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-4">
                                                    <label className="form-label">

                                                        Secondary Phone </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>

                                                <div className="col-6">
                                                    <label className="form-label">Website </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-6">
                                                    <label className="form-label">GST Number (Optional) </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className='form-group d-flex align-items-center justify-content-end gap-8 mt-5'>
                                                    <button
                                                        onClick={prevStep}
                                                        type='button'
                                                        className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        onClick={nextStep}
                                                        type='button'
                                                        className='form-wizard-next-btn btn btn-primary grip px-32'
                                                    >
                                                        Next
                                                    </button>
                                                </div>


                                            </div>
                                        </fieldset>
                                        <fieldset
                                            className={`wizard-fieldset ${currentStep === 3 && "show"} `}
                                        >
                                            <h6 className='text-md text-neutral-500'><b>Business Address</b></h6>
                                            <div className='row gy-3 mb-5'>
                                                <div className="col-4">
                                                    <label className="form-label">Address Line 1  </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>

                                                <div className="col-4">
                                                    <label className="form-label">
                                                        Address Line 2 </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-4">
                                                    <label className="form-label">State / Province  </label>
                                                    <select class="form-control form-select">
                                                        <option value="Date">Select State </option>
                                                        <option value="1" selected="">Tamilnadu</option>
                                                    </select>
                                                </div>


                                                <div className="col-6">
                                                    <label className="form-label">City  </label>
                                                    <select class="form-control form-select">
                                                        <option value="Date">Select State </option>
                                                        <option value="1" selected=""></option>
                                                    </select>
                                                </div>


                                                <div className="col-6">
                                                    <label className="form-label">Postal Code </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                            </div>
                                            <h6 className='text-md text-neutral-500'><b>Your Business Details</b></h6>
                                            <div className="row gy-3 mb-5">
                                                <div className="col-lg-6">
                                                    <label className="form-label">Describe Your Business Details </label>
                                                    <textarea
                                                        name="#0"
                                                        className="form-control"
                                                        rows={2}
                                                        cols={50}

                                                        defaultValue={""}
                                                    />
                                                </div>
                                                <div className="col-lg-6">
                                                    <label className="form-label">How many years are you in the business?  </label>

                                                    <select class="form-control form-select">
                                                        <option value="" disabled="" selected="">Select duration</option>
                                                        <option value="below_1_year">Below 1 year</option>
                                                        <option value="1_5_years">1 to 5 years</option>
                                                        <option value="6_10_years">6 to 10 years</option>
                                                        <option value="11_15_years">11 to 15 years</option>
                                                        <option value="above_15_years">Above 15 years</option>
                                                    </select>
                                                </div>



                                            </div>


                                            <h6 className="card-title mb-0">Business References</h6>
                                            <span>   These references won't be used for promotion</span>
                                            <div className="row gy-3">
                                                <div className="col-4">
                                                    <label className="form-label">Ref 1: First Name   </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>

                                                <div className="col-4">
                                                    <label className="form-label">

                                                        Ref 1: Last Name   </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>


                                                <div className="col-4">
                                                    <label className="form-label">


                                                        Business Name </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>



                                                <div className="col-6">
                                                    <label className="form-label">Phone </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>




                                                <div className="col-6 mb-20">
                                                    <label className="form-label">
                                                        Relationship </label>
                                                    <input
                                                        type="text"
                                                        name="#0"
                                                        className="form-control"

                                                    />
                                                </div>

                                                <div className="col-12 businessdetail mb-5">

                                                    <div class="form-check style-check d-flex align-items-center mb-10">
                                                        <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                        <label class="form-check-label" for="check1">
                                                            I have/will inform the above contacts that I’m sharing their info with GRIP.</label>

                                                    </div>

                                                    <div class="form-check style-check d-flex align-items-center">
                                                        <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                        <label class="form-check-label" for="check1">
                                                            I have/​will inform the above contacts that I am sharing their information with GRIP for the purpose of references</label>

                                                    </div>

                                                </div>




                                                <div className='form-group d-flex align-items-center justify-content-end gap-8 mt-3'>
                                                    <button
                                                        onClick={prevStep}
                                                        type='button'
                                                        className='form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32'
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        onClick={nextStep}
                                                        type='button'
                                                        className='form-wizard-next-btn btn btn-primary grip px-32'
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className={`wizard-fieldset ${currentStep === 4 ? "show" : ""}`}>
                                            <h6 className="card-title mb-0">Terms and Conditions</h6>

                                            <div className="row gy-3 pt-3 pb-5">
                                                <div className="col-12 pb-30">

                                                    {/* Checkboxes */}
                                                    {Object.entries({
                                                        check1: "I will be able to attend our GRIP weekly meetings on time.",
                                                        check2: "I will be able to bring visitors to this GRIP chapter meetings.",
                                                        check3: "I will always display a positive attitude.",
                                                        check4: "I understand that 'Contributors Win'™",
                                                        check5: "I will abide by the policies of GRIP.",
                                                        check6: "I will contribute to the best of my knowledge & ability.",
                                                    }).map(([id, label]) => (
                                                        <div className="form-check style-check d-flex align-items-center" key={id}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={id}
                                                                onChange={handleCheckboxChange}
                                                                checked={checkboxes[id]}
                                                            />
                                                            <label className="form-check-label" htmlFor={id}>{label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* ✅ Success Message */}
                                            {allChecked && (
                                                <div className='text-center mb-40'>
                                                    <img
                                                        src='assets/images/gif/success-img3.gif'
                                                        alt=''
                                                        className='gif-image mb-24'
                                                    />
                                                    <h6 className='text-md text-neutral-600'>Congratulations</h6>
                                                    <p className='text-neutral-400 text-sm mb-0'>
                                                        Well done! You have successfully completed.
                                                    </p>
                                                </div>
                                            )}

                                            {/* ✅ Buttons */}
                                            <div className='form-group d-flex align-items-center justify-content-end mt-5 gap-8'>
                                                <button
                                                    onClick={prevStep}
                                                    type='button'
                                                    className='form-wizard-previous-btn btn btn-neutral grip-black border-neutral-100 px-32'
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={handleSubmit}
                                                    type='button'
                                                    className='form-wizard-submit btn btn-primary grip px-32'
                                                    disabled={!allChecked}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </fieldset>
                                    </form>
                                </div>
                                {/* Form Wizard End */}
                            </div>
                        </div>
                    </div>







                    <div className='col-md-2'></div>





                </div>
            </div>

        </section>
    );
};

export default MembershipLayer;
