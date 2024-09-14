import { useEffect, useReducer, useRef, useState } from "react";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import photo from "../../../assets/others/photo.jpg";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
import JoditEditor from "jodit-react";
import CloseIcon from "@mui/icons-material/Close";

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

  selfieImage?: string;
}

// Reducer Action Types
// Reducer Action Types
type Action =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: User }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "UPDATE_REQUEST" }
  | { type: "UPDATE_SUCCESS" }
  | { type: "UPDATE_FAIL" }
  | { type: "UPLOAD_IMAGE_REQUEST" }
  | { type: "UPLOAD_IMAGE_SUCCESS" }
  | { type: "UPLOAD_IMAGE_FAIL" }
  | { type: "UPLOAD_PARTY_IMAGE_REQUEST" }
  | { type: "UPLOAD_PARTY_IMAGE_SUCCESS" }
  | { type: "UPLOAD_PARTY_IMAGE_FAIL" }
  | { type: "UPLOAD_RUNNING_MATE_IMAGE_REQUEST" }
  | { type: "UPLOAD_RUNNING_MATE_IMAGE_SUCCESS" }
  | { type: "UPLOAD_RUNNING_MATE_IMAGE_FAIL" }
  | { type: "UPLOAD_BANNER_REQUEST" }
  | { type: "UPLOAD_BANNER_SUCCESS" }
  | { type: "UPLOAD_BANNER_FAIL" };

// Reducer State Type
interface State {
  loading: boolean;
  loadingUpdate: boolean;
  loadingImageUpload: boolean;
  loadingPartyImageUpload: boolean;
  loadingRunningMateImageUpload: boolean;
  loadingBannerUpload: boolean;
  error: string;
  user?: User;
}

// Initial State
const initialState: State = {
  loading: true,
  loadingUpdate: false,
  loadingImageUpload: false,
  loadingPartyImageUpload: false,
  loadingRunningMateImageUpload: false,
  loadingBannerUpload: false,
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

    // Image Upload States
    case "UPLOAD_IMAGE_REQUEST":
      return { ...state, loadingImageUpload: true };
    case "UPLOAD_IMAGE_SUCCESS":
    case "UPLOAD_IMAGE_FAIL":
      return { ...state, loadingImageUpload: false };

    case "UPLOAD_PARTY_IMAGE_REQUEST":
      return { ...state, loadingPartyImageUpload: true };
    case "UPLOAD_PARTY_IMAGE_SUCCESS":
    case "UPLOAD_PARTY_IMAGE_FAIL":
      return { ...state, loadingPartyImageUpload: false };

    case "UPLOAD_RUNNING_MATE_IMAGE_REQUEST":
      return { ...state, loadingRunningMateImageUpload: true };
    case "UPLOAD_RUNNING_MATE_IMAGE_SUCCESS":
    case "UPLOAD_RUNNING_MATE_IMAGE_FAIL":
      return { ...state, loadingRunningMateImageUpload: false };

    case "UPLOAD_BANNER_REQUEST":
      return { ...state, loadingBannerUpload: true };
    case "UPLOAD_BANNER_SUCCESS":
    case "UPLOAD_BANNER_FAIL":
      return { ...state, loadingBannerUpload: false };

    default:
      return state;
  }
};

