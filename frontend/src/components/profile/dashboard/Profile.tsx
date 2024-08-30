import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import b1 from "../../../assets/profile/b1.png";
import b2 from "../../../assets/profile/b2.png";
import b3 from "../../../assets/profile/b3.png";
import b4 from "../../../assets/profile/b4.png";
import b5 from "../../../assets/profile/b5.png";
import b6 from "../../../assets/profile/b6.png";
import { useContext, useState } from "react";
import { TabMainPanelProps } from "../../../types/profile/types";
import { GlobalContext } from "../../../context/UserContext";

function Profile({ loadingUpdate, submitHandler }: TabMainPanelProps) {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useContext must be used within a GlobalProvider");
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    age,
    gender,
    ninNumber,
    stateOfOrigin,
    stateOfResidence,
    about,
  } = context;

  // State for the "About" section
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutContent, setAboutContent] = useState(about);

  // State for the "Personal Info" section
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    age: age,
    gender: gender,
    ninNumber: ninNumber,
    stateOfOrigin: stateOfOrigin,
    stateOfResidence: stateOfResidence,
  });

  // Handlers for the "About" section
  const handleEditAboutClick = () => setIsEditingAbout(true);
  const handleSaveAboutClick = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitHandler({
      e,
      updatedAbout: aboutContent,
    });
    setIsEditingAbout(false);
  };
  const handleCancelAboutClick = () => setIsEditingAbout(false);
  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setAboutContent(e.target.value);

  // Handlers for the "Personal Info" section
  const handleEditPersonalInfoClick = () => setIsEditingPersonalInfo(true);
  const handleSavePersonalInfoClick = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitHandler({
      e,
      updatedPersonalInfo: personalInfo,
    });
    setIsEditingPersonalInfo(false);
  };
  const handleCancelPersonalInfoClick = () => setIsEditingPersonalInfo(false);
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  return (
    <div className="user_candidate_profile">
      <div className="content">
        {/* About Section */}
        <div className="about">
          <div className="header c_flex">
            <div className="left">
              <h4>About</h4>
            </div>
            <div className="right">
              {!isEditingAbout && (
                <div className="btn a_flex" onClick={handleEditAboutClick}>
                  <DriveFileRenameOutlineOutlinedIcon className="icon" />
                  <small>Edit</small>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSaveAboutClick} className="form_box">
            <div className="inner_form">
              <div className="split_form">
                <div className="form_group">
                  {!isEditingAbout ? (
                    <small className="value">{aboutContent}</small>
                  ) : (
                    <textarea
                      className="value textarea"
                      value={aboutContent}
                      onChange={handleAboutChange}
                    />
                  )}
                </div>
              </div>
            </div>
            {isEditingAbout && (
              <div className="save_cancel a_flex">
                <button className="main_btn" type="submit">
                  <small>
                    {loadingUpdate ? (
                      <span className="a_flex">
                        <i className="fa fa-spinner fa-spin"></i>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </small>
                </button>
                <button
                  className="main_btn cancel_btn"
                  onClick={handleCancelAboutClick}
                >
                  <small>Cancel</small>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Personal Info Section */}
        <div className="personal_info">
          <div className="header c_flex">
            <div className="left">
              <h4>All Personal Information</h4>
            </div>
            <div className="right">
              {!isEditingPersonalInfo && (
                <div
                  className="btn a_flex"
                  onClick={handleEditPersonalInfoClick}
                >
                  <DriveFileRenameOutlineOutlinedIcon className="icon" />
                  <small>Edit</small>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSavePersonalInfoClick} className="form_box">
            <div className="inner_form">
              {/* Personal Info Fields */}
              {/* Similar to "About" section but for personal info */}
              <div className="split_form c_flex">
                {/* First Name */}
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b1} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.firstName}</h4>
                          </div>
                          <label>
                            <small>Legal First Name</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>Legal First Name</small>
                          </label>
                          <input
                            className="value"
                            name="firstName"
                            value={personalInfo.firstName}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Last Name */}
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b1} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.lastName}</h4>
                          </div>
                          <label>
                            <small>Legal Last Name</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>Legal Last Name</small>
                          </label>
                          <input
                            className="value"
                            name="lastName"
                            value={personalInfo.lastName}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Email and Phone */}
              <div className="split_form c_flex">
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b2} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.email}</h4>
                          </div>
                          <label>
                            <small>Email Address</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>Email Address</small>
                          </label>
                          <input
                            className="value"
                            name="email"
                            value={personalInfo.email}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b3} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.phone}</h4>
                          </div>
                          <label>
                            <small>Phone Number</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>Phone Number</small>
                          </label>
                          <input
                            className="value"
                            name="phone"
                            value={personalInfo.phone}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* National ID and State */}
              <div className="split_form c_flex">
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b4} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.ninNumber}</h4>
                          </div>
                          <label>
                            <small>National Identification Number</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>National Identification Number</small>
                          </label>
                          <input
                            className="value"
                            name="ninNumber"
                            type="number"
                            maxLength={11}
                            value={personalInfo.ninNumber}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b5} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">
                              {personalInfo.stateOfOrigin}
                            </h4>
                          </div>
                          <label>
                            <small>State of Origin</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>State of Origin</small>
                          </label>
                          <input
                            className="value"
                            name="stateOfOrigin"
                            value={personalInfo.stateOfOrigin}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Age and Gender */}
              <div className="split_form c_flex">
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b1} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.age}</h4>
                          </div>
                          <label>
                            <small>Age</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>Age</small>
                          </label>
                          <input
                            className="value"
                            name="age"
                            type="number"
                            value={personalInfo.age}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 3) {
                                handlePersonalInfoChange(e);
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b1} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">{personalInfo.gender}</h4>
                          </div>
                          <label>
                            <small>Gender</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <div className="label_select f_flex">
                            <label>
                              <small>Gender</small>
                            </label>
                            <select
                              className="select"
                              name="gender"
                              value={personalInfo.gender || ""}
                              onChange={handlePersonalInfoChange}
                            >
                              <option value="" disabled>
                                Select gender
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* State of Residence */}
              <div className="split_form c_flex">
                <div className="form_group">
                  <div className="details_icon a_flex">
                    {!isEditingPersonalInfo && (
                      <div className="icon_s l_flex">
                        <img src={b6} alt="icon" />
                      </div>
                    )}
                    <div className="input_label">
                      {!isEditingPersonalInfo ? (
                        <>
                          <div className="input">
                            <h4 className="value">
                              {personalInfo.stateOfResidence}
                            </h4>
                          </div>
                          <label>
                            <small>State of Residence</small>
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <small>State of Residence</small>
                          </label>
                          <input
                            className="value"
                            name="stateOfResidence"
                            value={personalInfo.stateOfResidence}
                            onChange={handlePersonalInfoChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* Save and Cancel Buttons */}
                {isEditingPersonalInfo && (
                  <div className="save_cancel a_flex">
                    <button className="main_btn" type="submit">
                      <small>
                        {loadingUpdate ? (
                          <span className="a_flex">
                            <i className="fa fa-spinner fa-spin"></i>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </small>
                    </button>
                    <button
                      className="main_btn cancel_btn"
                      onClick={handleCancelPersonalInfoClick}
                    >
                      <small>Cancel</small>
                    </button>
                  </div>
                )}
              </div>{" "}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
