import React, { useContext, useEffect, useRef, useState } from "react";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { TabMainPanelProps } from "../../../types/profile/types";
import { GlobalContext } from "../../../context/UserContext";
import JoditEditor from "jodit-react";
import parse from "html-react-parser";

interface EditableSectionProps {
  title: string;
  content: string;
  isEditing: boolean;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
  onChange: (newContent: string) => void;
  loading: boolean; // Add loading prop
}

function EditableSection({
  title,
  content,
  isEditing,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onChange,
  loading, // Destructure loading
}: EditableSectionProps) {
  const editor = useRef(null);
  return (
    <div className="about bio_about">
      <div className="header c_flex">
        <div className="left">
          <h4>{title}</h4>
        </div>
        <div className="right">
          {!isEditing && (
            <div className="btn a_flex" onClick={onEditClick}>
              <DriveFileRenameOutlineOutlinedIcon className="icon" />
              <small>Edit</small>
            </div>
          )}
        </div>
      </div>
      <form
        action=""
        className="form_box"
        onSubmit={(e) => {
          e.preventDefault();
          onSaveClick();
        }}
      >
        <div className="inner_form">
          <div className="split_form">
            <div className="form_group">
              {!isEditing ? (
                <small className="value content_value">{parse(content)}</small>
              ) : (
                <JoditEditor
                  className="editor"
                  ref={editor}
                  value={content}
                  onBlur={(newContent) => onChange(newContent)} // preferred to use only this option to update the content for performance reasons
                />
              )}
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="save_cancel a_flex">
            <button className="main_btn" type="submit" disabled={loading}>
              <small>
                {loading ? (
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
              type="button"
              onClick={onCancelClick}
            >
              <small>Cancel</small>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function Biography({ loadingUpdate, submitHandler }: TabMainPanelProps) {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useContext must be used within a GlobalProvider");
  }

  const { education, setEducation, achievement, setAchievement } = context;

  // State for "Education and Early Career" section
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [educationContent, setEducationContent] = useState(education);

  // State for "Achievement" section
  const [isEditingAchievement, setIsEditingAchievement] = useState(false);
  const [achievementContent, setAchievementContent] = useState(achievement);

  // Sync educationContent with context when education changes
  useEffect(() => {
    setEducationContent(education);
  }, [education]);

  // Sync achievementContent with context when achievement changes
  useEffect(() => {
    setAchievementContent(achievement);
  }, [achievement]);

  const handleSave = async (section: string) => {
    if (section === "education") {
      setEducation(educationContent);
    } else if (section === "achievement") {
      setAchievement(achievementContent);
    }

    const dummyEvent = { preventDefault: () => {} } as React.FormEvent;

    setTimeout(async () => {
      console.log("Sending Education:", educationContent);
      console.log("Sending Achievement:", achievementContent);

      await submitHandler({
        e: dummyEvent,
        updatedEducation: educationContent,
        updatedAchievement: achievementContent,
      });

      if (section === "education") {
        setIsEditingEducation(false);
      } else if (section === "achievement") {
        setIsEditingAchievement(false);
      }
    }, 0);
  };

  return (
    <div className="user_candidate_profile">
      <div className="content">
        <EditableSection
          title="Education and Early Career"
          content={educationContent}
          isEditing={isEditingEducation}
          onEditClick={() => setIsEditingEducation(true)}
          onSaveClick={() => handleSave("education")}
          onCancelClick={() => setIsEditingEducation(false)}
          onChange={(newContent) => setEducationContent(newContent)} // Handle JoditEditor updates
          loading={loadingUpdate && isEditingEducation} // Pass loading state
        />
        <EditableSection
          title="Achievement"
          content={achievementContent}
          isEditing={isEditingAchievement}
          onEditClick={() => setIsEditingAchievement(true)}
          onSaveClick={() => handleSave("achievement")}
          onCancelClick={() => setIsEditingAchievement(false)}
          onChange={(newContent) => setAchievementContent(newContent)} // Handle JoditEditor updates
          loading={loadingUpdate && isEditingAchievement} // Pass loading state
        />
      </div>
    </div>
  );
}

export default Biography;
