import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import "./styles.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PropTypes from "prop-types";
import { request } from "../../../../base url/BaseUrl";
import { getError } from "../../../../utilities/utils/Utils";
import PublishIcon from "@mui/icons-material/Publish";
import photo from "../../../../assets/photo.jpg";

export function Category({ openBox, toggleBox }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    img: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${request}/api/category`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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

  const addCategory = async () => {
    if (!formData.name || !formData.description) {
      console.error("Name and Description are required");
      return;
    }
    try {
      const response = await axios.post(
        `${request}/api/category/create-category`,
        formData
      );
      setCategories((prevCategories) => [...prevCategories, response.data]);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      toast.error(getError(error));
    }
  };

  const headerRef = useRef(null);

  // Function to handle editing a category
  const editCategory = (id) => {
    headerRef.current.scrollIntoView({ behavior: "smooth" });

    const selectedCategory = categories.find((category) => category._id === id);
    if (selectedCategory) {
      setFormData({
        ...selectedCategory.categories[0],
        _id: id,
      });
    } else {
      console.error("No data found for the category being edited.");
      toast.error("No data found for the category being edited.");
    }
  };

  // Function to delete a category
  const deleteCategory = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (shouldDelete) {
      try {
        await axios.delete(`${request}/api/category/delete-category/${id}`);
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
        toast.success("Category deleted successfully");
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error(getError(error));
      }
    }
  };

  // Function to update an existing category
  const updateCategory = async () => {
    if (!formData.name || !formData.description) {
      console.error("Name and Description are required");
      return;
    }
    try {
      const response = await axios.put(
        `${request}/api/category/update-category/${formData._id}`,
        formData
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === formData._id ? response.data : category
        )
      );
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error(getError(error));
    }
  };

  const updateOrAddCategory = async () => {
    if (formData._id) {
      updateCategory();
    } else {
      addCategory();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateOrAddCategory(); // Ensure the category is created/updated before clearing the form

    setFormData({
      img: "",
      name: "",
      description: "",
      _id: "",
    });
  };

  const handleCancelEdit = () => {
    setFormData({
      img: "",
      name: "",
      description: "",
      _id: "",
    });
  };

  //PROFILE PICTURE
  const [loadingUpload, setLoadingUpload] = useState(false);
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (!file) {
      return toast.error("No file selected", { position: "bottom-center" });
    }

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      setLoadingUpload(true); // Start loading
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Image uploaded successfully", {
        position: "bottom-center",
      });

      // Set the uploaded image URL to the formData state
      setFormData((prevData) => ({
        ...prevData,
        img: data.publicUrl,
      }));
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
    } finally {
      setLoadingUpload(false); // End loading
    }
  };

  return (
    <>
      <div className="productBottom mtb">
        <div className="productForm">
          <div className="product_info product___">
            <div ref={headerRef} className="features_box mt light_shadow">
              <div
                className={
                  openBox === 0 ? "header c_flex" : "header border c_flex"
                }
                onClick={() => toggleBox(0)}
              >
                <div className="left">
                  <div className="d_flex">
                    <div className="number l_flex">
                      <span>01</span>
                    </div>
                    <div className="text">
                      <h4>Category</h4>
                      <small>Add and update category below</small>
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
                  <div className="product_info_color ">
                    <div className="product_info_box ">
                      <form onSubmit={handleSubmit} className="form_input">
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Category Name"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Category Description"
                          />
                        </div>
                        <div className="img_drop_zone a_flex">
                          <div className="drop_zone">
                            <div className="img l_flex">
                              {" "}
                              <img
                                src={formData.img ? formData.img : photo}
                                alt=""
                                className="image"
                              />
                            </div>
                            <label
                              htmlFor="file"
                              className={
                                loadingUpload
                                  ? "icon_bg l_flex disabled"
                                  : "icon_bg l_flex"
                              }
                            >
                              {loadingUpload ? (
                                <i className="fa fa-spinner fa-spin"></i>
                              ) : (
                                <>
                                  <input
                                    className="profile-input-box"
                                    id="file"
                                    type="file"
                                    onChange={uploadFileHandler}
                                    style={{ display: "none" }}
                                  />
                                  <div>
                                    <PublishIcon
                                      className={
                                        formData.img ? "icon" : "icon no_image"
                                      }
                                    />
                                  </div>
                                </>
                              )}
                            </label>
                          </div>
                          <div className="form-group">
                            <label htmlFor="img">Image link</label>
                            <input
                              type="text"
                              name="img"
                              value={formData.img}
                              onChange={handleInputChange}
                              placeholder="Category image link"
                            />
                          </div>
                        </div>

                        <div className="a_flex">
                          <button type="submit">
                            {formData._id ? "Update Category" : "Add Category"}
                          </button>
                          &nbsp; &nbsp;
                          {formData._id && (
                            <button type="button" onClick={handleCancelEdit}>
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>

                      <ul className="color_list home_wrappers">
                        {categories?.map((category) => (
                          <li key={category._id} className="mb">
                            <div>
                              <div>
                                <strong>Name: </strong>
                                <span>{category.categories[0].name}</span>
                              </div>
                              <div>
                                <strong>Description: </strong>
                                <span>
                                  {category.categories[0].description}
                                </span>
                              </div>
                            </div>
                            <span className="d_flex">
                              <button
                                type="submit"
                                onClick={() => editCategory(category._id)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteCategory(category._id)}
                              >
                                Delete
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Category.propTypes = {
  openBox: PropTypes.number.isRequired,
  toggleBox: PropTypes.func.isRequired,
};

export function Price({ openBox, toggleBox }) {
  const [priceData, setPriceData] = useState({
    minValue: "",
    maxValue: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPriceId, setCurrentPriceId] = useState("");

  useEffect(() => {
    fetchPriceData();
  }, []);

  const fetchPriceData = async () => {
    try {
      const response = await axios.get(`${request}/api/price`);
      if (response.data.length > 0) {
        setPriceData(response.data[0]);
        setCurrentPriceId(response.data[0]._id);
      } else {
        // Handle the case where no price data is available
        console.error("No price data found.");
        // You can set default values here if needed
      }
    } catch (error) {
      console.error("Failed to fetch price data:", error);
      toast.error(getError(error));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPriceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${request}/api/price/${currentPriceId}`, priceData);
      toast.success("Price updated successfully");
    } catch (error) {
      console.error("Failed to update price:", error);
      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  };

  console.log(priceData);

  return (
    <>
      <div className="productBottom mtb">
        <form onSubmit={handleSubmit}>
          <div className="productForm">
            <div className="product_info product___">
              <div className="features_box mt light_shadow">
                <div
                  className={
                    openBox === 1 ? "header  c_flex" : "header border c_flex"
                  }
                  onClick={() => toggleBox(1)}
                >
                  <div className="left">
                    <div className="d_flex">
                      <div className="number l_flex">
                        <span>02</span>
                      </div>
                      <div className="text">
                        <h4>Price</h4>
                        <small>Update price range</small>
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
                  <>
                    <div className="features box">
                      <div className="inline_input c_flex">
                        <div className="form-group">
                          <label htmlFor="minValue">Minimum Value</label>
                          <input
                            type="number"
                            id="minValue"
                            name="minValue"
                            value={priceData.minValue}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="maxValue">Maximum Value</label>
                          <input
                            type="number"
                            id="maxValue"
                            name="maxValue"
                            value={priceData.maxValue}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bottom_btn mtb">
                      <span className="">
                        <button
                          type="submit"
                          className="a_flex"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span>Saving...</span>
                              <div className="loader"></div>
                            </>
                          ) : (
                            <>
                              <DescriptionOutlinedIcon className="icon" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
Price.propTypes = {
  openBox: PropTypes.number.isRequired,
  toggleBox: PropTypes.func.isRequired,
};
