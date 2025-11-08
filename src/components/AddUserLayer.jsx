// import { Icon } from '@iconify/react/dist/iconify.js';
// import React, { useState,useEffect } from 'react';
// import roleApiProvider from '../apiProvider/roleApi';

// const AddUserLayer = () => {

//     const [imagePreviewUrl, setImagePreviewUrl] = useState('');
//     const [roleOptions, setRoleOptions] = useState([]);



//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreviewUrl(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     useEffect(() => {
//         fetchRoleData()
//     }, [])

//     const fetchRoleData = async () => {
//         // const input = {
//         //     page:page,
//         //     limit:limit,

//         // }
//         const responce = await roleApiProvider.getRoles()
//         console.log(responce, "responce-get");
//         if (responce && responce.status) {
//             const RoleOPtions = responce.response.data.map((ival) => {
//                 return (
//                     {
//                         label: ival._id,
//                         value: ival.name
//                     }
//                 )
//             })
//             setRoleOptions(RoleOPtions)
//             console.log(RoleOPtions, "RoleOPtions");

//         }

//     }
//     return (
//         <div className="card h-100 p-0 radius-12">
//             <div className="card-body p-24">
//                 <div className="row justify-content-center">
//                     <div className="col-xxl-6 col-xl-8 col-lg-10">
//                         <div className="card border">
//                             <div className="card-body">
//                                 <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
//                                 {/* Upload Image Start */}
//                                 <div className="mb-24 mt-16">
//                                     <div className="avatar-upload">
//                                         <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
//                                             <input
//                                                 type="file"
//                                                 id="imageUpload"
//                                                 accept=".png, .jpg, .jpeg"
//                                                 hidden
//                                                 onChange={handleImageChange}
//                                             />
//                                             <label
//                                                 htmlFor="imageUpload"
//                                                 className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle">
//                                                 <Icon icon="solar:camera-outline" className="icon"></Icon>
//                                             </label>
//                                         </div>
//                                         <div className="avatar-preview">
//                                             <div
//                                                 id="imagePreview"
//                                                 style={{
//                                                     backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : '',

//                                                 }}
//                                             >
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 {/* Upload Image End */}
//                                 <form action="#">
//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="name"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Name <span className="text-danger-600">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control radius-8"
//                                             id="name"

//                                         />
//                                     </div>


//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="name"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Company  Name <span className="text-danger-600">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control radius-8"
//                                             id="name"

//                                         />
//                                     </div>
//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="number"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Mobile Number
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control radius-8"
//                                             id="number"

//                                         />
//                                     </div>
//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="email"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Email <span className="text-danger-600">*</span>
//                                         </label>
//                                         <input
//                                             type="email"
//                                             className="form-control radius-8"
//                                             id="email"

//                                         />
//                                     </div>


//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="number"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Username
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control radius-8"
//                                             id="number"

//                                         />
//                                     </div>


//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="number"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Password
//                                         </label>
//                                         <input
//                                             type="password"
//                                             name="#0"
//                                             className="form-control"
//                                             placeholder="*******"
//                                         />
//                                     </div>

//                                     <div className="mb-20">
//                                         <label
//                                             htmlFor="desig"
//                                             className="form-label fw-semibold text-primary-light text-sm mb-8"
//                                         >
//                                             Role
//                                             <span className="text-danger-600">*</span>{" "}
//                                         </label>
//                                         <select
//                                             className="form-control radius-8 form-select"
//                                             id="desig"
//                                             defaultValue="Enter Designation Title"
//                                         >
//                                             <option value="Enter Designation Title" >
//                                                 Select Role
//                                             </option>
//                                             <option value="founder">Founder</option>
//                                             <option value="admin">Admin</option>
//                                             <option value="staff">Staff</option>
//                                             <option value="ed">ED</option>
//                                             <option value="rd">RD</option>
//                                             <option value="president">President</option>
//                                             <option value="vicepresident">Vice President</option>
//                                         </select>
//                                     </div>

//                                     <div className="d-flex align-items-center justify-content-center gap-3">
//                                         <button
//                                             type="button"
//                                             className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             type="submit"
//                                             className="btn btn-primary grip  text-md px-56 py-12 radius-8"
//                                         >
//                                             Save
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>

//     );
// };

// export default AddUserLayer;
import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import roleApiProvider from '../apiProvider/roleApi';
import userApiProvider from '../apiProvider/userApi';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { IMAGE_BASE_URL } from '../network/apiClient';


