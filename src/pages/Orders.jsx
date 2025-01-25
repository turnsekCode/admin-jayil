import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(5); // Inicialmente mostrar 5 pedidos

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (orderId, status, email, orderNumber) => {
    try {
      const emailData = { orderId, status, email, orderNumber };
      const response = await axios.post(`${backendUrl}/send-email-status`, emailData);

      if (response.data.success) {
        toast.success('Email enviado exitosamente.');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error al enviar el email.');
    }
  };

  const loadMoreOrders = () => {
    setVisibleOrders(prev => prev + 5); // Aumenta el número de pedidos visibles en 5
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Orders page</h3>
      <div>
        {orders?.slice(0, visibleOrders).map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order?.items?.map((item, i) => (
                  <p className="py-0.5" key={i}>
                    {item.name} x {item.quantity}
                  </p>
                ))}
              </div>
              <p>{order.orderNumber}</p>
              <p className="my-3 mb-2 font-medium">
                {order.address.name} {order.address.lastName}
              </p>
              <div>
                <p>{order.address.address},</p>
                <p>{order.address.email},</p>
                <p>
                  {order.address.city}, {order.address.province}, {order.address.country},{' '}
                  {order.address.postalCode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount.toFixed(2)}
            </p>
            <div>
              <select
                className="p-2 font-semibold"
                onChange={(e) => handleStatusChange(order._id, e.target.value, order.address.email, order.orderNumber)}
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      {orders?.length > visibleOrders && (
        <button
          className="mt-4 p-2 bg-[#C15470] text-white font-semibold rounded"
          onClick={loadMoreOrders}
        >
          Ver más
        </button>
      )}
    </div>
  );
};

export default Orders;
