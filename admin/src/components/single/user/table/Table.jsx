import { useEffect, useState } from "react";
import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import PropTypes from "prop-types";
import { request } from "../../../../../base url/BaseUrl";
import MessageBox from "../../../../../utilities/message loading/MessageBox";
import { formatPrice } from "../../../../../utilities/utils/Utils";

function UserOrderList({ userId, userInfo }) {
  const Button = ({ type }) => {
    let className = "widgetLgButton";
    if (type === "APPROVED") {
      className += " approved";
    } else if (type === "PROCESSING") {
      className += " inProgress";
    } else if (type === "CANCELED") {
      className += " canceled";
    } else if (type === "PASSIVE") {
      className += " passive";
    }

    return <button className={className}>{type}</button>;
  };
  Button.propTypes = {
    type: PropTypes.string.isRequired,
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${request}/api/orders/mine/${userId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setOrders(data.orders);
      } catch (error) {
        // Handle error
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);
  console.log(orders);

  return (
    <div className="dashboard_table">
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">Tracking ID</TableCell>
              <TableCell className="tableCell">Date</TableCell>
              <TableCell className="tableCell">Amount</TableCell>
              <TableCell className="tableCell">Payment Method</TableCell>
              <TableCell className="tableCell">Delivery Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="tableCenter p_flex">
            {orders?.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="tableCell">{order.trackingId}</TableCell>
                <TableCell className="tableCell">
                  {order.createdAt.substring(0, 10)}
                </TableCell>
                <TableCell className="tableCell">
                  <div className="price">
                    {formatPrice(order.grandTotal?.toFixed(2))}
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  <div className="paidAt">
                    {order.paymentMethod ? (
                      order.paymentMethod
                    ) : (
                      <span className="red">NOT PAID</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  {order.isPaid && order.isDelivered && order.isRefunded ? (
                    <Button type="CANCELED" />
                  ) : order.isDelivered ? (
                    <Button type="APPROVED" />
                  ) : order.isPaid && !order.isRefunded ? (
                    <Button type="PROCESSING" />
                  ) : order.isRefunded ? (
                    <Button type="CANCELED" />
                  ) : (
                    <Button type="PASSIVE" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>{" "}
      {orders?.length === 0 && (
        <span className="product-not">
          <MessageBox>No Orders Found </MessageBox>
        </span>
      )}
    </div>
  );
}
// PropTypes validation for Featured component props
UserOrderList.propTypes = {
  userId: PropTypes.string.isRequired, // Validate 'userId' prop as a number and required
  userInfo: PropTypes.object.isRequired, // Validate 'salesStats' prop as a string and required
  convertCurrency: PropTypes.func.isRequired, // Validate 'CustomTooltip' prop as a function and required
};
export default UserOrderList;
