import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { request } from "../../../../base url/BaseUrl";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import JoditEditor from "jodit-react";
import "./styles.scss";
import { Context } from "../../../../context/Context";
import { getError } from "../../../../components/utilities/util/Utils";

//===========
// PAGINATION
//===========
const itemRender = (_, type, originalElement) => {
  if (type === "prev") {
    return <Link to="">Previous</Link>;
  }
  if (type === "next") {
    return <Link to="">Next</Link>;
  }
  return originalElement;
};

export function BlogCreateUpdate() {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    comments: [],
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (page = 1) => {
    try {
      const response = await axios.get(`${request}/api/blog?page=${page}`);
      const { blogs, totalPages, currentPage } = response.data;
      setBlogs(blogs);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addBlog = async () => {
    if (!formData.title || !formData.description) {
      toast.error("Title and Description cannot be empty");
      return;
    }
    try {
      const response = await axios.post(
        `${request}/api/blog/create`,
        formData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setBlogs((prevBlogs) => [...prevBlogs, response.data]);
      toast.success("Blog added successfully");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  const headerRef = useRef(null);
  const editBlog = (id) => {
    headerRef.current.scrollIntoView({ behavior: "smooth" });
    setFormData((prevData) => ({
      ...prevData,
      _id: id,
    }));
    populateFormData(id);
  };

  const populateFormData = (id) => {
    const selectedBlog = blogs.find((blog) => blog._id === id);

    if (selectedBlog) {
      setFormData((prevData) => ({
        ...prevData,
        title: selectedBlog.title,
        description: selectedBlog.description,
        image: selectedBlog.image,
        comments: selectedBlog.comments,
      }));
    } else {
      toast.error("No data found for the blog being edited.");
    }
  };

  const deleteBlog = async (id) => {
    // Show confirmation dialog
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    // If the user confirms, proceed with deletion
    if (shouldDelete) {
      try {
        await axios.delete(`${request}/api/blog/delete/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
        toast.success("Blog deleted successfully");
      } catch (error) {
        toast.error(getError(error));
      }
    }
  };

  const updateBlog = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${request}/api/blog/update/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateOrAddBlog = async () => {
    if (formData._id) {
      try {
        const updatedData = {
          title: formData.title,
          description: formData.description,
          image: formData.image,
          comments: formData.comments,
        };
        const updatedBlog = await updateBlog(formData._id, updatedData);

        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === formData._id ? updatedBlog : blog
          )
        );

        toast.success("Blog updated successfully");
      } catch (error) {
        console.error("Error updating blog:", error);
        toast.error("Failed to update blog");
      }
    } else {
      addBlog();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateOrAddBlog();
    setFormData({
      title: "",
      description: "",
      image: "",
      comments: [],
      _id: "",
    });
  };

  const handleCancelEdit = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      comments: [],
      _id: "",
    });
  };

  //============
  const paginationRef = useRef(null);

  const handlePageChange = (page) => {
    fetchBlogs(page);
    if (paginationRef.current) {
      paginationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  console.log(blogs);
  return (
    <>
      <Helmet>
        <title>Blogs</title>
      </Helmet>
      <div className="product_edit blog_admin_page  admin_page_all page_background">
        <div className="container">
          <div className="productTitleContainer">
            <h3 className="productTitle light_shadow uppercase">
              Add and Update Blog Post
            </h3>
          </div>
          <div className="productBottom mtb ">
            <div className="productForm">
              <div className="product_info product___">
                <div className="features_box mt light_shadow">
                  <div ref={headerRef} className="header  c_flex">
                    <div className="left">
                      <div className="d_flex">
                        <div className="number l_flex">
                          <span>00</span>
                        </div>
                        <div className="text">
                          <h4>Blog Post</h4>
                          <small>Add and update blog post below</small>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <KeyboardArrowUpIcon className="icon" />
                    </div>
                  </div>

                  <>
                    <div className="product_info_color ">
                      <div ref={paginationRef} className="product_info_box ">
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
                              {formData._id ? "Update Blog" : "Add Blog"}
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
                          {blogs?.map((blog) => (
                            <li key={blog._id} className="mb">
                              <div>
                                <div>
                                  <strong>Title: </strong>
                                  <span>{blog.title}</span>
                                </div>
                                <div>
                                  <strong>Image: </strong>
                                  <span>{blog.image}</span>
                                </div>{" "}
                              </div>
                              <span className="d_flex">
                                <button
                                  type="submit"
                                  onClick={() => editBlog(blog._id)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteBlog(blog._id)}
                                >
                                  Delete
                                </button>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="ant_pagination l_flex mt">
                          <Pagination
                            total={totalPages * 5} // Assuming 5 items per page
                            itemRender={itemRender}
                            current={currentPage}
                            pageSize={5} // Number of items per page
                            onChange={(page) => handlePageChange(page)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
