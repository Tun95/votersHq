//import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import "./styles.scss";
import Modal from "@mui/material/Modal";
import f1 from "../../assets/profile/f1.png";
import f2 from "../../assets/profile/f2.png";
import f3 from "../../assets/profile/f3.png";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../utilities/utils/Utils";
import { Bill } from "../../types/bills/bills details/types";
import { request } from "../../base url/BaseUrl";
import axios from "axios";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { User } from "../../types/profile/types";

// Define action types for the reducer
type VoteAction =
  | { type: "VOTE_REQUEST" }
  | { type: "VOTE_SUCCESS"; message: string }
  | { type: "VOTE_FAIL"; error: string };

// Define the state type for the reducer
interface VoteState {
  loading: boolean;
  error: string | null;
}

// Initial state for the reducer
const initialVoteState: VoteState = {
  loading: false,
  error: null,
};

// Reducer function to manage vote state
function voteReducer(state: VoteState, action: VoteAction): VoteState {
  switch (action.type) {
    case "VOTE_REQUEST":
      return { ...state, loading: true, error: null };
    case "VOTE_SUCCESS":
      return { ...state, loading: false, error: null };
    case "VOTE_FAIL":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

// Interface
interface BillsModalsProps {
  currentBillsModal: "auth" | "vote" | null;
  handleBillsOpenModal: (modal: "auth" | "vote") => void;
  handleCloseBillsModal: () => void;
  bill: Bill | null;
  fetchBill: (slug: string, triggerLoading?: boolean) => Promise<void>;
  voteType: "yea" | "nay" | null;
}

export function BillsModal({
  currentBillsModal,
  handleCloseBillsModal,
  bill,
  fetchBill,
  voteType,
}: BillsModalsProps) {
  const { state: appState, showDrawer, setMenu } = useAppContext();
  const { userInfo } = appState;

  const [state, dispatch] = useReducer(voteReducer, initialVoteState);
  const { loading } = state;

  // Function to handle vote submission
  const handleVote = async () => {
    if (!bill || !voteType) return;

    dispatch({ type: "VOTE_REQUEST" });
    try {
      const response = await axios.post(
        `${request}/api/bills/${bill._id}/vote`,
        {
          voteType,
        },
        {
          headers: { Authorization: `Bearer ${userInfo && userInfo.token}` },
        }
      );
      dispatch({ type: "VOTE_SUCCESS", message: response.data.message });
      toast.success(response.data.message); // Notify user of success
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill

      handleCloseBillsModal(); // Close the modal after voting
    } catch (error) {
      dispatch({
        type: "VOTE_FAIL",
        error: getError(error as ErrorResponse),
      });
      toast.error(getError(error as ErrorResponse)); // Show error message if the vote fails
    }
  };

  //Login Menu
  const navigateToLogin = () => {
    setMenu("login");
    showDrawer();
    handleCloseBillsModal();
  };
  //Register Menu
  const navigateToRegister = () => {
    setMenu("register");
    showDrawer();
    handleCloseBillsModal();
  };
  return (
    <div>
      <Modal
        open={currentBillsModal === "auth"}
        onClose={handleCloseBillsModal}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        className="bill_modal_drawer"
      >
        <Box className="bills_menu_modal drawer_modal otp_menu login_menu">
          <div className="drawer_close_icon">
            <span onClick={handleCloseBillsModal} className="span_icon l_flex">
              <CloseIcon className="icon" />
            </span>
          </div>
          <div className="header_box">
            <div className="header">
              <h2>Oops, I'm sorry!!!</h2>
            </div>
            <div className="text">
              <small>
                You have to register or login your credentials to have access to
                perform operations
              </small>
            </div>
            <div className="btn">
              <div className="reg_confirm_btn">
                {" "}
                <button onClick={navigateToRegister} className="main_btn">
                  Register
                </button>
              </div>
              <div className="login_btn">
                <button onClick={navigateToLogin} className="main_btn">
                  Log In
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={currentBillsModal === "vote"}
        onClose={handleCloseBillsModal}
        aria-labelledby="yea-modal-title"
        aria-describedby="yea-modal-description"
        className="bill_modal_drawer"
      >
        <Box className="bills_menu_modal drawer_modal otp_menu login_menu">
          <div className="drawer_close_icon">
            <span onClick={handleCloseBillsModal} className="span_icon l_flex">
              <CloseIcon className="icon" />
            </span>
          </div>
          <div className="header_box">
            <div className="header">
              <h3>You are about to cast your vote on: [{bill?.title}].</h3>
            </div>
            <div className="text">
              <small>
                Note that once you cast your vote, you will not be able to
                change it.
              </small>
            </div>
            <div className="btn confirm_cancel a_flex">
              <div className="reg_confirm_btn">
                <button
                  className="main_btn l_flex"
                  onClick={handleVote} // Use handleVote for both yea and nay
                  disabled={loading} // Disable button while loading
                >
                  {loading ? (
                    <span className="a_flex">
                      <i className="fa fa-spinner fa-spin"></i>
                      Voting...
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
              <div className="cancel__btn">
                <button className="main_btn" onClick={handleCloseBillsModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

// Define or import types for Candidate and State
interface Candidate {
  _id: string;
  image: string;
  partyImage: string;
  lastName: string;
  firstName: string;
  contestingFor: string;
  slug: string;
}

interface State {
  loading: { [key: string]: boolean };
}
// Interface for props
interface ElectionModalsProps {
  item: Candidate;
  state: State;
  handleVote: (candidateId: string) => void;
  currentElectionModal: "auth" | "vote" | null;
  handleElectionOpenModal: (modal: "auth" | "vote") => void;
  handleCloseElectionModal: () => void;
}

export function ElectionModal({
  item,
  state,
  handleVote,
  currentElectionModal,
  handleCloseElectionModal,
}: ElectionModalsProps) {
  const { showDrawer, setMenu } = useAppContext();

  //Login Menu
  const navigateToLogin = () => {
    setMenu("login");
    showDrawer();
    handleCloseElectionModal();
  };

  //Register Menu
  const navigateToRegister = () => {
    setMenu("register");
    showDrawer();
    handleCloseElectionModal();
  };
  return (
    <div>
      <Modal
        open={currentElectionModal === "auth"}
        onClose={handleCloseElectionModal}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        className="bill_modal_drawer"
      >
        <Box className="bills_menu_modal drawer_modal otp_menu login_menu">
          <div className="drawer_close_icon">
            <span
              onClick={handleCloseElectionModal}
              className="span_icon l_flex"
            >
              <CloseIcon className="icon" />
            </span>
          </div>
          <div className="header_box">
            <div className="header">
              <h2>Oops, I'm sorry!!!</h2>
            </div>
            <div className="text">
              <small>
                You have to register or login your credentials to have access to
                perform operations
              </small>
            </div>
            <div className="btn">
              <div className="reg_confirm_btn">
                {" "}
                <button onClick={navigateToRegister} className="main_btn">
                  Register
                </button>
              </div>
              <div className="login_btn">
                <button onClick={navigateToLogin} className="main_btn">
                  Log In
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={currentElectionModal === "vote"}
        onClose={handleCloseElectionModal}
        aria-labelledby="yea-modal-title"
        aria-describedby="yea-modal-description"
        className="bill_modal_drawer"
      >
        <Box className="bills_menu_modal drawer_modal otp_menu login_menu">
          <div className="drawer_close_icon">
            <span
              onClick={handleCloseElectionModal}
              className="span_icon l_flex"
            >
              <CloseIcon className="icon" />
            </span>
          </div>
          <div className="header_box">
            <div className="header">
              <h3>
                You are about to cast your vote for the candidate: [
                {item?.lastName}&#160;
                {item?.firstName}].
              </h3>
            </div>
            <div className="text">
              <small>
                Note that once you cast your vote, you will not be able to
                change it.
              </small>
            </div>
            <div className="btn confirm_cancel a_flex">
              <div className="reg_confirm_btn">
                <button
                  className="main_btn l_flex"
                  onClick={() => handleVote(item._id)}
                  disabled={state.loading[item._id]} // Disable if voting is in progress
                >
                  {state.loading[item._id] ? (
                    <span className="a_flex">
                      <i className="fa fa-spinner fa-spin"></i>
                      Voting...
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
              <div className="cancel__btn">
                <button className="main_btn" onClick={handleCloseElectionModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

// Interface
interface DashboardModalsProps {
  user: User;
  currentDashboardModal: "verification" | "webcam" | null;
  handleDashboardOpenModal: (modal: "verification" | "webcam") => void; // Accept both "verification" and "webcam"
  handleCloseDashboardModal: () => void;
  fetchData: () => Promise<void>;
}

export function DashboardModal({
  user,
  currentDashboardModal,
  handleDashboardOpenModal,
  handleCloseDashboardModal,
  fetchData,
}: DashboardModalsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasCaptured, setHasCaptured] = useState(false); // Prevent multiple captures
  const [isVerified, setIsVerified] = useState(false); // Track successful verification
  const webcamRef = useRef<Webcam>(null);

  // Load face-api models asynchronously
  useEffect(() => {
    const loadModels = async () => {
      try {
        const apiUrl = `${request}/api/models`;

        console.log("Loading models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(apiUrl);
        await faceapi.nets.faceLandmark68Net.loadFromUri(apiUrl);
        await faceapi.nets.faceRecognitionNet.loadFromUri(apiUrl);
        console.log("Models loaded successfully");
        setLoading(false);
      } catch (error) {
        console.error("Error loading models", error);
        setErrorMessage("Failed to load face detection models.");
      }
    };

    loadModels();
  }, []);

  // Capture images from webcam at regular intervals when models are loaded
  useEffect(() => {
    if (!loading && !hasCaptured) {
      const interval = setInterval(() => {
        if (!isUploading) {
          capture();
        }
      }, 1000); // Capture every second
      return () => clearInterval(interval);
    }
  }, [loading, isUploading, hasCaptured]);

  const capture = useCallback(async () => {
    if (webcamRef.current && !loading && !hasCaptured) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        await detectAndUploadFace(imageSrc);
      }
    }
  }, [loading, hasCaptured]);

  const detectAndUploadFace = async (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const detections = await faceapi
          .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detections) {
          const { detection } = detections;
          const { box } = detection;
          const faceImage = ctx.getImageData(
            box.x,
            box.y,
            box.width,
            box.height
          );

          if (faceImage) {
            canvas.width = box.width;
            canvas.height = box.height;
            ctx.putImageData(faceImage, 0, 0);

            canvas.toBlob(async (blob) => {
              if (blob) {
                const formData = new FormData();
                formData.append("selfieImage", blob, "selfieImage.jpg");
                formData.append("idImage", blob, "idImage.jpg");
                formData.append("userId", user._id);

                setIsUploading(true);
                setErrorMessage(null); // Clear previous error

                try {
                  const response = await axios.post(
                    `${request}/api/users/selfie-verification`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${userInfo?.token}`,
                      },
                    }
                  );

                  if (response.status === 200) {
                    setIsVerified(true); // Mark verification as successful
                    setHasCaptured(true); // Stop further captures
                    fetchData();
                    handleCloseDashboardModal(); // Close modal on success
                    //toast.success("Selfie verification successful!");
                  } else {
                    setErrorMessage(
                      `Verification failed: ${response.data.message}`
                    );
                  }
                } catch (error) {
                  console.error("Error uploading face image", error);
                  setErrorMessage(getError(error as ErrorResponse));
                } finally {
                  setIsUploading(false);
                }
              } else {
                setErrorMessage("Error creating image blob.");
              }
            }, "image/jpeg");
          } else {
            setErrorMessage("No face detected.");
          }
        }
      }
    };

    img.onerror = () => {
      setErrorMessage("Error loading image.");
    };
  };

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  return (
    <div>
      <Modal
        open={currentDashboardModal === "verification"}
        onClose={handleCloseDashboardModal}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        className="dashboard_modal_drawer"
      >
        <Box className="dashboard_menu_modal drawer_modal otp_menu login_menu">
          <div className="top c_flex">
            <div className="header">
              <h4>Face Verification</h4>
            </div>
            <div className="drawer_close_icon">
              <span
                onClick={handleCloseDashboardModal}
                className="span_icon l_flex"
              >
                <CloseIcon className="icon" />
              </span>
            </div>
          </div>
          <div className="list">
            <div className="list_item f_flex">
              <div className="left">
                <img src={f1} alt="icon" />
              </div>
              <div className="right">
                <div className="list_head">
                  <h5>Ensure you are in a well-lit area</h5>
                </div>
                <div className="text">
                  <p>
                    Make sure you are in a well-lit environment and remove any
                    headgear or glasses.
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="list_item f_flex">
              <div className="left">
                <img src={f2} alt="icon" />
              </div>
              <div className="right">
                <div className="list_head">
                  <h5>Position your Face well</h5>
                </div>
                <div className="text">
                  <p>
                    Please look directly at the camera and remain still while we
                    capture your facial image.
                  </p>
                </div>
              </div>
            </div>{" "}
            <div className="list_item f_flex">
              <div className="left">
                <img src={f3} alt="icon" />
              </div>
              <div className="right">
                <div className="list_head">
                  <h5>Follow the on-screen prompts</h5>
                </div>
                <div className="text">
                  <p>
                    Hold your device steady and keep your head still until the
                    instruction prompts you to perform some certain poses.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="btn f_flex">
            <button
              onClick={() => handleDashboardOpenModal("webcam")}
              className="main_btn"
            >
              <small>Continue</small>
            </button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={currentDashboardModal === "webcam"}
        onClose={handleCloseDashboardModal}
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        className="dashboard_modal_drawer"
      >
        <Box className="dashboard_menu_modal drawer_modal otp_menu login_menu">
          <div className="top web_top c_flex">
            <div className="drawer_close_icon">
              <span
                onClick={handleCloseDashboardModal}
                className="span_icon l_flex"
              >
                <CloseIcon className="icon" />
              </span>
            </div>
          </div>
          <Box className="webcam_container l_flex">
            <div
              className={
                isUploading
                  ? "webcam_box face_match l_flex"
                  : "webcam_box l_flex"
              }
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="webcam"
                videoConstraints={{ facingMode: "user" }}
              />
            </div>
            {errorMessage ? (
              <div className="error-message">{errorMessage}</div>
            ) : (
              <div className="btn">
                <button
                  className="capture_btn"
                  onClick={capture}
                  disabled={loading || isUploading || isVerified} // Disable when verified
                >
                  {loading ? (
                    "Loading models..."
                  ) : isUploading ? (
                    <span className="a_flex">
                      <i className="fa fa-spinner fa-spin"></i>
                      Uploading...
                    </span>
                  ) : isVerified ? (
                    <span className="green">
                      Selfie verification successful!
                    </span> // Success message
                  ) : (
                    <span className="red">No face detected</span>
                  )}
                </button>
              </div>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
