import {  useEffect, useReducer, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import noimage from "../../../assets/others/photo.jpg";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import "./styles.scss";
import LoadingBox from "../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../utilities/message loading/MessageBox";
import { request } from "../../../base url/BaseUrl";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";

const roleList = [
  { name: "Admin", value: "admin" },
  { name: "User", value: "user" },
  { name: "Politician", value: "politician" },
];

// Types for user fields
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  image?: string;
  stateOfOrigin?: string;
  stateOfResidence?: string;
  age?: number;
  gender?: string;
  region?: string;
  role: string;
  title?: string;
  partyImage?: string;
  partyName?: string;
  contestingFor?: string;
  runningMateName?: string;
  runningMateTitle?: string;
  runningMateImage?: string;
  banner?: string;
  biography?: string;
  manifesto?: string;
}

// Reducer Action Types
type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: User }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "UPDATE_REQUEST" }
  | { type: "UPDATE_SUCCESS" }
  | { type: "UPDATE_FAIL" }
  | { type: "UPLOAD_REQUEST" }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "UPLOAD_FAIL" };

// Reducer State Type
interface State {
  loading: boolean;
  loadingUpdate: boolean;
  loadingUpload: boolean;
  error: string;
  user?: User;
}

// Initial State
const initialState: State = {
  loading: true,
  loadingUpdate: false,
  loadingUpload: false,
  error: "",
};

// Reducer function
const reducer = (state: State, action: Action): State => {
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

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ loading, error, loadingUpdate, loadingUpload, user }, dispatch] =
    useReducer(reducer, initialState);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [stateOfResidence, setStateOfResidence] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");

  // POLITICIAN
  const [title, setTitle] = useState("");
  const [partyImage, setPartyImage] = useState("");
  const [partyName, setPartyName] = useState("");
  const [contestingFor, setContestingFor] = useState("");
  const [runningMateName, setRunningMateName] = useState("");
  const [runningMateTitle, setRunningMateTitle] = useState("");
  const [runningMateImage, setRunningMateImage] = useState("");
  const [banner, setBanner] = useState("");
  const [biography, setBiography] = useState("");
  const [manifesto, setManifesto] = useState("");

  //FETCHING
  const fetchData = async () => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.get(`${request}/api/users/info/${userId}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });

      // Set all the fields with the fetched data
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setPhone(data.phone || ""); // Ensure phone is optional
      setStateOfOrigin(data.stateOfOrigin || "");
      setStateOfResidence(data.stateOfResidence || "");
      setAge(data.age ? data.age.toString() : ""); // Convert age to string for input
      setGender(data.gender || "");
      setRegion(data.region || "");
      setImage(data.image || "");
      setRole(data.role || "");
      setTitle(data.title || "");
      setPartyImage(data.partyImage || "");
      setPartyName(data.partyName || "");
      setContestingFor(data.contestingFor || "");
      setRunningMateName(data.runningMateName || "");
      setRunningMateTitle(data.runningMateTitle || "");
      setRunningMateImage(data.runningMateImage || "");
      setBanner(data.banner || "");
      setBiography(data.biography || "");
      setManifesto(data.manifesto || "");

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };
  useEffect(() => {
    fetchData();

    console.log(userId);
  }, [userId, userInfo]);

  // UPDATE
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
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
          stateOfOrigin,
          stateOfResidence,
          age,
          gender,
          region,
          image,
          role,
          title,
          partyImage,
          partyName,
          contestingFor,
          runningMateName,
          runningMateTitle,
          runningMateImage,
          banner,
          biography,
          manifesto,
        },
        {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      fetchData();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  //===============
  // FILE HANDLER
  //===============
  const uploadFileHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "image" | "partyImage" | "runningMateImage" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return toast.error("No file selected", { position: "bottom-center" });
    }

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post<{ publicUrl: string }>(
        `/api/upload`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      dispatch({ type: "UPLOAD_SUCCESS" });
      toast.success("Image uploaded successfully", {
        position: "bottom-center",
      });

      // Update the state based on the field
      switch (field) {
        case "image":
          setImage(data.publicUrl);
          break;
        case "partyImage":
          setPartyImage(data.publicUrl);
          break;
        case "runningMateImage":
          setRunningMateImage(data.publicUrl);
          break;
        case "banner":
          setBanner(data.publicUrl);
          break;
      }
    } catch (err) {
      toast.error(getError(err as Error), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  // PHONE
  type E164Number = string;
  const handlePhoneChange = (value: E164Number | undefined) => {
    setPhone(value ? value.toString() : "");
  };
  console.log(user);

  return (
    <div className="product_edit admin_page_all">
      <div className="">
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
                        <label htmlFor="">State of Origin</label>
                        <input
                          value={stateOfOrigin}
                          onChange={(e) => setStateOfOrigin(e.target.value)}
                          type="text"
                          placeholder="lagos"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="">State of Residence</label>
                        <input
                          value={stateOfResidence}
                          onChange={(e) => setStateOfResidence(e.target.value)}
                          type="text"
                          placeholder="lagos"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="">Age</label>
                        <input
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          type="number"
                          placeholder="20"
                        />
                      </div>{" "}
                      <div className="formInput">
                        <label htmlFor="">Age</label>
                        <input
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          type="text"
                          placeholder="male"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="">Phone</label>
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          id="specialInput"
                          className="userUpdateInput"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={handlePhoneChange}
                          defaultCountry="NG"
                        />
                      </div>
                      {/* ROLES */}
                      <div className="formInput">
                        <label htmlFor="role">Role</label>
                        <select
                          name="role"
                          id="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Role
                          </option>
                          {roleList.map((item, index) => (
                            <option value={item.value} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="bottom_btn ">
                      <button
                        type="submit"
                        className="a_flex"
                        disabled={loadingUpdate}
                      >
                        {loadingUpdate ? (
                          <span className="a_flex">
                            <i className="fa fa-spinner fa-spin"></i>
                            Saving...
                          </span>
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
  );
}

export default UserEdit;
