import { useContext, useEffect, useReducer, useState } from "react";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { Helmet } from "react-helmet-async";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import noimage from "../../../assets/noimage.png";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import "./styles.scss";
import { Context } from "../../../../context/Context";
import { request } from "../../../../base url/BaseUrl";
import { getError } from "../../../../utilities/utils/Utils";
import LoadingBox from "../../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../../utilities/message loading/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false };

    default:
      return state;
  }
};

function UserEdit() {
  const params = useParams();
  const { id: userId } = params;

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, loadingUpdate, loadingUpload, user }, dispatch] =
    useReducer(reducer, {
      user: [],
      loading: true,
      error: "",
    });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  //FETCHING
  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`${request}/api/users/info/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setPhone(data.phone);
      setAddress(data.address);
      setCountry(data.country);
      setIsAdmin(data.isAdmin);
      setIsSeller(data.isSeller);
      setImage(data.image);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };
  useEffect(() => {
    fetchData();
    
    console.log(userId);
  }, [userId, userInfo]);

  //UPDATE
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `${request}/api/users/${userId}`,
        {
          _id: userId,
          firstName,
          lastName,
          email,
          phone,
          address,
          country,
          image,
          isAdmin,
          isSeller,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      fetchData();
      toast.success("User updated successfully", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  //===============
  //PROFILE PICTURE
  //===============
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Log the file to check if it's selected

    if (!file) {
      return toast.error("No file selected", { position: "bottom-center" });
    }

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Image uploaded successfully", {
        position: "bottom-center",
      });
      setImage(data.publicUrl); // Assuming the response contains `publicUrl` based on backend code
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };
  console.log(user);

  return (
    <>
      <Helmet>
        <title>Edit User Info</title>
      </Helmet>
      <div className="product_edit admin_page_all">
        <div className="container">
          <div className=" ">
            <div className="productTitleContainer">
              <h3 className="productTitle light_shadow uppercase">
                Edit User Info
              </h3>
            </div>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div className="userEdit">
                <div className="ubottom">
                  <div className="left light_shadow">
                    <div className="featured">
                      <img src={image ? image : noimage} alt="" />
                    </div>
                  </div>
                  <div className="right light_shadow">
                    <form action="" onSubmit={submitHandler}>
                      <div className="form_group">
                        <div className="formInput ">
                          <label htmlFor="file" className="formInputLabel">
                            Image:{" "}
                            {loadingUpload ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              <>
                                <DriveFolderUploadIcon
                                  onChange={uploadFileHandler}
                                  className="icon"
                                />
                                <input
                                  onChange={uploadFileHandler}
                                  type="file"
                                  id="file"
                                  style={{ display: "none" }}
                                />
                              </>
                            )}{" "}
                          </label>
                        </div>

                        <div className="formInput">
                          <label htmlFor="firstName">First Name</label>
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            type="name"
                            placeholder="first name"
                            id="firstName"
                          />
                        </div>

                        <div className="formInput">
                          <label htmlFor="lastName">Last Name</label>
                          <input
                            type="name"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                        <div className="formInput">
                          <label htmlFor="">Phone</label>
                          {/* <input type="text" placeholder="+1 234 34 5465" /> */}
                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            id="specialInput"
                            className="userUpdateInput"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={setPhone}
                          />
                        </div>
                        <div className="formInput">
                          <label htmlFor="">Email</label>
                          <input
                            value={email}
                            // disabled={user?.isAdmin}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="tunji@gmail.com"
                          />
                        </div>
                        <div className="formInput">
                          <label htmlFor="">Address</label>
                          <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            type="text"
                            placeholder="70 Washington Square,"
                          />
                        </div>
                        <div className="formInput">
                          <label htmlFor="">Country</label>
                          <input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            type="text"
                            placeholder="USA"
                          />
                        </div>
                        <div className="formInput formUserType d_flex">
                          <span className="checkBox a_flex ">
                            <input
                              type="checkbox"
                              checked={isAdmin}
                              id="isAdmin"
                              onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                            <label htmlFor="isAdmin">IsAdmin</label>
                          </span>
                        </div>
                      </div>
                      <div className="bottom_btn ">
                        <button
                          type="submit"
                          className="a_flex"
                          disabled={loadingUpdate}
                        >
                          {loadingUpdate ? (
                            <div className="loading-spinner">Loading...</div>
                          ) : (
                            <>
                              <DescriptionOutlinedIcon className="icon" /> Save
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserEdit;