const AddUserLayer = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [roleOptions, setRoleOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [error, setError] = useState({});
    const [userData, setUserData] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        username: '',
        pin: '',
        mobileNumber: '',
        role: ''
    });

    useEffect(() => {
        fetchRoleData();
        if (isEditMode) {
            fetchUserData();
        }
    }, [id]);

    const fetchRoleData = async () => {
        try {
            const response = await roleApiProvider.getRoles();
            if (response && response.status) {
                const options = response.response.data.map((item) => ({
                    label: item._id,
                    value: item.name
                }));
                setRoleOptions(options);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await userApiProvider.getUserById(id);
            console.log(response, "response-getUserById");
            
            if (response && response.status) {
                const user = response.response.data;
                setFormData({
                    name: user.name,
                    companyName: user.companyName,
                    email: user.email,
                    username: user.username,
                    pin: '', // Don't pre-fill PIN for security
                    mobileNumber: user.mobileNumber,
                    role: user?.role._id,
                    image: user.profileImage || ''
                });
                if (user.profileImage) {
                    // setImagePreviewUrl(user.profileImage);
                }
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Validate PIN input (only digits, max 4 characters)
        if (id === 'pin' && !/^\d{0,4}$/.test(value)) {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleRoleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            role: e.target.value
        }));
    };

    const togglePinVisibility = () => {
        setShowPin(!showPin);
    };

    const handleSubmit = async (e) => {
        console.log("handleSubmit called", formData, "isEditMode:", isEditMode);
        e.preventDefault();

        // Validate required fields
        e.preventDefault();
        const errors = {}
        // Validate required fields
        if (!formData.name?.trim()) {
            errors.name = "Please enter your name";
            setError(errors)
            return false
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            errors.name = "Name should contain only alphabets";
            setError(errors)
            return false
        }

        // Validate Company Name
        if (!formData.companyName?.trim()) {
            errors.companyName = "Please enter company name";
            setError(errors)
            return false
        } else if (!/^[a-zA-Z0-9\s\-,.&'()]+$/.test(formData.companyName)) {
            errors.companyName = "Company name contains invalid characters";
            setError(errors)
            return false
        }

        // Validate Mobile Number (exactly 10 digits)
        if (!formData.mobileNumber?.trim()) {
            errors.mobileNumber = "Please enter mobile number";
            setError(errors)
            return false
        } else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
            errors.mobileNumber = "Mobile number must be 10 digits";
            setError(errors)
            return false
        }

        // Validate Email
        if (!formData.email?.trim()) {
            errors.email = "Please enter email";
            setError(errors)
            return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Please enter a valid email";
            setError(errors)
            return false
        }

        // Validate Username
        if (!formData.username?.trim()) {
            errors.username = "Please enter username";
            setError(errors)
            return false
        }
        if (formData.username.length < 4) {
            errors.username = "Username must be at least 4 characters";
            setError(errors)
            return false
        }

        // Validate PIN (exactly 4 digits)
        if(!isEditMode){
            if (!formData.pin?.trim()) {
                errors.pin = "Please enter PIN";
                setError(errors)
                return false
            }
            if (!/^[0-9]{4}$/.test(formData.pin)) {
                errors.pin = "PIN must be exactly 4 digits";
                setError(errors)
                return false
            }
        }
        // if (!formData.pin?.trim()) {
        //     errors.pin = "Please enter PIN";
        //     setError(errors)
        //     return false
        // }
        // if (!/^[0-9]{4}$/.test(formData.pin)) {
        //     errors.pin = "PIN must be exactly 4 digits";
        //     setError(errors)
        //     return false
        // }

        // Validate Role
        if (!formData.role) {
            errors.role = "Please select a role";
            setError(errors)
            return false
        }
        setLoading(true);

        // Validate PIN for new users
        if (!isEditMode && (!formData.pin || !/^\d{4}$/.test(formData.pin))) {
            Swal.fire({
                title: 'Error!',
                text: 'PIN must be exactly 4 digits',
                icon: 'error',
                customClass: {
                    popup: 'small-swal-popup',
                    title: 'small-swal-title',
                    htmlContainer: 'small-swal-text'
                },
                width: '400px'
            });
            return;
        }

        setLoading(true);

        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('companyName', formData.companyName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('pin', formData.pin);
        formDataToSend.append('mobileNumber', formData.mobileNumber);
        formDataToSend.append('role', formData.role);

        // Append the file if selected
        if (selectedFile) {
            formDataToSend.append('profileImage', selectedFile);
        }
        console.log(...formDataToSend, "formDataToSend");
        // return
        try {
            let response;
            if (isEditMode) {
                response = await userApiProvider.updateUser(id, formDataToSend);
            } else {
                response = await userApiProvider.addUsers(formDataToSend);
            }

            if (response && response.status) {
                Swal.fire({
                    title: 'Success!',
                    text: `User ${isEditMode ? 'updated' : 'created'} successfully.`,
                    icon: 'success',
                    customClass: {
                        popup: 'small-swal-popup',
                        title: 'small-swal-title',
                        htmlContainer: 'small-swal-text'
                    },
                    width: '400px'
                }).then(() => {
                    navigate("/users-list");
                });
            }
            else {
                console.log(response)
                toast.error(response?.response)
            }
        } catch (error) {
            console.log(error, "error")
            // Show more detailed error message
            toast.error(error.response?.data?.message ||
                error.message ||
                `An error occurred while ${isEditMode ? 'updating' : 'creating'} user`);
        } finally {
            setLoading(false);
        }
    };
console.log(formData, "formData");
console.log("imagePreviewUrl", imagePreviewUrl);


    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         const storedUserData = JSON.parse(localStorage.getItem("userData"));
    //         if (storedUserData) {
    //             const response = await userApiProvider.getUserById(storedUserData?.id);
    //             if (response && response.status) {
    //                 const data = response.response.data;
    //                 console.log(data, "data")
    //                 setUserData(data);

    //                 // Set initial form values from user data
    //                 // setFormData({
    //                 //     firstName: data.personalDetails?.firstName || '',
    //                 //     lastName: data.personalDetails?.lastName || '',
    //                 //     companyName: data.personalDetails?.companyName || '',
    //                 //     mobileNumber: data.contactDetails?.mobileNumber || '',
    //                 //     email: data.contactDetails?.email || '',
    //                 //     image: data.personalDetails?.profileImage || ''
    //                 //     // username: '', // Add if available in your data
    //                 //     // password: ''  // Typically you wouldn't pre-fill passwords
    //                 // });

    //                 // Set initial image if available
    //                 if (data.profileImageUrl) {
    //                     setImagePreviewUrl(data.profileImageUrl);
    //                 }
    //             }
    //         }
    //     };

    //     fetchUserData();
    // }, []);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-xxl-6 col-xl-8 col-lg-10">
                        <div className="card border">
                            <div className="card-body">
                                <h6 className="text-md text-primary-light mb-16">Profile Image</h6>
                                <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={handleImageChange}
                                                disabled={loading}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle">
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : formData?.image ? `url(${IMAGE_BASE_URL}/${formData.image.docPath}/${formData.image.docName})` :
                                                        '',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-20">
                                        <label htmlFor="name" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Name <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {error && error.name ? <span className='text-danger'>{error.name}</span> : <></>}
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="companyName" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Company Name <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {error && error.companyName ? <span className='text-danger'>{error.companyName}</span> : <></>}
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="mobileNumber" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Mobile Number <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control radius-8"
                                            id="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {error && error.mobileNumber ? <span className='text-danger'>{error.mobileNumber}</span> : <></>}
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="email" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Email <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control radius-8"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {error && error.email ? <span className='text-danger'>{error.email}</span> : <></>}
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="username" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Username <span className="text-danger-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control radius-8"
                                            id="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                        />
                                        {error && error.username ? <span>{error.username}</span> : <></>}
                                    </div>

                                    {!isEditMode && (
                                        <div className="mb-20">
                                            <label htmlFor="pin" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                                PIN <span className="text-danger-600">*</span>
                                            </label>
                                            <div className="position-relative">
                                                <input
                                                    type={showPin ? "text" : "password"}
                                                    className="form-control radius-8"
                                                    id="pin"
                                                    placeholder="Enter 4-digit PIN"
                                                    value={formData.pin}
                                                    onChange={handleInputChange}
                                                    maxLength="4"
                                                    pattern="\d{4}"
                                                    disabled={loading}
                                                />
                                                <span
                                                    className="toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                                                    onClick={togglePinVisibility}
                                                >
                                                    {/* <Icon icon={showPin ? "mdi:eye-off" : "mdi:eye"} /> */}
                                                </span>
                                                {error && error.pin ? <span className='text-danger'>{error.pin}</span> : <></>}
                                            </div>
                                            <small className="text-muted">Must be exactly 4 digits (numbers only)</small>
                                        </div>
                                    )}

                                    <div className="mb-20">
                                        <label htmlFor="role" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            Role <span className="text-danger-600">*</span>
                                        </label>
                                        <select
                                            className="form-control radius-8 form-select"
                                            id="role"
                                            value={formData.role}
                                            onChange={handleRoleChange}
                                            disabled={loading}
                                        >
                                            <option value="">Select Role</option>
                                            {roleOptions.map((option) => (
                                                <option key={option.label} value={option.label}>
                                                    {option.value}
                                                </option>
                                            ))}
                                        </select>
                                        {error && error.role ? <span className='text-danger'>{error.role}</span> : <></>}
                                    </div>

                                    <div className="d-flex align-items-center justify-content-center gap-3">
                                        <button
                                            type="button"
                                            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                                            onClick={() => navigate("/users-list")}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary grip text-md px-56 py-12 radius-8"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : isEditMode ? 'Update' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddUserLayer;