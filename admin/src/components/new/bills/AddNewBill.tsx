import { useEffect, useReducer, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Checkbox } from "antd";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { request } from "../../../base url/BaseUrl";
import photo from "../../../assets/others/photo.jpg";
import { RegionDropdown } from "react-country-region-selector";

import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";

//DON'T CHANGE THIS LIST
//DON'T CHANGE THIS LIST
const sortTypeList = [
  { name: "State Bills", value: "state bills" },
  { name: "National Bills", value: "national bills" },
];

const sortStatusList = [
  { name: "First Reading", value: "first reading" },
  { name: "Second Reading", value: "second reading" },
  { name: "Committee Stage", value: "committee stage" },
  { name: "Report Stage", value: "report stage" },
  { name: "Third Reading", value: "third reading" },
  { name: "Concurrence", value: "concurrence" },
  { name: "President Assent", value: "president assent" },
  { name: "Promulgation", value: "promulgation" },
];

const sortCategoryList = [
  { name: "Bills", value: "bills" },
  { name: "Policies", value: "policies" },
  { name: "Issues", value: "issues" },
];

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
}

interface State {
  candidatesList: Candidate[];
  loading: boolean;
  error: string;
  loadingCreate?: boolean;
  loadingUpload?: boolean;
}

type Action =
  | { type: "CREATE_REQUEST" }
  | { type: "CREATE_SUCCESS" }
  | { type: "CREATE_FAIL"; payload: string }
  | { type: "FETCH_CANDIDATE_REQUEST" }
  | { type: "FETCH_CANDIDATE_SUCCESS"; payload: Candidate[] }
  | { type: "FETCH_CANDIDATE_FAIL"; payload: string }
  | { type: "UPDATE_REQUEST" }
  | { type: "UPDATE_SUCCESS" }
  | { type: "UPDATE_FAIL"; payload: string }
  | { type: "UPLOAD_REQUEST" }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "UPLOAD_FAIL"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };

    case "FETCH_CANDIDATE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_CANDIDATE_SUCCESS":
      return { ...state, loading: false, candidatesList: action.payload };
    case "FETCH_CANDIDATE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, error: action.payload };
    default:
      return state;
  }
};

