import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState(5); // Inicialmente mostrar 5 pedidos
  const [cantidadProductos, setCantidadProductos] = useState(0);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
      if (response.data.success) {
        // Ordenar las órdenes por `_id` de mayor a menor (más reciente primero)
        const sortedOrders = response.data.orders.sort((a, b) => b._id.localeCompare(a._id));
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const total = orders.reduce((acc, order) => acc + order.items.length, 0);
    setCantidadProductos(total);  // Actualiza el estado con el total
  }, [orders]);


  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`, { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        toast.success('Status actualizado exitosamente.');
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error al actualizar el status')
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
      <h3>Orders page</h3><span>Total de productos: {cantidadProductos}</span>
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
              <p className="mt-3">Method: <span className='font-bold'>{order.paymentMethod}</span></p>
              <p>
                Payment:{" "}
                <span
                  className={
                    (order.payment || ['pagado', 'Enviado', 'Empacando'].includes(order.status))
                      ? 'text-green-500 font-semibold'
                      : 'text-orange-500 font-semibold'
                  }
                >
                  {(order.payment || ['pagado', 'Enviado', 'Empacando'].includes(order.status)) ? 'Done' : 'Pending'}
                </span>
              </p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px] font-bold">
              {currency}
              {order.amount.toFixed(2)}
            </p>
            <div>
              <select
                className="p-2 font-semibold"
                onChange={(event) => { statusHandler(event, order._id), handleStatusChange(order._id, event.target.value, order.address.email, order.orderNumber) }}
                value={order.status}
              >
                <option value="Pedido realizado">Pedido realizado</option>
                <option value="Pagado">Pagado</option>
                <option value="Empacando">Empacando</option>
                <option value="Enviado">Enviado</option>
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
