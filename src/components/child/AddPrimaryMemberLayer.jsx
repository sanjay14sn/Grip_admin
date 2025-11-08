import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Link } from 'react-router-dom';

const AddPrimaryMemberLayer = () => {
    return (
        <div className="col-lg-12">
                   <div className="card memshipform-grip">
                                   <div className="card-header">
                                       <h6 className="card-title mb-0">Chapter Information</h6>
                                   </div>
                                   <div className="card-body">
                                       <div className="row gy-3">
                                           <div className="col-4 ">
                                               <label className="form-label">Select Region </label>
                                               <select class="form-control form-select">
                                                   <option value="Date">Select Region </option>
                                                   <option value="1" selected="">Chennai</option>
                                               </select>

                                           </div>
                                           <div className="col-4">
                                               <label className="form-label">Chapter Name  </label>
                                               <select class="form-control form-select">

                                                   <option value="">Select Chapter</option>
                                                   <option value="aram Tuesday">GRIP Aram (Tuesday)</option>
                                                   <option value="virutcham Wednesday">GRIP Virutcham (Wednesday)</option>
                                                   <option value="madhuram Thursday">GRIP Madhuram (Thursday)</option>
                                                   <option value="kireedam Friday">GRIP Kireedam (Friday)</option>


                                                   <option value="amudham Saturday">GRIP Amudham (Saturday)</option>
                                               </select>
                                           </div>
                                           <div className="col-4">
                                               <label className="form-label">Chapter Induction Directors (CID)  </label>
                                               <select class="form-control form-select">

                                                   <option value=""> Select Name </option>
                                                   <option value="rajesh">Rajesh</option>
                                                   <option value="madhu">Madhu</option>
                                                   <option value="praburajan">Praburajan</option>
                                                   <option value="gajendran">Gajendran</option>
                                                   <option value="kirubakaran">Kirubakaran</option>
                                                   <option value="Kumar Subramaniam">Kumar Subramaniam</option>
                                                   <option value="Palanikumar">Palanikumar</option>

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


                                       </div>
                                   </div>
                               </div>
                               {/* card end */}
                               <div className="card mt-24">
                                   <div className="card-header">
                                       <h6 className="card-title mb-0">Personal Details</h6>
                                   </div>
                                   <div className="card-body">
                                       <div className="row gy-3">
                                           <div className="col-4">
                                               <label className="form-label">First Name  </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>

                                           <div className="col-4">
                                               <label className="form-label">Last Name </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>


                                           <div className="col-4">
                                               <label className="form-label">Company Name </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>


                                           <div className="col-4">
                                               <label className="form-label">Industry </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>


                                           <div className="col-4">
                                               <label className="form-label">
                                                   Category You Represent  </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>


                                           <div className="col-4">
                                               <label className="form-label">
                                                   Date of Birth  </label>
                                               <input type="date" name="#0" class="form-control" />
                                           </div>


                                           <div className="col-6">
                                               <label className="form-label">Have you or your company ever been a member of GRIP chapter? </label>
                                               <select class="form-control form-select">
                                                   <option value="Date">Select  </option>
                                                   <option value="yes" selected="">Yes</option>
                                                   <option value="no" >No</option>
                                               </select>

                                           </div>


                                           <div className="col-6">
                                               <label className="form-label">Do you belong to any other networking
                                                   organisations? </label>
                                               <select class="form-control form-select">
                                                   <option value="Date">Select  </option>
                                                   <option value="yes" selected="">Yes</option>
                                                   <option value="no" >No</option>
                                               </select>

                                           </div>

                                       </div>
                                   </div>
                               </div>




                               <div className="card mt-24">
                                   <div className="card-header">
                                       <h6 className="card-title mb-0">Business Address</h6>
                                   </div>
                                   <div className="card-body">
                                       <div className="row gy-3">
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
                                   </div>
                               </div>
                               {/* card end */}





                               <div className="card mt-24">
                                   <div className="card-header">
                                       <h6 className="card-title mb-0">Contact Details</h6>
                                   </div>
                                   <div className="card-body">
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


                                       </div>
                                   </div>
                               </div>





                               <div className="card mt-24">
                                   <div className="card-header">
                                       <h5 className="card-title mb-0">Business Experience</h5>
                                   </div>
                                   <div className="card-body">
                                       <div className="row">
                                           <div className="col-lg-4">
                                               <label className="form-label">Share your business experience </label>
                                               <textarea
                                                   name="#0"
                                                   className="form-control"
                                                   rows={3}
                                                   cols={50}

                                                   defaultValue={""}
                                               />
                                           </div>
                                           <div className="col-lg-4">
                                               <label className="form-label">Length of time in business</label>
                                               <textarea
                                                   name="#0"
                                                   className="form-control"
                                                   rows={3}
                                                   cols={50}


                                               />
                                           </div>
                                           <div className="col-lg-4 ">
                                               <label className="form-label">
                                                   Educational Background</label>
                                               <textarea
                                                   className="form-control"
                                                   rows={3}
                                                   cols={50}


                                               />

                                           </div>
                                       </div>
                                   </div>
                               </div>



                               <div className="card mt-24">
                                   <div className="card-header">
                                       <h6 className="card-title mb-0">Business References</h6>
                                       <span>   These references won't be used for promotion</span>
                                   </div>
                                   <div className="card-body">

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



                                           <div className="col-4">
                                               <label className="form-label">Phone </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>


                                           <div className="col-4">
                                               <label className="form-label">
                                                   Email </label>
                                               <input
                                                   type="email"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>


                                           <div className="col-4 mb-20">
                                               <label className="form-label">
                                                   Relationship </label>
                                               <input
                                                   type="text"
                                                   name="#0"
                                                   className="form-control"

                                               />
                                           </div>

                                           <div className="col-12">

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










                                       </div>
                                   </div>
                               </div>



                               <div className="card mt-24">
                                   <div className="card-header">
                                       <h6 className="card-title mb-0">Terms and Certifications</h6>

                                   </div>
                                   <div className="card-body">

                                       <div className="row gy-3">



                                           <div className="col-12 pb-30">

                                               <div class="form-check style-check d-flex align-items-center mb-10">
                                                   <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                   <label class="form-check-label" for="check1">
                                                       I will be able to attend our GRIP weekly meetings on time.</label>

                                               </div>

                                               <div class="form-check style-check d-flex align-items-center">
                                                   <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                   <label class="form-check-label" for="check1">
                                                       I will be able to bring visitors to this GRIP chapter meetings.</label>
                                               </div>



                                               <div class="form-check style-check d-flex align-items-center">
                                                   <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                   <label class="form-check-label" for="check1">
                                                      I will always display a positive attitude.</label>
                                               </div>


                                               <div class="form-check style-check d-flex align-items-center">
                                                   <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                   <label class="form-check-label" for="check1">
                                                      I understand that "Contributors Win"™</label>
                                               </div>


                                               <div class="form-check style-check d-flex align-items-center">
                                                   <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                   <label class="form-check-label" for="check1">
                                                      I will abide by the policies of GRIP.</label>
                                               </div>

                                                       <div class="form-check style-check d-flex align-items-center">
                                                   <input class="form-check-input" type="checkbox" id="check1" value="" />
                                                   <label class="form-check-label" for="check1">
                                                      I will contribute to the best of my knowledge & ability.</label>
                                               </div>



                                           </div>





           <div className="col-12">
                                   <button type="submit" className="btn btn-primary grip">
                                      <Link to='/' className=' '>
                       Submit Application
                       </Link>
                                   </button>
                               </div>




                                       </div>
                                   </div>
                               </div>



        </div>
    )
}

export default AddPrimaryMemberLayer