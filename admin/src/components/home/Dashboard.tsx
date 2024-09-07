import { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";

import "./styles.scss";
import axios from "axios";
import PropTypes from "prop-types";
import Widget from "../../common/widget/Widget";
import LoadingBox from "../../utilities/message loading/LoadingBox";
import MessageBox from "../../utilities/message loading/MessageBox";
import Chart from "../../common/chart/Chart";
import { getError } from "../../utilities/utils/Utils";
import { request } from "../../base url/BaseUrl";
import TableData from "../../common/table/Table";

const formatNumber = (num) => {
  const absNum = Math.abs(num);
  const ranges = [
    { divider: 1e9, suffix: "b" },
    { divider: 1e6, suffix: "m" },
    { divider: 1e3, suffix: "k" },
  ];
  for (const range of ranges) {
    if (absNum >= range.divider) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 1,
        }).format(num / range.divider) + range.suffix
      );
    }
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 1,
  }).format(num);
};

const formatShortNumber = (num) => {
  const absNum = Math.abs(num);
  const ranges = [
    { divider: 1e9, suffix: "b" },
    { divider: 1e6, suffix: "m" },
    { divider: 1e3, suffix: "k" },
  ];
  for (const range of ranges) {
    if (absNum >= range.divider) {
      return (num / range.divider).toFixed(1) + range.suffix;
    }
  }
  return num.toString();
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function Dashboard() {
  const { state } = useContext(Context);
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: {
      salesData: [],
      users: [{ numUsers: 0 }],
      orders: [{ numOrders: 0 }],
      income: [{ sales: 0 }],
      salePerformance: [{ sales: 0 }],
    },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${request}/api/orders/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        console.log(err);
      }
    };
    fetchData();
  }, [userInfo]);

  const [salesStats, setSalesStats] = useState([]);

  useEffect(() => {
    const getStats = () => {
      const stats = summary.dailyOrders?.reverse().map((item) => ({
        name: item._id,
        "Total Sales": item.sales,
      }));
      setSalesStats(stats);
    };
    getStats();
  }, [summary.dailyOrders]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom_tooltip" style={{ padding: "10px" }}>
          {label ? (
            <p className="label">{`${label}`}</p>
          ) : payload[0]?.name ? (
            <p className="">{`Date: ${payload[0]?.name}`}</p>
          ) : (
            ""
          )}
          <p className="" style={{ color: "#5550bd", marginTop: "3px" }}>
            Total Sales: {`${formatNumber(payload[0]?.value)}`}
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

  const userNum = summary.users.length ? summary.users[0].numUsers : 0;
  const TotalUsers = formatShortNumber(userNum);

  const orderNum = summary.orders.length ? summary.orders[0].numOrders : 0;
  const TotalOrders = formatShortNumber(orderNum);

  // REFUNDS
  const refundedOrders = summary.refundedOrders || {
    numRefunded: 0,
    totalAmountRefunded: 0,
  };
  const numRefunded = formatShortNumber(refundedOrders.numRefunded);
  const totalAmountRefunded = formatNumber(refundedOrders.totalAmountRefunded);

  const salesTotal = summary.income.length ? summary.income[0].sales : 0;
  const TotalSales = formatNumber(salesTotal); // You can keep formatPrice for TotalSales if you want currency formatting.

  const grandTotal = summary.salePerformance.length
    ? summary.salePerformance[0].sales
    : 0;
  const GrandTotalSales = formatNumber(grandTotal); // Using formatNumber for GrandTotalSales.

  console.log(numRefunded, totalAmountRefunded);
  return (
    <div className="admin_page_all admin_page_screen">
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <div className="home dashboard container s_flex">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div className="widgets ">
              <Widget TotalUsers={TotalUsers} summary={summary} type="user" />
              <Widget TotalOrders={TotalOrders} type="order" />
              <Widget numRefunded={numRefunded} type="numRefund" />
              <Widget TotalSales={TotalSales} type="income" />
              <Widget
                totalAmountRefunded={totalAmountRefunded}
                type="amountRefunded"
              />
              <Widget GrandTotalSales={GrandTotalSales} type="balance" />
            </div>
            <div className="charts">
              <Chart
                title="Last 10 Days (Revenue)"
                data={salesStats}
                grid
                CustomTooltip={CustomTooltip}
                dataKey="Total Sales"
                aspect={2 / 1}
              />
            </div>
            <div className="listContainer">
              <div className="listTitle">Latest Transactions</div>
              <TableData />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
