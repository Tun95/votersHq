import { useContext, useEffect, useReducer, useState } from "react";
import Chart from "../../../components/chart/Chart";
import { Link, useParams } from "react-router-dom";
import "../styles/styles.scss";
import axios from "axios";
import me from "../../../../assets/me.png";

import UserOrderList from "./table/Table";
import { Helmet } from "react-helmet-async";
import Widget from "../../../components/widget/Widget";
import PropTypes from "prop-types";
import { Context } from "../../../../context/Context";
import { request } from "../../../../base url/BaseUrl";
import { formatPrice, getError } from "../../../../utilities/utils/Utils";
import LoadingBox from "../../../../utilities/message loading/LoadingBox";
import MessageBox from "../../../../utilities/message loading/MessageBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_ORDER_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_ORDER_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        error: "",
      };
    case "FETCH_ORDER_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
function UserInfo() {
  const params = useParams();
  const { id: userId } = params;

  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    user: {},
    loading: true,
  });

  const [userSpending, setUserSpending] = useState([]);

  //========
  //FETCHING
  //========
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  //==============
  //SPENDING STATS
  //==============
  useEffect(() => {
    if (user.dailyOrders) {
      const spendingData = user.dailyOrders.map((item) => ({
        name: item._id,
        "Total Sales": item.sales,
      }));
      console.log("Processed User Spending Data:", spendingData);
      setUserSpending(spendingData);
    }
  }, [user.dailyOrders]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom_tooltip" style={{ padding: "10px" }}>
          <p className="label">{`${label}`}</p>
          <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
            Total Sales: {`${formatPrice(payload[0]?.value)}`}
          </p>
        </div>
      );
    }

    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool.isRequired,
    payload: PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
  };

  //AVAILABLE BALANCE
  const balance = user?.user?.availableBalance
    ? user?.user?.availableBalance?.toFixed(0)
    : 0;
  const SellersBalance = formatPrice(balance);

  console.log("userSpending:", userSpending);

  return (
    <div className="product_edit admin_page_all">
      <div className="container">
        <div className=" ">
          <div className="productTitleContainer">
            <h3 className="productTitle light_shadow uppercase">
              User Details For: {user.user?.lastName} {user?.user?.firstName}
            </h3>
          </div>
          <Helmet>
            <title>User Info</title>
          </Helmet>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <div className="userInfotop">
                <div className="left light_shadow">
                  <div className="editButton">
                    <Link to={`/admin/user/${userId}/edit`}>Edit</Link>
                  </div>
                  <h1 className="title">Information</h1>
                  <div className="item">
                    <img
                      src={user?.user?.image ? user?.user?.image : me}
                      alt=""
                      className="itemImg"
                    />
                    <div className="details">
                      <h1 className="itemTitle">
                        {user?.user?.firstName} {user?.user?.lastName}
                      </h1>
                      <div className="detailItem">
                        <span className="itemKey">Email:</span>
                        <span className="itemValue">{user?.user?.email}</span>
                      </div>
                      <div className="detailItem">
                        <span className="itemKey">Phone:</span>
                        <span className="itemValue">{user?.user?.phone}</span>
                      </div>{" "}
                      <div className="detailItem">
                        <span className="itemKey">Address:</span>
                        <span className="itemValue">{user?.user?.address}</span>
                      </div>{" "}
                      <div className="detailItem">
                        <span className="itemKey">Country:</span>
                        <span className="itemValue">{user?.user?.country}</span>
                      </div>
                      <div className="detailItem a_flex">
                        <span className="itemKey">Status:</span>
                        <span className="itemValue">
                          {!user?.user?.isAccountVerified ? (
                            <span className="unverified_account a_flex">
                              unverified account
                            </span>
                          ) : (
                            <span className="verified_account a_flex">
                              verified account
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  {user?.user?.isSeller ? (
                    <div className="userInfo_widget">
                      <Widget SellersBalance={SellersBalance} type="seller" />
                    </div>
                  ) : null}
                </div>
                <div className="right light_shadow">
                  <Chart
                    aspect={3 / 1}
                    data={userSpending}
                    CustomTooltip={CustomTooltip}
                    grid
                    dataKey="Total Sales"
                    title="User Spending (Last 10 Days)"
                  />
                </div>
              </div>
              <div className="bottom light_shadow">
                <h1 className="title">Last Transactions</h1>
                <UserOrderList userId={userId} userInfo={userInfo} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
