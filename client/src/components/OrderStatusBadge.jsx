const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Preparing: 'bg-blue-100 text-blue-800',
    Served: 'bg-green-100 text-green-800',
    Completed: 'bg-gray-100 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
