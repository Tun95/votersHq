import { Helmet } from "react-helmet-async";
import MainNavBar from "../../../common/nav bar/main navbar/MainNavBar";
import Activities from "../../../components/profile/dashboard/Activities";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import MainFooter from "../../../common/footer/main footer/MainFooter";
import TabMainPanel from "../../../components/profile/dashboard/TabPanel";
import "./styles.scss";
import Details from "../../../components/profile/dashboard/Details";
import {
  ErrorResponse,
  getError,
  stateRegionMap,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { request } from "../../../base url/BaseUrl";
import { toast } from "react-toastify";
import {
  Action,
  initialState,
  State,
  SubmitHandlerParams,
  User,
} from "../../../types/profile/types";
import { GlobalContext, StateOfOrigin } from "../../../context/UserContext";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload as User,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload as string };

    case "CREATE_REQUEST":
      return { ...state, loading: true, error: "" };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload as string };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        loadingUpdate: false,
        user: action.payload as User,
        errorUpdate: "",
      };
    case "UPDATE_FAIL":
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: action.payload as string,
      };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        user: state.user
          ? { ...state.user, image: action.payload as string }
          : undefined,
        errorUpload: "",
      };

    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload as string,
      };

    default:
      return state;
  }
};

function DashboardScreen() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useContext must be used within a GlobalProvider");
  }
  const navigate = useNavigate();
  const params = useParams();
  const { id: userId } = params;

  const [{ loadingUpdate, loadingUpload, user }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!userInfo) {
      return navigate("/");
    }
    fetchData();
  }, [userId]);

  const { state: appState, dispatch: ctxDispatch } = useAppContext();
  const { userInfo } = appState;
  if (!userInfo) {
    // Handle case where userInfo is null or undefined
    console.error("User info is not available");
    return;
  }

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,

    image,
    about,
    setAbout,
    education,
    setEducation,
    achievement,
    setAchievement,
    setImage,
    ninNumber,
    setNinNumber,
    stateOfOrigin,
    setStateOfOrigin,
    stateOfResidence,
    setStateOfResidence,
    setRegion,
    password,
    setPassword,
  } = context;

  // FETCH DATA
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
      setImage(data.image);
      setAbout(data.about);
      setEducation(data.education);
      setAchievement(data.achievement);
      setNinNumber(data.ninNumber);
      setStateOfOrigin(data.stateOfOrigin);
      setStateOfResidence(data.stateOfResidence);
      setPassword(data.password);
      setRegion(stateRegionMap[stateOfOrigin]); // Set the initial region
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err as ErrorResponse) });
    }
  };

  // PROFILE UPDATE
  const submitHandler = async (params: SubmitHandlerParams) => {
    const {
      e,
      updatedEducation,
      updatedAchievement,
      updatedAbout,
      updatedPersonalInfo,
    } = params;

    if (e) {
      e.preventDefault();
    }

    const educationToUpdate = updatedEducation || education;
    const achievementToUpdate = updatedAchievement || achievement;
    const aboutToUpdate = updatedAbout || about;

    const firstNameToUpdate = updatedPersonalInfo?.firstName || firstName;
    const lastNameToUpdate = updatedPersonalInfo?.lastName || lastName;
    const emailToUpdate = updatedPersonalInfo?.email || email;
    const phoneToUpdate = updatedPersonalInfo?.phone || phone;
    const ninNumberToUpdate = updatedPersonalInfo?.ninNumber || ninNumber;
    const stateOfOriginToUpdate =
      updatedPersonalInfo?.stateOfOrigin || stateOfOrigin;
    const stateOfResidenceToUpdate =
      updatedPersonalInfo?.stateOfResidence || stateOfResidence;
    const imageToUpdate = updatedPersonalInfo?.image || image;

    // Validate the stateOfOrigin
    if (!(stateOfOriginToUpdate in stateRegionMap)) {
      toast.error("Invalid state of origin. Please enter a valid state.", {
        position: "bottom-center",
      });
      return; // Prevent submission if the state is invalid
    }

    const regionToUpdate =
      stateRegionMap[stateOfOriginToUpdate as StateOfOrigin]; // Get the region based on the updated stateOfOrigin

    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axios.put(
        `${request}/api/users/profile`,
        {
          firstName: firstNameToUpdate,
          lastName: lastNameToUpdate,
          email: emailToUpdate,
          phone: phoneToUpdate,
          image: imageToUpdate,
          about: aboutToUpdate,
          education: educationToUpdate,
          achievement: achievementToUpdate,
          ninNumber: ninNumberToUpdate,
          stateOfOrigin: stateOfOriginToUpdate,
          stateOfResidence: stateOfResidenceToUpdate,
          region: regionToUpdate, // Include the region in the update
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({
        type: "USER_SIGNIN",
        payload: data,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("User profile updated successfully", {
        position: "bottom-center",
      });
      fetchData(); // Refetch data to update state
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err as ErrorResponse), {
        position: "bottom-center",
      });
    }
  };

  // PROFILE PICTURE
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const bodyFormData = new FormData();
      bodyFormData.append("file", file);
      try {
        dispatch({ type: "UPLOAD_REQUEST" });
        const { data } = await axios.post(
          `${request}/api/upload`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        dispatch({ type: "UPLOAD_SUCCESS" });
        toast.success("Image uploaded successfully", {
          position: "bottom-center",
        });
        // Update the image state and submit changes
        setImage(data.secure_url);
        await submitHandler({
          e: undefined, // If you are not using an event in this case
          updatedPersonalInfo: { image: data.secure_url },
        });
      } catch (err) {
        toast.error(getError(err as ErrorResponse), {
          position: "bottom-center",
        });
        dispatch({ type: "UPLOAD_FAIL" });
      }
    }
  };

  return (
    <div className="bill_detail_screen user_profile_view_screen">
      <Helmet>
        <title>Candidate Profile Edit</title>
      </Helmet>
      <MainNavBar />
      <div className="container">
        <div className="back_home">
          <Link to="/home" className="a_flex green">
            <ArrowCircleLeftOutlinedIcon className="icon" />
            <span>Back to Homepage</span>
          </Link>
        </div>

        <div className="bill_screen_content user_profile_screen_content">
          <div className="tab_panel_box_">
            {user && (
              <Details
                user={user}
                uploadFileHandler={uploadFileHandler}
                loadingUpload={loadingUpload || false}
              />
            )}
            {user && (
              <TabMainPanel
                user={user}
                submitHandler={submitHandler}
                loadingUpdate={loadingUpdate || false}
              />
            )}
          </div>
          <div className="side_content">
            {user && <Activities user={user} fetchData={fetchData} />}
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

export default DashboardScreen;
