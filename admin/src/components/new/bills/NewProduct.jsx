import { useContext, useReducer, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import CloseIcon from "@mui/icons-material/Close";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Checkbox } from "antd";
import { Context } from "../../../../context/Context";
import { request } from "../../../../base url/BaseUrl";
import { getError } from "../../../../utilities/utils/Utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false };

    default:
      return state;
  }
};

function NewProduct() {
  const [{ loading, loadingUpload }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const { state } = useContext(Context);
  const { userInfo, categories } = state;

  const navigate = useNavigate();

  const editor = useRef(null);

  const [name, setName] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [blackFriday, setBlackFriday] = useState(false);

  //=================
  //DELETE IMAGES
  //=================
  const deleteFileHandler = async (fileName) => {
    setImages(images.filter((x) => x !== fileName));
    toast.success("Image removed successfully. Click update to apply it", {
      position: "bottom-center",
    });
  };

  //============
  //TOGGLE BOX
  //============
  const [openBox, setOpenBox] = useState(null);

  const toggleBox = (index) => {
    if (openBox === index) {
      setOpenBox(null);
    } else {
      setOpenBox(index);
    }
  };

  //==================
  // TOGGLE FEATURES BOX
  //==================
  const [featureData, setFeatureData] = useState([
    { featureName: "", featureValue: "" }, // Initialize with one empty specification
  ]);

  const addMoreFeature = () => {
    setFeatureData([...featureData, { featureName: "", featureValue: "" }]);
  };

  // Delete feature function
  const deleteFeature = (featureIndex) => {
    const updatedFeatureData = [...featureData];
    updatedFeatureData.splice(featureIndex, 1);
    setFeatureData(updatedFeatureData);
  };

  //==================
  // TOGGLE SPECIFICATIONS BOX
  //==================
  const [specificationsData, setSpecificationsData] = useState([
    { name: "" }, // Initialize with one empty specification
  ]);

  const addMoreSpecification = () => {
    setSpecificationsData([...specificationsData, { name: "" }]);
  };

  // Delete specification function
  const deleteSpecification = (specificationIndex) => {
    const updatedSpecificationsData = [...specificationsData];
    updatedSpecificationsData.splice(specificationIndex, 1);
    setSpecificationsData(updatedSpecificationsData);
  };

  //=================
  // CREATE PRODUCT
  //=================
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });

      if (!name) {
        toast.error("Please enter product name", { position: "bottom-center" });
        dispatch({ type: "CREATE_FAIL" }); // Add this line
        return;
      }
      if (!price) {
        toast.error("Please add product price", { position: "bottom-center" });
        dispatch({ type: "CREATE_FAIL" }); // Add this line
        return;
      }

      const cleanedFeatureData = featureData.filter((feature) => {
        return (
          feature.featureName.trim() !== "" ||
          feature.featureValue.trim() !== ""
        );
      });

      const cleanedSpecificationsData = specificationsData.filter(
        (specification) => {
          return specification.name.trim() !== "";
        }
      );

      const productData = {
        name,
        countInStock,
        price,
        discount,
        description,
        weight,
        category,
        images,
        blackFriday,
        features: cleanedFeatureData,
        specifications: cleanedSpecificationsData,
      };

      await axios.post(`${request}/api/products`, productData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      dispatch({ type: "CREATE_SUCCESS" });
      toast.success("Product created successfully", {
        position: "bottom-center",
      });

      navigate("/admin/products");
    } catch (err) {
      console.error("Error creating product:", err);
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  //=================
  // IMAGES UPLOAD
  //=================
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (!file) {
      return toast.error("No file selected", { position: "bottom-center" });
    }

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post(`${request}/api/upload`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });

      if (forImages) {
        setImages([...images, data.publicUrl]); // Use publicUrl instead of secure_url
      }

      toast.success("Image uploaded successfully. Click update to apply it", {
        position: "bottom-center",
      });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UPLOAD_FAIL" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Product</title>
      </Helmet>
      <div className="product_edit admin_page_all page_background">
        <div className="container">
          <div className=" ">
            <div className="productTitleContainer">
              <h3 className="productTitle light_shadow uppercase">
                Add Product
              </h3>
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
                              <h4>Product Info</h4>
                              <small>Fill all information below</small>
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
                        <div className="product_info_box box">
                          <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                              type="text"
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="product name"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="quantity">Quantity</label>
                            <input
                              type="text"
                              id="quantity"
                              value={countInStock}
                              onChange={(e) => setCountInStock(e.target.value)}
                              placeholder="123"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                              type="text"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              id="price"
                              placeholder="1023"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="discount">Discount</label>
                            <input
                              type="text"
                              id="discount"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                              placeholder="15 in %"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="weight">Weight</label>
                            <input
                              type="text"
                              id="weight"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              placeholder="225 in g"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                              name="category"
                              id="category"
                              value={category}
                              onChange={(e) => {
                                setCategory(e.target.value);
                              }}
                            >
                              <option value="" disabled>
                                Select Category
                              </option>
                              {categories?.map((categoryGroup) =>
                                categoryGroup?.categories?.map((cat) => (
                                  <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>

                          <div className="form-group a_flex black_friday">
                            <Checkbox
                              checked={blackFriday}
                              onChange={() =>
                                setBlackFriday((prevValue) => !prevValue)
                              }
                            >
                              Activate on sale
                            </Checkbox>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="light_shadow mt product_color">
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
                              <h4>Product Features</h4>
                              <small>Add product Features</small>
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
                        <div className="product_info_color">
                          <div className="product_info_box box">
                            {featureData.map((feature, featureIndex) => (
                              <div className="form-group" key={featureIndex}>
                                <label htmlFor="feature">Feature</label>
                                <span className="feature_name">
                                  <input
                                    type="text"
                                    id="feature"
                                    value={feature.featureName}
                                    onChange={(e) => {
                                      const updatedFeatureData = [
                                        ...featureData,
                                      ];
                                      updatedFeatureData[
                                        featureIndex
                                      ].featureName = e.target.value;
                                      setFeatureData(updatedFeatureData);
                                    }}
                                    placeholder="feature name e.g Color"
                                  />
                                </span>
                                <span className="link_img">
                                  <input
                                    type="text"
                                    id="feature"
                                    value={feature.featureValue}
                                    onChange={(e) => {
                                      const updatedFeatureData = [
                                        ...featureData,
                                      ];
                                      updatedFeatureData[
                                        featureIndex
                                      ].featureValue = e.target.value;
                                      setFeatureData(updatedFeatureData);
                                    }}
                                    placeholder="feature value e.g Red"
                                  />
                                </span>
                                {featureData.length > 1 && (
                                  <button
                                    type="button"
                                    className="remove_btn a_flex first_btn next_del_btn"
                                    onClick={() => deleteFeature(featureIndex)}
                                  >
                                    <span className="a_flex">
                                      <CloseIcon className="icon" />
                                      Delete Feature
                                    </span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="add_more_btn">
                            <span onClick={addMoreFeature}>
                              Add More Features
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="light_shadow mt product_color">
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
                              <h4>Product Specifications</h4>
                              <small>Add product specifications</small>
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
                        <div className="product_info_color">
                          <div className="product_info_box box">
                            {specificationsData.map(
                              (specification, specificationIndex) => (
                                <div
                                  className="form-group"
                                  key={specificationIndex}
                                >
                                  <label htmlFor="specification">
                                    Specification
                                  </label>
                                  <span className="specification_name">
                                    <input
                                      type="text"
                                      id="specification"
                                      value={specification.name}
                                      onChange={(e) => {
                                        const updatedSpecificationsData = [
                                          ...specificationsData,
                                        ];
                                        updatedSpecificationsData[
                                          specificationIndex
                                        ].name = e.target.value;
                                        setSpecificationsData(
                                          updatedSpecificationsData
                                        );
                                      }}
                                      placeholder="specification detail"
                                    />
                                  </span>

                                  {specificationsData.length > 1 && (
                                    <button
                                      type="button"
                                      className="remove_btn a_flex first_btn next_del_btn"
                                      onClick={() =>
                                        deleteSpecification(specificationIndex)
                                      }
                                    >
                                      <span className="a_flex">
                                        <CloseIcon className="icon" />
                                        Delete Specification
                                      </span>
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                          <div className="add_more_btn">
                            <span onClick={addMoreSpecification}>
                              Add More Specifications
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="light_shadow mt product_images">
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
                              <h4>Product Images</h4>
                              <small>Upload product images</small>
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
                        <div className="product_info_images">
                          <div className="product_info_img_box box">
                            <div className="form_group f_flex">
                              {images.map((x) => (
                                <div key={x} className="drop_zone">
                                  <img src={x} alt="" className="images" />
                                  <div className="icon_bg l_flex">
                                    <CloseIcon
                                      onClick={() => deleteFileHandler(x)}
                                      className="icon"
                                    />
                                  </div>
                                </div>
                              ))}
                              <div>
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
                                    <>
                                      <div className="inner">
                                        <div className="icon_btn">
                                          <CloudUploadIcon className="icon" />
                                        </div>
                                        <div className="text">
                                          <div>
                                            <p>Upload product images</p>
                                          </div>
                                          <div>
                                            <small>
                                              recommended: high quality, small
                                              size image
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                      <input
                                        style={{ display: "none" }}
                                        type="file"
                                        id="files"
                                        onChange={(e) =>
                                          uploadFileHandler(e, true)
                                        }
                                      />{" "}
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="light_shadow mt product_description ">
                      <div
                        className={
                          openBox === 4
                            ? "header  c_flex"
                            : "header border c_flex"
                        }
                        onClick={() => toggleBox(4)}
                      >
                        <div className="left">
                          <div className="d_flex">
                            <div className="number l_flex">
                              <span>05</span>
                            </div>
                            <div className="text">
                              <h4>Product Description</h4>
                              <small>
                                Provide in detail product description
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          {openBox === 4 ? (
                            <KeyboardArrowUpIcon className="icon" />
                          ) : (
                            <KeyboardArrowDownIcon className="icon" />
                          )}
                        </div>
                      </div>
                      {openBox === 4 && (
                        <div className="product_info_desc ">
                          <div className="box">
                            <div className="form_group">
                              <label htmlFor="">Description</label>
                              <JoditEditor
                                className="editor"
                                id="desc"
                                ref={editor}
                                value={description}
                                // config={config}
                                tabIndex={1} // tabIndex of textarea
                                onBlur={(newContent) =>
                                  setDescription(newContent)
                                } // preferred to use only this option to update the content for performance reasons
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bottom_btn mtb">
                  <span className="a_flex">
                    <button
                      className=" a_flex"
                      onClick={() => navigate("/admin/products")}
                    >
                      <CloseIcon className="icon" /> Cancel
                    </button>
                    <button type="submit" className="a_flex" disabled={loading}>
                      {loading ? (
                        <div className="loading-spinner">Loading...</div>
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

export default NewProduct;
