import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import "./styles.scss";
import {
  ErrorResponse,
  getError,
  useAppContext,
} from "../../../utilities/utils/Utils";
import { request } from "../../../base url/BaseUrl";
import { PaginationProps } from "antd/es/pagination";
import parse from "html-react-parser";
import TruncateMarkup from "react-truncate-markup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import photo from "../../../assets/others/photo.jpg";

// Types
interface PoliticalNews {
  _id: string;
  title: string;
  image: string;
  description: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface FormData {
  _id?: string;
  title: string;
  image: string;
  description: string;
}

// Pagination render item
const itemRender: PaginationProps["itemRender"] = (
  _,
  type,
  originalElement
) => {
  if (type === "prev") {
    return <Link to="">Previous</Link>;
  }
  if (type === "next") {
    return <Link to="">Next</Link>;
  }
  return originalElement;
};

export function PoliticalNewsCreateUpdate() {
  const { state: appState } = useAppContext();
  const { userInfo } = appState;

  const [news, setNews] = useState<PoliticalNews[]>([]);
  const [totalPages, setTotalPages] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchNews();
  }, []);

  // FETCH HANDLER
  const fetchNews = async (page = 1) => {
    try {
      const response = await axios.get(
        `${request}/api/political-news/admin?page=${page}`
      );
      const { news, totalPages, currentPage } = response.data;
      setNews(news);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      toast.error(getError(error as ErrorResponse));
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // CREATE HANDLER
  const addNews = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and Description cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        `${request}/api/political-news`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
            "Content-Type": "application/json", // Ensure correct content type if sending JSON
          },
        }
      );
      setNews((prevNews) => [...prevNews, response.data.news]);
      fetchNews();
      toast.success("Political News added successfully");
    } catch (error) {
      toast.error(getError(error as ErrorResponse));
    }
  };

  const headerRef = useRef<HTMLDivElement | null>(null);
  const editNews = (id: string) => {
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
    setFormData((prevData) => ({
      ...prevData,
      _id: id,
    }));
    populateFormData(id);
  };

  const populateFormData = (id: string) => {
    const selectedNews = news.find((item) => item._id === id);

    if (selectedNews) {
      setFormData((prevData) => ({
        ...prevData,
        title: selectedNews.title,
        description: selectedNews.description,
        image: selectedNews.image,
      }));
    } else {
      toast.error("No data found for the political news being edited.");
    }
  };

  // DELETE HANDLER
  const deleteNews = async (id: string) => {
    // Show confirmation dialog
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this political news?"
    );

    // If the user confirms, proceed with deletion
    if (shouldDelete) {
      try {
        await axios.delete(`${request}/api/political-news/${id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setNews((prevNews) => prevNews.filter((item) => item._id !== id));
        fetchNews();
        toast.success("Political News deleted successfully");
      } catch (error) {
        toast.error(getError(error as ErrorResponse));
      }
    }
  };

  // UPDATE HANDLER
  const updateNews = async (id: string, updatedData: FormData) => {
    const response = await axios.put(
      `${request}/api/political-news/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          "Content-Type": "application/json", // Ensure correct content type if sending JSON
        },
      }
    );
    return response.data.news;
  };

  const updateOrAddNews = async () => {
    if (formData._id) {
      try {
        const updatedData: FormData = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
        };
        const updatedNews = await updateNews(formData._id, updatedData);

        setNews((prevNews) =>
          prevNews.map((item) =>
            item._id === formData._id ? updatedNews : item
          )
        );
        fetchNews();
        toast.success("Political News updated successfully");
      } catch (error) {
        console.error("Error updating political news:", error);
        toast.error("Failed to update political news");
      }
    } else {
      addNews();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateOrAddNews();
    setFormData({
      title: "",
      description: "",
      image: "",

      _id: "",
    });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      _id: "",
    });
  };

  //============
  const paginationRef = useRef<HTMLDivElement | null>(null);

  const handlePageChange = (page: number) => {
    fetchNews(page);
    if (paginationRef.current) {
      paginationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [loadingUpload, setLoadingUpload] = useState(false);

  // Image upload handler
  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      setLoadingUpload(true); // Start upload
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setFormData((prevData) => ({
        ...prevData,
        image: data.secure_url, // Set the uploaded image URL to formData
      }));
      toast.success("Image uploaded successfully. Click update to apply it");
    } catch (err) {
      toast.error(getError(err as ErrorResponse));
    } finally {
      setLoadingUpload(false); // End upload
    }
  };
  return (
    <>
      <div className="product_edit blog_admin_page admin_page_all page_background">
        <div className="">
          <div className="productTitleContainer">
            <h3 className="productTitle light_shadow uppercase">
              Add and Update Political News
            </h3>
          </div>
          <div className="productBottom mtb">
            <div className="productForm">
              <div className="product_info product___">
                <div className="features_box mt light_shadow">
                  <div ref={headerRef} className="header c_flex">
                    <div className="left">
                      <div className="d_flex">
                        <div className="number l_flex">
                          <span>00</span>
                        </div>
                        <div className="text">
                          <h4>Political News</h4>
                          <small>Add and update political news below</small>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <KeyboardArrowUpIcon className="icon" />
                    </div>
                  </div>

                  <div className="product_info_color">
                    <div ref={paginationRef} className="product_info_box">
                      <form onSubmit={handleSubmit} className="form_input">
                        <div className="form-group">
                          <label htmlFor="title">Title</label>
                          <span>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              placeholder="Title"
                            />
                          </span>

                          <div className="a_flex image_drop">
                            <div className="drop_zone">
                              <img
                                src={formData.image ? formData.image : photo}
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
                                              formData.image
                                                ? "icon white"
                                                : "icon"
                                            }
                                          />
                                        </div>
                                      </div>
                                      <input
                                        style={{ display: "none" }}
                                        type="file"
                                        id="files"
                                        onChange={uploadFileHandler}
                                      />
                                    </label>
                                  )}
                                </label>
                              </div>
                            </div>

                            <span className="img">
                              <label htmlFor="img">Image Url</label>
                              <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="Image URL"
                              />
                            </span>
                          </div>

                          <span className="description">
                            <label htmlFor="description">Description</label>
                            <JoditEditor
                              value={formData.description}
                              onChange={(newContent) =>
                                setFormData((prevData) => ({
                                  ...prevData,
                                  description: newContent,
                                }))
                              }
                            />
                          </span>
                        </div>

                        <div className="a_flex blog_btn">
                          <button type="submit">
                            {formData._id ? "Update News" : "Add News"}
                          </button>{" "}
                          &#160; &#160;
                          {formData._id && (
                            <button type="button" onClick={handleCancelEdit}>
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>

                      <ul className="color_list home_wrappers">
                        {news.map((item) => (
                          <li key={item._id}>
                            <div className="info f_flex">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="image"
                              />
                              <div className="details">
                                <h4>{item.title}</h4>
                                <TruncateMarkup lines={2}>
                                  <p>{parse(item.description)}</p>
                                </TruncateMarkup>
                                <div className="author">
                                  <small>
                                    <strong>Author: </strong>
                                    {item.user.firstName} {item.user.lastName}
                                  </small>
                                </div>
                              </div>
                            </div>
                            <div className="actions blog_btn a_flex">
                              <button
                                type="submit"
                                onClick={() => editNews(item._id)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteNews(item._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="ant_pagination l_flex mt">
                        <Pagination
                          current={currentPage}
                          total={totalPages * 5}
                          pageSize={5}
                          onChange={handlePageChange}
                          itemRender={itemRender}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
