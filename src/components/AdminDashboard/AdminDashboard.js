import React, { useState, useEffect } from 'react';
import { BsCheckCircleFill } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import axios from 'axios';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeSection, setActiveSection] = useState('products'); // Default to show products
  const [showAddProductForm, setShowAddProductForm] = useState(false); // To handle form visibility
  const [productName, setProductName] = useState("")
  const [price, setPrice] = useState()
  const [stock, setStock] = useState()
  const [image, setImage] = useState(null)

  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: '$120', stock: 30, image: null },
    { id: 2, name: 'Product 2', price: '$150', stock: 10, image: null },
    { id: 3, name: 'Product 3', price: '$90', stock: 50, image: null },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Sam Wilson', email: 'sam@example.com', status: 'Active' },
  ]);

  const [payments, setPayments] = useState([
    { id: 1, mode: 'Credit Card', status: 'Completed' },
    { id: 2, mode: 'PayPal', status: 'Pending' },
    { id: 3, mode: 'Bank Transfer', status: 'Completed' },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, product: 'Product 1', status: 'Shipped' },
    { id: 2, product: 'Product 2', status: 'Processing' },
    { id: 3, product: 'Product 3', status: 'Delivered' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, sender: 'Jane Smith', message: 'printer printiing not working', status: 'Pending' },
    { id: 2, sender: 'John Doe', message: 'half image is printed in printer', status: 'Pending' },
    { id: 3, sender: 'Sam Wilson', message: 'Asked for permission to add a product', status: 'Pending' },
  ]);

  const [editing, setEditing] = useState({ section: null, id: null }); // Track which item is being edited

  const handleEdit = (section, id) => {
    setEditing({ section, id });
  };

  const handleSaveEdit = (section, id, updatedData) => {
    if (section === 'products') {
      setProducts(products.map((product) => (product.id === id ? { ...product, ...updatedData } : product)));
    } else if (section === 'users') {
      setUsers(users.map((user) => (user.id === id ? { ...user, ...updatedData } : user)));
    }
    setEditing({ section: null, id: null }); // Close the edit form
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/products/add',
        {
          productName,
          price,
          image,
          stock,
        }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('Product added successfully!');
      // Reset the form
      setProductName('');
      setPrice('');
      setImage(null);
      setStock('')

      fetchProducts()
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }

    const newProduct = {
      id: products.length + 1,
      name: formData.get('name'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      image: formData.get('image'), // Adding the image to the new product
    };
    setProducts([...products, newProduct]);
    setShowAddProductForm(false); // Close the form after adding the product
  };


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/book/appointments");
        // console.log("appointment data", response);
        setAppointments(response.data);
        // console.log(response.data);
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchAppointments();
  });

  const handleNotificationAction = (id, action) => {
    setNotifications(notifications.map((notification) =>
      notification.id === id ? { ...notification, status: action } : notification
    ));
  };

  const handleAppointmentAction = async (id, action) => {

    console.log("id", id);

    try {
      const url = `http://localhost:5000/api/book/appointments/${id}/${action === 'Accepted' ? 'approve' : 'deny'}`;
  
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error Response:', errorResponse);
        throw new Error(`Failed to update appointment status: ${response.status} ${response.statusText}`);
      }
  
      // Update the local state after successful API response
      const updatedAppointment = await response.json();
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === id ? updatedAppointment : appointment
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };
  

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-auto">
        <h2 className="text-xl font-semibold text-center mb-6">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <a
              href="#products"
              className="hover:text-primeColor"
              onClick={() => {
                setActiveSection('products');
                setShowAddProductForm(false); // Close add form if another section is clicked
              }}
            >
              Products
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#users"
              className="hover:text-primeColor"
              onClick={() => {
                setActiveSection('users');
                setShowAddProductForm(false); // Close add form if another section is clicked
              }}
            >
              Users
            </a>
          </li>
          {/* <li className="mb-4">
            <a
              href="#payments"
              className="hover:text-primeColor"
              onClick={() => {
                setActiveSection('payments');
                setShowAddProductForm(false); // Close add form if another section is clicked
              }}
            >
              Payments
            </a>
          </li> */}
          <li className="mb-4">
            <a
              href="#orders"
              className="hover:text-primeColor"
              onClick={() => {
                setActiveSection('orders');
                setShowAddProductForm(false); // Close add form if another section is clicked
              }}
            >
              Orders
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#notifications"
              className="hover:text-primeColor"
              onClick={() => {
                setActiveSection('notifications');
                setShowAddProductForm(false); // Close add form if another section is clicked
              }}
            >
              Notifications
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 overflow-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          {activeSection === 'products' && (
            <button
              className="px-4 py-2 bg-primeColor text-white rounded-md hover:bg-black duration-300"
              onClick={() => setShowAddProductForm(true)} // Show the Add Product form and hide other content
            >
              Add Product
            </button>
          )}
        </div>

        {/* Add Product Form */}
        {showAddProductForm && activeSection === 'products' && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form encType="multipart/form-data">
              <div className="mb-4">
                <label className="block mb-2" htmlFor="name">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productName}
                  onChange={(e) => { setProductName(e.target.value) }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => { setPrice(e.target.value) }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="stock">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={stock}
                  onChange={(e) => { setStock(e.target.value) }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="image">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={e => { setImage(e.target.files[0]) }}
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                onClick={handleAddProduct()}
                className="px-4 py-2 bg-primeColor text-white rounded-md hover:bg-black duration-300"
              >
                Add Product
              </button>
            </form>
          </div>
        )}

        {/* Display Products */}
        {activeSection === 'products' && (
          <div id="products" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    {editing.section === 'products' && editing.id === product.id ? (
                      <>
                        {/* Editable row */}
                        <td className="border p-2">
                          <input
                            type="text"
                            defaultValue={product.name}
                            onChange={(e) => handleSaveEdit('products', product.id, { name: e.target.value })}
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            defaultValue={product.price}
                            onChange={(e) => handleSaveEdit('products', product.id, { price: e.target.value })}
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            defaultValue={product.stock}
                            onChange={(e) => handleSaveEdit('products', product.id, { stock: e.target.value })}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Non-editable row */}
                        <td className="border p-2">{product.name}</td>
                        <td className="border p-2">{product.price}</td>
                        <td className="border p-2">{product.stock}</td>
                      </>
                    )}
                    <td className="border p-2">
                      {editing.section === 'products' && editing.id === product.id ? (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
                          onClick={() => setEditing({ section: null, id: null })} // Save changes
                        >
                          <BsCheckCircleFill className="inline mr-1" />
                          Save
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                          onClick={() => handleEdit('products', product.id)} // Edit product
                        >
                          <AiOutlineEdit className="inline mr-1" />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Display Users */}
        {activeSection === 'users' && (
          <div id="users" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    {editing.section === 'users' && editing.id === user.id ? (
                      <>
                        {/* Editable row */}
                        <td className="border p-2">
                          <input
                            type="text"
                            defaultValue={user.name}
                            onChange={(e) => handleSaveEdit('users', user.id, { name: e.target.value })}
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            defaultValue={user.email}
                            onChange={(e) => handleSaveEdit('users', user.id, { email: e.target.value })}
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            defaultValue={user.status}
                            onChange={(e) => handleSaveEdit('users', user.id, { status: e.target.value })}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Non-editable row */}
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.status}</td>
                      </>
                    )}
                    <td className="border p-2">
                      {editing.section === 'users' && editing.id === user.id ? (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
                          onClick={() => setEditing({ section: null, id: null })} // Save changes
                        >
                          <BsCheckCircleFill className="inline mr-1" />
                          Save
                        </button>
                      ) : (
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                          onClick={() => handleEdit('users', user.id)} // Edit user
                        >
                          <AiOutlineEdit className="inline mr-1" />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Display Payments */}
        {activeSection === 'payments' && (
          <div id="payments" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Payments</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Mode</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="border p-2">{payment.mode}</td>
                    <td className="border p-2">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Display Orders */}
        {activeSection === 'orders' && (
          <div id="orders" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border p-2">{order.product}</td>
                    <td className="border p-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Display Notifications */}
        {activeSection === 'notifications' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
            <ul>
              {appointments.length === 0 ? (
                <p>No appointments available</p>
              ) : (
                appointments.map((appointment) => (
                  <li key={appointment.id} className="mb-4">
                    <div className="flex justify-between items-center p-4 border rounded-md shadow-md">
                      <div>
                        <h3 className="font-semibold">{appointment.clientName}</h3>
                        {/* {console.log(appointment)} */}
                        <p>Email: {appointment.email}</p>
                        <p>Message: {appointment.messages}</p>
                        <p>Date: {appointment.date}</p>
                        <p>Time: {appointment.time}</p>
                      </div>
                      <div>
                        {appointment.status === 'pending' ? (
                          <>
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-700 mr-2"
                              onClick={() => handleAppointmentAction(appointment._id, 'Accepted')}
                            >
                              Accept
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
                              onClick={() => handleAppointmentAction(appointment._id, 'Denied')}
                            >
                              Deny
                            </button>
                          </>
                        ) : (
                          <span
                            className={`font-bold ${appointment.status === 'Approved' ? 'text-green-500' : 'text-red-500'
                              }`}
                          >
                            {appointment.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