function AddNewBill() {
  const editor = useRef(null);

  const navigate = useNavigate();

  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [{ candidatesList, loadingCreate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      candidatesList: [],
      loading: true,
      error: "",
    });

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [sortType, setSortType] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [sortCategory, setSortCategory] = useState("");
  const [sortState, setSortState] = useState("");
  const [candidates, setCandidates] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // Fetch candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await axios.get(
          `${request}/api/users/role/politicians`
        );
        dispatch({ type: "FETCH_CANDIDATE_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_CANDIDATE_FAIL",
          payload: getError(err as ErrorResponse),
        });
      }
    };
    fetchCandidates();
  }, []);

  // Submit handler
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const createBill = {
        title,
        description,
        featured,
        sortType,
        sortStatus,
        sortCategory,
        sortState,
        expirationDate,
        image,
        banner,
        candidates,
      };

      await axios.post(`${request}/api/bills`, createBill, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Bill Created successfully");
      navigate("/bills");
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
      dispatch({
        type: "CREATE_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };

  // Image upload handler
  const uploadFileHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isBanner: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      if (isBanner) {
        setBanner(data.secure_url); // Set the banner image
      } else {
        setImage(data.secure_url); // Set the general image
      }
      toast.success("Image uploaded successfully. Click save to apply it");
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
      dispatch({
        type: "UPLOAD_FAIL",
        payload: getError(err as ErrorResponse),
      });
    }
  };

  //============
  //TOGGLE BOX
  //============
  const [openBox, setOpenBox] = useState<number | null>(null);

  // Define the type for the index parameter
  const toggleBox = (index: number): void => {
    if (openBox === index) {
      setOpenBox(null);
    } else {
      setOpenBox(index);
    }
  };

  return (
    <>
      <div className="product_edit admin_page_all">
        <div className="">
          <div className=" ">
            <div className="productTitleContainer">
              <h3 className="productTitle light_shadow uppercase">Add Bill</h3>
            </div>
            <div className="productBottom mtb">
              <form action="" onSubmit={submitHandler}>
                <div className="productForm">
                  <div className="product_info product___">
                    <div className="light_shadow product___main">
                      <div
                        className={
                          openBox === 0
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(0)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>01</span>
                            </div>
                            <div className="text">
                              <h4>Bill Info</h4>
                              <small>Fill all bill information below</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 0 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 0 && (
                        <>
                          <div className="product_info_box box">
                            <div className="form-group">
                              <label htmlFor="title">Title</label>
                              <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Bill title"
                              />
                            </div>
                            {/* <div className="form-group">
                              <label htmlFor="location">Location</label>
                              <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g Lagos"
                              />
                            </div> */}
                            <div className="form-group">
                              <label htmlFor="expirationDate">
                                Expiration Date
                              </label>
                              <input
                                type="datetime-local"
                                id="expirationDate"
                                value={expirationDate}
                                onChange={(e) =>
                                  setExpirationDate(e.target.value)
                                }
                              />
                            </div>
                            {/* CANDIDATE SELECTION */}
                            <div className="form-group">
                              <label htmlFor="candidate">Candidate</label>
                              <select
                                name="candidate"
                                id="candidate"
                                value={candidates}
                                onChange={(e) => setCandidates(e.target.value)}
                              >
                                <option value="" disabled>
                                  Select Candidate
                                </option>
                                {candidatesList.map((item, index) => (
                                  <option value={item._id} key={index}>
                                    {item.firstName} {item.lastName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {/* TYPE */}
                            <div className="form-group">
                              <label htmlFor="sortType">Type</label>
                              <select
                                name="sortType"
                                id="sortType"
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                              >
                                <option value="" disabled>
                                  Select Type
                                </option>
                                {sortTypeList.map((item, index) => (
                                  <option value={item.value} key={index}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* STATUS */}
                            <div className="form-group">
                              <label htmlFor="sortStatus">Status</label>
                              <select
                                name="sortStatus"
                                id="sortStatus"
                                value={sortStatus}
                                onChange={(e) => setSortStatus(e.target.value)}
                              >
                                <option value="" disabled>
                                  Select Status
                                </option>
                                {sortStatusList.map((item, index) => (
                                  <option value={item.value} key={index}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {/* CATEGORIES */}
                            <div className="form-group">
                              <label htmlFor="sortCategory">Category</label>
                              <select
                                name="sortCategory"
                                id="sortCategory"
                                value={sortCategory}
                                onChange={(e) =>
                                  setSortCategory(e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  Select Category
                                </option>
                                {sortCategoryList.map((item, index) => (
                                  <option value={item.value} key={index}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* STATE */}
                            <div className="form-group">
                              <label htmlFor="sortState">State</label>

                              <RegionDropdown
                                country="Nigeria"
                                id="sortState"
                                name="sortState"
                                value={sortState}
                                onChange={(value: string) =>
                                  setSortState(value)
                                }
                                classes="select"
                              />
                            </div>

                            {/* FEATURED */}
                            <div className="form-group a_flex black_friday">
                              <Checkbox
                                checked={featured}
                                onChange={() =>
                                  setFeatured((prevValue) => !prevValue)
                                }
                              >
                                Featured
                              </Checkbox>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {/* BILL IMAGE UPLOAD */}
                    <div className="light_shadow mt product_images banners">
                      <div
                        className={
                          openBox === 1
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(1)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>02</span>
                            </div>
                            <div className="text">
                              <h4>Bill Image</h4>
                              <small>Upload bill Image</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 1 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 1 && (
                        <div className="product_info_images">
                          <div className="product_info_img_box box">
                            <div className="form_group f_flex">
                              <div className="drop_zone">
                                <img
                                  src={image ? image : photo}
                                  alt="Banner"
                                  className="images"
                                />
                                <div className="icon_bg l_flex">
                                  <label
                                    htmlFor="files"
                                    className={
                                      loadingUpload
                                        ? "upload_box disabled l_flex"
                                        : "upload_box l_flex"
                                    }
                                  >
                                    {loadingUpload ? (
                                      <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                      <label>
                                        <div className="inner">
                                          <div className="icon_btn">
                                            <CloudUploadIcon
                                              className={
                                                image ? "icon white" : "icon"
                                              }
                                            />
                                          </div>
                                        </div>
                                        <input
                                          style={{ display: "none" }}
                                          type="file"
                                          id="electionImage"
                                          onChange={(e) =>
                                            uploadFileHandler(e, false)
                                          } // false for general image
                                        />
                                      </label>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* BILL BANNER UPLOAD */}
                    <div className="light_shadow mt product_images banners">
                      <div
                        className={
                          openBox === 2
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(2)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>03</span>
                            </div>
                            <div className="text">
                              <h4>Bill Banner</h4>
                              <small>Upload bill banner</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 2 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 2 && (
                        <div className="product_info_images">
                          <div className="product_info_img_box box">
                            <div className="form_group f_flex">
                              <div className="drop_zone">
                                <img
                                  src={banner ? banner : photo}
                                  alt="Banner"
                                  className="images"
                                />
                                <div className="icon_bg l_flex">
                                  <label
                                    htmlFor="files"
                                    className={
                                      loadingUpload
                                        ? "upload_box disabled l_flex"
                                        : "upload_box l_flex"
                                    }
                                  >
                                    {loadingUpload ? (
                                      <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                      <label>
                                        <div className="inner">
                                          <div className="icon_btn">
                                            <CloudUploadIcon
                                              className={
                                                banner ? "icon white" : "icon"
                                              }
                                            />
                                          </div>
                                        </div>
                                        <input
                                          style={{ display: "none" }}
                                          type="file"
                                          id="banner"
                                          onChange={(e) =>
                                            uploadFileHandler(e, true)
                                          } // true for banner
                                        />
                                      </label>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* BILL DESCRIPTION */}
                    <div className="light_shadow mt product_description">
                      <div
                        className={
                          openBox === 3
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(3)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>04</span>
                            </div>
                            <div className="text">
                              <h4>Bill Description</h4>
                              <small>Provide detailed bill description</small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 3 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 3 && (
                        <div className="product_info_desc box">
                          <div className="form-group">
                            <label htmlFor="">Description</label>
                            <JoditEditor
                              className="editor"
                              ref={editor}
                              value={description}
                              onBlur={(newContent) =>
                                setDescription(newContent)
                              } // preferred to use only this option to update the content for performance reasons
                            />
                          </div>
                        </div>
                      )}
                    </div>{" "}
                  </div>
                </div>
                <div className="bottom_btn mtb">
                  <span className="a_flex">
                    <button
                      className=" a_flex"
                      onClick={() => navigate("/bills")}
                    >
                      <CloseIcon className="icon" /> Cancel
                    </button>
                    <button
                      type="submit"
                      className="a_flex"
                      disabled={loadingCreate}
                    >
                      {loadingCreate ? (
                        <span className="a_flex">
                          <i className="fa fa-spinner fa-spin"></i>
                          Creating...
                        </span>
                      ) : (
                        <>
                          <DescriptionOutlinedIcon className="icon" /> Create
                        </>
                      )}
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddNewBill;
