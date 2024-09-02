import KeyboardDoubleArrowUpOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowUpOutlined";
import IosShareIcon from "@mui/icons-material/IosShare";
import icon from "../../assets/bill/icon.png";
import SentimentSatisfiedAltOutlinedIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CloseIcon from "@mui/icons-material/Close";
import UpdateIcon from "@mui/icons-material/Update";
import { useEffect, useReducer, useRef, useState } from "react";
import { BillsResponse } from "../../types/bills/bills details/types";
import { CommentType, Reply } from "../../types/election/types";
import { formatDateAgo, useAppContext } from "../../utilities/utils/Utils";
import axios from "axios";
import { request } from "../../base url/BaseUrl";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

type ActionType =
  | { type: "SET_COMMENTS"; payload: CommentType[] }
  | { type: "ADD_COMMENT"; payload: CommentType }
  | { type: "UPDATE_COMMENT"; payload: { id: string; content: string } }
  | { type: "DELETE_COMMENT"; payload: string }
  | { type: "ADD_REPLY"; payload: { commentId: string; reply: Reply } }
  | {
      type: "UPDATE_REPLY";
      payload: { commentId: string; replyId: string; content: string };
    }
  | { type: "DELETE_REPLY"; payload: { commentId: string; replyId: string } }
  | { type: "LIKE_COMMENT"; payload: { id: string; likes: string[] } }
  | { type: "DISLIKE_COMMENT"; payload: { id: string; dislikes: string[] } }
  | {
      type: "LIKE_REPLY";
      payload: { commentId: string; replyId: string; likes: string[] };
    }
  | {
      type: "DISLIKE_REPLY";
      payload: { commentId: string; replyId: string; dislikes: string[] };
    };

interface StateType {
  comments: CommentType[];
}

const initialState: StateType = {
  comments: [],
};

const reducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] };
    case "UPDATE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.id
            ? { ...comment, content: action.payload.content }
            : comment
        ),
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload
        ),
      };
    case "ADD_REPLY":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: [action.payload.reply, ...comment.replies],
              }
            : comment
        ),
      };
    case "UPDATE_REPLY":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === action.payload.replyId
                    ? { ...reply, content: action.payload.content }
                    : reply
                ),
              }
            : comment
        ),
      };
    case "DELETE_REPLY":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== action.payload.replyId
                ),
              }
            : comment
        ),
      };
    case "LIKE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.id
            ? { ...comment, likes: action.payload.likes }
            : comment
        ),
      };
    case "DISLIKE_COMMENT":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.id
            ? { ...comment, dislikes: action.payload.dislikes }
            : comment
        ),
      };
    case "LIKE_REPLY":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === action.payload.replyId
                    ? { ...reply, likes: action.payload.likes }
                    : reply
                ),
              }
            : comment
        ),
      };
    case "DISLIKE_REPLY":
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply._id === action.payload.replyId
                    ? { ...reply, dislikes: action.payload.dislikes }
                    : reply
                ),
              }
            : comment
        ),
      };
    default:
      return state;
  }
};
const Comment: React.FC<BillsResponse> = ({ bill, fetchBill }) => {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (bill?.comments) {
      dispatch({ type: "SET_COMMENTS", payload: bill?.comments });
    }
  }, [bill?.comments]);

  const [newComment, setNewComment] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState<string>("");
  const [editedReplyContent, setEditedReplyContent] = useState<string>("");
  const [replyContent, setReplyContent] = useState<string>("");

  const commentsRef = useRef<HTMLDivElement | null>(null);

  const addComment = async () => {
    if (!userInfo) {
      return toast.error("You need to login to perform this operation");
    }
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `${request}/api/bills/${bill?._id}/comments`,
          { commentContent: newComment },
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );
        const slug = bill?.slug ?? ""; // Make sure slug is defined
        await fetchBill(slug, false); // Trigger loading when fetching bill

        dispatch({ type: "ADD_COMMENT", payload: response.data });

        setNewComment("");
        if (commentsRef.current) {
          commentsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      } catch (error) {
        console.error("Failed to add comment", error);
      }
    }
  };

  const editComment = (id: string, content: string) => {
    setEditingCommentId(id);
    setEditedCommentContent(content);
  };

  const updateComment = async (id: string) => {
    try {
      await axios.put(
        `${request}/api/bills/${bill?._id}/comments/${id}`,
        { commentContent: editedCommentContent },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({
        type: "UPDATE_COMMENT",
        payload: { id, content: editedCommentContent },
      });
      setEditingCommentId(null);
      setEditedCommentContent("");
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await axios.delete(`${request}/api/bills/${bill?._id}/comments/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      dispatch({ type: "DELETE_COMMENT", payload: id });
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const addReply = async (commentId: string) => {
    if (replyContent.trim()) {
      try {
        const response = await axios.post(
          `${request}/api/bills/${bill?._id}/comments/${commentId}/replies`,
          { replyContent: replyContent },
          { headers: { Authorization: `Bearer ${userInfo?.token}` } }
        );
        dispatch({
          type: "ADD_REPLY",
          payload: { commentId, reply: response.data },
        });
        setReplyContent("");
        setEditingReplyId(null);
        const slug = bill?.slug ?? ""; // Make sure slug is defined
        await fetchBill(slug, false); // Trigger loading when fetching bill
      } catch (error) {
        console.error("Failed to add reply", error);
      }
    }
  };

  const editReply = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditedReplyContent(content);
  };

  const updateReply = async (commentId: string, replyId: string) => {
    try {
      await axios.put(
        `${request}/api/bills/${bill?._id}/comments/${commentId}/replies/${replyId}`,
        { replyContent: editedReplyContent },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({
        type: "UPDATE_REPLY",
        payload: { commentId, replyId, content: editedReplyContent },
      });
      setEditingReplyId(null);
      setEditedReplyContent("");
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to update reply", error);
    }
  };

  const deleteReply = async (commentId: string, replyId: string) => {
    try {
      await axios.delete(
        `${request}/api/bills/${bill?._id}/comments/${commentId}/replies/${replyId}`,
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({ type: "DELETE_REPLY", payload: { commentId, replyId } });
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to delete reply", error);
    }
  };

  const likeComment = async (id: string) => {
    if (!userInfo) {
      return toast.error("You need to login to perform this operation");
    }
    try {
      const response = await axios.post(
        `${request}/api/bills/${bill?._id}/comments/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({
        type: "LIKE_COMMENT",
        payload: { id, likes: response.data.likes },
      });
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  };

  const dislikeComment = async (id: string) => {
    if (!userInfo) {
      return toast.error("You need to login to perform this operation");
    }
    try {
      const response = await axios.post(
        `${request}/api/bills/${bill?._id}/comments/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({
        type: "DISLIKE_COMMENT",
        payload: { id, dislikes: response.data.dislikes },
      });
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to dislike comment", error);
    }
  };

  const likeReply = async (commentId: string, replyId: string) => {
    if (!userInfo) {
      return toast.error("You need to login to perform this operation");
    }
    try {
      const response = await axios.post(
        `${request}/api/bills/${bill?._id}/comments/${commentId}/replies/${replyId}/like`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({
        type: "LIKE_REPLY",
        payload: { commentId, replyId, likes: response.data.likes },
      });
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to like reply", error);
    }
  };

  const dislikeReply = async (commentId: string, replyId: string) => {
    if (!userInfo) {
      return toast.error("You need to login to perform this operation");
    }
    try {
      const response = await axios.post(
        `${request}/api/bills/${bill?._id}/comments/${commentId}/replies/${replyId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      dispatch({
        type: "DISLIKE_REPLY",
        payload: { commentId, replyId, dislikes: response.data.dislikes },
      });
      const slug = bill?.slug ?? ""; // Make sure slug is defined
      await fetchBill(slug, false); // Trigger loading when fetching bill
    } catch (error) {
      console.error("Failed to dislike reply", error);
    }
  };

  return (
    <div className="bill_comments">
      <div className="bill_comment_content">
        <div className="comment_head c_flex">
          <div className="left">
            <h3>
              Comment <span>({state?.comments?.length})</span>
            </h3>
          </div>
          <div className="right">
            <KeyboardDoubleArrowUpOutlinedIcon className="icon" />
          </div>
        </div>
        <div className="comment_list" ref={commentsRef}>
          {state?.comments?.length === 0 && (
            <div className="no_review l_flex">
              <p>No Comments Found</p>
            </div>
          )}
          {state?.comments.map((comment) => (
            <div className="parent_child" key={comment._id}>
              <div className="parent">
                <div className="head c_flex">
                  <div className="img_name a_flex">
                    <div className="img">
                      {comment?.role === "user" ? (
                        <Link to={`/user-profile-view/${comment?.user}`}>
                          <img
                            src={comment.image ? comment.image : icon}
                            alt={comment.firstName}
                          />
                        </Link>
                      ) : (
                        comment?.role === "politician" && (
                          <Link
                            to={`/politician-profile-view/${comment?.user}`}
                          >
                            <img
                              src={comment.image ? comment.image : icon}
                              alt={comment.firstName}
                            />
                          </Link>
                        )
                      )}
                    </div>
                    <div className="name_time f_flex">
                      <div className="name">
                        <h5>
                          {comment?.role === "user" ? (
                            <Link to={`/user-profile-view/${comment?.user}`}>
                              {comment.lastName} {comment.firstName}
                            </Link>
                          ) : (
                            comment?.role === "politician" && (
                              <Link to={`/politician-profile-view/${comment?.user}`}>
                                {comment.lastName} {comment.firstName}
                              </Link>
                            )
                          )}
                        </h5>
                      </div>
                      <div className="time">
                        <small>
                          {formatDateAgo(comment ? comment?.createdAt : "...")}
                        </small>
                      </div>
                    </div>
                  </div>
                  {userInfo && userInfo?._id === comment.user && (
                    <div className="icons a_flex">
                      <span
                        className="l_flex delete_icon"
                        onClick={() => deleteComment(comment._id)}
                      >
                        <DeleteForeverOutlinedIcon className="icon mui_icon" />
                      </span>
                      {editingCommentId === comment._id ? (
                        <>
                          <span
                            className="l_flex close_edit_icon"
                            onClick={() => setEditingCommentId(null)}
                          >
                            <CloseIcon className="icon mui_icon" />
                          </span>
                          <span
                            className="l_flex update_icon"
                            onClick={() => updateComment(comment._id)}
                          >
                            <UpdateIcon className="icon mui_icon" />
                          </span>
                        </>
                      ) : (
                        <span
                          className="l_flex edit_icon"
                          onClick={() =>
                            editComment(comment._id, comment.commentContent)
                          }
                        >
                          <i className="fa-solid fa-pen-to-square icon edit_icon"></i>
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="comment_actions">
                  <div className="comment">
                    {editingCommentId === comment._id ? (
                      <>
                        <textarea
                          value={editedCommentContent}
                          maxLength={200}
                          className="comment_global_text"
                          onChange={(e) =>
                            setEditedCommentContent(e.target.value)
                          }
                        />
                        <div className="btn">
                          <button
                            className="main_btn update_btn f_flex"
                            onClick={() => updateComment(comment._id)}
                          >
                            Update
                          </button>
                        </div>
                      </>
                    ) : (
                      <small>{comment?.commentContent}</small>
                    )}
                  </div>
                  <div className="actions c_flex">
                    <div className="left a_flex">
                      <div
                        className="like a_flex"
                        onClick={() => likeComment(comment._id)}
                      >
                        <i className="fa-regular icon fa-thumbs-up"></i>
                        <small className="count">
                          {comment?.likes?.length}
                        </small>
                      </div>
                      <div
                        className="dislike a_flex"
                        onClick={() => dislikeComment(comment._id)}
                      >
                        <i className="fa-regular icon fa-thumbs-down"></i>
                        <small className="count">
                          {comment?.dislikes?.length}
                        </small>
                      </div>
                    </div>
                    {userInfo && (
                      <div
                        className="right a_flex"
                        onClick={() => setEditingReplyId(comment._id)}
                      >
                        <IosShareIcon className="icon" />
                        <small>Reply</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {comment?.replies?.length > 0 && (
                <div className="child">
                  {comment?.replies?.map((reply) => (
                    <div className="reply mb" key={reply._id}>
                      <div className="head c_flex">
                        <div className="img_name a_flex">
                          <div className="img">
                            {reply?.role === "user" ? (
                              <Link to={`/user-profile-view/${reply?.user}`}>
                                <img
                                  src={reply?.image ? reply.image : icon}
                                  alt={reply.firstName}
                                />
                              </Link>
                            ) : (
                              reply?.role === "politician" && (
                                <Link
                                  to={`/politician-profile-view/${reply?.user}`}
                                >
                                  <img
                                    src={reply?.image ? reply.image : icon}
                                    alt={reply.firstName}
                                  />
                                </Link>
                              )
                            )}
                          </div>
                          <div className="name_time f_flex">
                            <div className="name">
                              <h5>
                                {reply?.role === "user" ? (
                                  <Link
                                    to={`/user-profile-view/${reply?.user}`}
                                  >
                                    {reply.lastName} {reply.firstName}
                                  </Link>
                                ) : (
                                  reply?.role === "politician" && (
                                    <Link
                                      to={`/politician-profile-view/${reply?.user}`}
                                    >
                                      {reply.lastName} {reply.firstName}
                                    </Link>
                                  )
                                )}
                              </h5>
                            </div>
                            <div className="time">
                              <small>
                                {formatDateAgo(
                                  reply ? reply?.createdAt : "..."
                                )}
                              </small>
                            </div>
                          </div>
                        </div>
                        {userInfo && userInfo?._id === reply.user && (
                          <div className="icons a_flex">
                            <span
                              className="l_flex delete_icon"
                              onClick={() =>
                                deleteReply(comment._id, reply._id)
                              }
                            >
                              <DeleteForeverOutlinedIcon className="icon mui_icon" />
                            </span>
                            {editingReplyId === reply._id ? (
                              <>
                                <span
                                  className="l_flex close_edit_icon"
                                  onClick={() => setEditingReplyId(null)}
                                >
                                  <CloseIcon className="icon mui_icon" />
                                </span>
                                <span
                                  className="l_flex update_icon"
                                  onClick={() =>
                                    updateReply(comment._id, reply._id)
                                  }
                                >
                                  <UpdateIcon className="icon mui_icon" />
                                </span>
                              </>
                            ) : (
                              <span
                                className="l_flex edit_icon"
                                onClick={() =>
                                  editReply(reply._id, reply.replyContent)
                                }
                              >
                                <i className="fa-solid fa-pen-to-square icon edit_icon"></i>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="comment_actions">
                        <div className="comment">
                          {editingReplyId === reply._id ? (
                            <>
                              <textarea
                                className="comment_global_text"
                                value={editedReplyContent}
                                maxLength={200}
                                onChange={(e) =>
                                  setEditedReplyContent(e.target.value)
                                }
                              />
                              <div className="btn">
                                <button
                                  className="main_btn update_btn"
                                  onClick={() =>
                                    updateReply(comment._id, reply._id)
                                  }
                                >
                                  Update
                                </button>
                              </div>
                            </>
                          ) : (
                            <small>{reply.replyContent}</small>
                          )}
                        </div>
                        <div className="actions c_flex">
                          <div className="left a_flex">
                            <div
                              className="like a_flex"
                              onClick={() => likeReply(comment._id, reply._id)}
                            >
                              <i className="fa-regular icon fa-thumbs-up"></i>
                              <small className="count">
                                {reply?.likes?.length}
                              </small>
                            </div>
                            <div
                              className="dislike a_flex"
                              onClick={() =>
                                dislikeReply(comment._id, reply._id)
                              }
                            >
                              <i className="fa-regular icon fa-thumbs-down"></i>
                              <small className="count">
                                {reply?.dislikes?.length}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                    </div>
                  ))}
                </div>
              )}

              {editingReplyId === comment._id && (
                <div className="reply_form">
                  <textarea
                    value={replyContent}
                    maxLength={200}
                    className="comment_global_text"
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="btn">
                    <div className="a_flex cancel_main_btn mb">
                      <button
                        className="main_btn "
                        disabled={!replyContent.trim()}
                        onClick={() => {
                          addReply(comment._id);
                          setEditingReplyId(null); // Close the reply form after adding the reply
                        }}
                      >
                        Add Reply
                      </button>
                      <button
                        className="cancel_btn main_btn "
                        onClick={() => {
                          setReplyContent(""); // Clear the text area
                          setEditingReplyId(null); // Close the reply form without adding a reply
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="comment_box">
          <div className="user a_flex">
            <div className="img">
              <img
                src={userInfo && userInfo.image ? userInfo.image : icon}
                alt="user reply image"
              />
            </div>
            <div className="name">
              <h5>
                {userInfo
                  ? `${userInfo.lastName} ${userInfo.firstName}`
                  : "John Doe"}
              </h5>
            </div>
          </div>
          <div className="box">
            <textarea
              name="comment"
              id="comment"
              placeholder="What are your thoughts?"
              value={newComment}
              maxLength={200}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          <div className="lower c_flex">
            <div className="left a_flex">
              <SentimentSatisfiedAltOutlinedIcon className="icon" />
              <small>{Math.max(200 - newComment.length, 0)}/200</small>
            </div>
            <div className="right a_flex">
              <button className="cancel" onClick={() => setNewComment("")}>
                Cancel
              </button>
              <button
                className="comment"
                onClick={addComment}
                disabled={!newComment.trim()}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