function UserEdit() {
  const navigate = useNavigate();

  const params = useParams();
  const { id: userId } = params;

  const editor = useRef(null);

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [
    {
      loading,
      error,
      loadingUpdate,
      loadingImageUpload,
      loadingPartyImageUpload,
      loadingRunningMateImageUpload,
      loadingBannerUpload,
      user,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

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
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState("");
  const [achievement, setAchievement] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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
      setAbout(data.about || "");
      setEducation(data.education || "");
      setAchievement(data.achievement || "");
      setRole(data.role || "");
      setIsAdmin(data.isAdmin);

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
          about,
          education,
          achievement,
          role,
          isAdmin,

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
      // Dispatch the corresponding action based on the field
      switch (field) {
        case "image":
          dispatch({ type: "UPLOAD_IMAGE_REQUEST" });
          break;
        case "partyImage":
          dispatch({ type: "UPLOAD_PARTY_IMAGE_REQUEST" });
          break;
        case "runningMateImage":
          dispatch({ type: "UPLOAD_RUNNING_MATE_IMAGE_REQUEST" });
          break;
        case "banner":
          dispatch({ type: "UPLOAD_BANNER_REQUEST" });
          break;
      }
      const { data } = await axios.post<{ secure_url: string; url: string }>(
        `${request}/api/upload`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      // Use secure_url or url from the response
      const imageUrl = data.secure_url || data.url;

      if (imageUrl) {
        console.log("Setting IMAGE URL:", imageUrl);
        switch (field) {
          case "image":
            dispatch({ type: "UPLOAD_IMAGE_SUCCESS" });
            setImage(imageUrl);
            break;
          case "partyImage":
            dispatch({ type: "UPLOAD_PARTY_IMAGE_SUCCESS" });
            setPartyImage(imageUrl);
            break;
          case "runningMateImage":
            dispatch({ type: "UPLOAD_RUNNING_MATE_IMAGE_SUCCESS" });
            setRunningMateImage(imageUrl);
            break;
          case "banner":
            dispatch({ type: "UPLOAD_BANNER_SUCCESS" });
            setBanner(imageUrl);
            break;
        }

        toast.success("Image uploaded successfully", {
          position: "bottom-center",
        });
      } else {
        console.error("No URL returned in response");
      }
    } catch (err) {
      toast.error(getError(err as Error), { position: "bottom-center" });
      switch (field) {
        case "image":
          dispatch({ type: "UPLOAD_IMAGE_FAIL" });
          break;
        case "partyImage":
          dispatch({ type: "UPLOAD_PARTY_IMAGE_FAIL" });
          break;
        case "runningMateImage":
          dispatch({ type: "UPLOAD_RUNNING_MATE_IMAGE_FAIL" });
          break;
        case "banner":
          dispatch({ type: "UPLOAD_BANNER_FAIL" });
          break;
      }
    }
  };

  console.log("SELFIE:", user?.selfieImage);
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
                  <div className="img_parent a_flex">
                    <div className="user_img">
                      <label htmlFor="">User Image:</label>
                      <div className="drop_zone">
                        <img
                          src={image ? image : photo}
                          alt="Election"
                          className="images"
                        />
                        <div className="icon_bg l_flex">
                          <label
                            htmlFor="userImage"
                            className={
                              loadingImageUpload
                                ? "upload_box disabled l_flex"
                                : "upload_box l_flex"
                            }
                          >
                            {loadingImageUpload ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              <label>
                                <div className="inner">
                                  <div className="icon_btn">
                                    <CloudUploadIcon
                                      className={image ? "icon white" : "icon"}
                                    />
                                  </div>
                                </div>
                                <input
                                  style={{ display: "none" }}
                                  type="file"
                                  id="userImage"
                                  onChange={(e) =>
                                    uploadFileHandler(e, "image")
                                  } // Pass the correct field
                                />
                              </label>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="left_selfie_party">
                      <div className=" a_flex">
                        <div className="user_img">
                          <label htmlFor="">Selfie:</label>
                          <div className="drop_zone running_mate">
                            <img
                              src={user?.selfieImage}
                              alt="Selfie"
                              className="images"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="user_party_img">
                        <label htmlFor="">Party Logo:</label>
                        <div className="drop_zone">
                          <img
                            src={partyImage ? partyImage : photo}
                            alt="Election"
                            className="images"
                          />
                          <div className="icon_bg l_flex">
                            <label
                              htmlFor="partyImage"
                              className={
                                loadingPartyImageUpload
                                  ? "upload_box disabled l_flex"
                                  : "upload_box l_flex"
                              }
                            >
                              {loadingPartyImageUpload ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <label>
                                  <div className="inner">
                                    <div className="icon_btn">
                                      <CloudUploadIcon
                                        className={
                                          partyImage ? "icon white" : "icon"
                                        }
                                      />
                                    </div>
                                  </div>
                                  <input
                                    style={{ display: "none" }}
                                    type="file"
                                    id="partyImage"
                                    onChange={(e) =>
                                      uploadFileHandler(e, "partyImage")
                                    } // Pass the correct field
                                  />
                                </label>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="img_parent a_flex">
                    <div className="user_img">
                      <label htmlFor="">Running Mate Image:</label>
                      <div className="drop_zone running_mate">
                        <img
                          src={runningMateImage ? runningMateImage : photo}
                          alt="Election"
                          className="images"
                        />
                        <div className="icon_bg l_flex">
                          <label
                            htmlFor="runningMateImage"
                            className={
                              loadingRunningMateImageUpload
                                ? "upload_box disabled l_flex"
                                : "upload_box l_flex"
                            }
                          >
                            {loadingRunningMateImageUpload ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              <label>
                                <div className="inner">
                                  <div className="icon_btn">
                                    <CloudUploadIcon
                                      className={
                                        runningMateImage ? "icon white" : "icon"
                                      }
                                    />
                                  </div>
                                </div>
                                <input
                                  style={{ display: "none" }}
                                  type="file"
                                  id="runningMateImage"
                                  onChange={(e) =>
                                    uploadFileHandler(e, "runningMateImage")
                                  } // Pass the correct field
                                />
                              </label>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="img_parent a_flex">
                    <div className="user_img banner_img">
                      <label htmlFor="">Banner:</label>
                      <div className="drop_zone running_mate">
                        <img
                          src={banner ? banner : photo}
                          alt="Election"
                          className="images"
                        />
                        <div className="icon_bg l_flex">
                          <label
                            htmlFor="banner"
                            className={
                              loadingBannerUpload
                                ? "upload_box disabled l_flex"
                                : "upload_box l_flex"
                            }
                          >
                            {loadingBannerUpload ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              <label>
                                <div className="inner">
                                  <div className="icon_btn">
                                    <CloudUploadIcon
                                      className={banner ? "icon white" : "icon"}
                                    />
                                  </div>
                                </div>
                                <input
                                  style={{ display: "none" }}
                                  type="file"
                                  id="banner"
                                  onChange={(e) =>
                                    uploadFileHandler(e, "banner")
                                  } // Pass the correct field
                                />
                              </label>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
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
                        <label htmlFor="">Gender</label>
                        <input
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          type="text"
                          placeholder="male"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="">Phone</label>
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          type="text"
                          placeholder="08123456789"
                        />
                      </div>{" "}
                      {/* ROLES */}
                      <div className="formInput">
                        <label htmlFor="role">Role</label>
                        <select
                          name="role"
                          className="select"
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
                      <div className="formInput formUserType d_flex">
                        <span className="checkBox a_flex ">
                          <input
                            type="checkbox"
                            checked={isAdmin}
                            id="isAdmin"
                            disabled={userInfo?._id === user?._id}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                          />
                          <label htmlFor="isAdmin">IsAdmin</label>
                        </span>
                      </div>
                    </div>
                    <div className="form_group politician">
                      <div className="formInput">
                        <label htmlFor="title">Position</label>
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          type="text"
                          placeholder="Senator"
                          id="title"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="partyName">Party</label>
                        <input
                          value={partyName}
                          onChange={(e) => setPartyName(e.target.value)}
                          type="text"
                          placeholder="PDP"
                          id="partyName"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="contestingFor">Contesting For</label>
                        <input
                          value={contestingFor}
                          onChange={(e) => setContestingFor(e.target.value)}
                          type="text"
                          placeholder="Governor"
                          id="contestingFor"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="runningMateName">
                          Running Mate Name
                        </label>
                        <input
                          value={runningMateName}
                          onChange={(e) => setRunningMateName(e.target.value)}
                          type="text"
                          placeholder="Governor"
                          id="runningMateName"
                        />
                      </div>
                      <div className="formInput">
                        <label htmlFor="runningMateTitle">
                          Running Mate Position
                        </label>
                        <input
                          value={runningMateTitle}
                          onChange={(e) => setRunningMateTitle(e.target.value)}
                          type="text"
                          placeholder="Governor"
                          id="runningMateTitle"
                        />
                      </div>
                    </div>
                    <div className="form_group_jodit">
                      <div className="formInput">
                        <label htmlFor="about">About:</label>
                        <textarea
                          name="text"
                          id="about"
                          className="textarea"
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                          placeholder="about user..."
                        ></textarea>
                      </div>
                      <div className="formInput">
                        <label htmlFor="education">Education:</label>
                        <textarea
                          name="text"
                          id="education"
                          className="textarea"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          placeholder="education status..."
                        ></textarea>
                      </div>
                      <div className="formInput">
                        <label htmlFor="achievement">Achievement:</label>
                        <textarea
                          name="text"
                          id="achievement"
                          className="textarea"
                          value={achievement}
                          onChange={(e) => setAchievement(e.target.value)}
                          placeholder="achievement..."
                        ></textarea>
                      </div>
                      <div className="formInput">
                        <label htmlFor="manifesto">Manifesto:</label>
                        <JoditEditor
                          className="editor"
                          ref={editor}
                          value={manifesto}
                          onBlur={(newContent) => setManifesto(newContent)} // preferred to use only this option to update the content for performance reasons
                        />
                      </div>
                    </div>
                    <div className="bottom_btn a_flex">
                      {" "}
                      <button
                        className="cancel a_flex"
                        onClick={() => navigate("/users")}
                      >
                        <CloseIcon className="icon" /> Cancel
                      </button>
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
