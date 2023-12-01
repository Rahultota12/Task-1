import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import './Dashbord.css';
import React, { useState, useEffect } from 'react';

const API = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

const Dashbord = () => {
  const [tableData, setTableData] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchUser = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.length > 0) {
        setTableData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser(API);
  }, []);

  const handleDelete = (id) => {
    setTableData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleUpdate = (id) => {
   
    const selectedItem = tableData.find((item) => item.id == id);
    setSelectedItem(selectedItem);
  };

  const handleSaveUpdate = () => {
   
    console.log(`Update item with name ${selectedItem.id}`);
  
    setSelectedItem(null);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    
    const filteredData = tableData.filter(
      (item) => item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.id.toString().includes(value)
    );

    setTableData(filteredData);
  };

  return (
    <div className="container">
      <p className="input-box">
        <input
          type="text"
          placeholder="Enter value...."
          value={filterValue}
          onChange={handleFilter}
        />
        <h1 className="delete-icon">
          <MdDeleteOutline />
        </h1>
      </p>

      <table className="table table-responsive">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>
                <button onClick={() => handleUpdate(item.id)}><FaEdit /></button>
                <button onClick={() => handleDelete(item.id)}><MdDeleteOutline style={{ color: "red" }} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
      {selectedItem && (
        <div>
          <h2>Edit Details</h2>
          <form>
            <label>Name: </label>
            <input type="text" value={selectedItem.id} />
           
            <button type="button" onClick={handleSaveUpdate}>Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashbord;
