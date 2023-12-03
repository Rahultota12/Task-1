import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import "./Dashbord.css";

const API =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

const Dashbord = () => {
  const [tableData, setTableData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
  };

  useEffect(() => {
    fetchUser(API);
  }, []);

  const handleDelete = (id) => {
    setTableData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleUpdate = (id) => {
    const selectedItem = tableData.find((item) => item.id === id);
    setSelectedItem(selectedItem);
    setEditableRow(id);
  };

  const handleSaveUpdate = () => {
    // Update the item in the tableData array
    setTableData((prevData) => {
      return prevData.map((item) => {
        if (item.id === selectedItem.id) {
          return selectedItem;
        }
        return item;
      });
    });

    setSelectedItem(null);
    setEditableRow(null);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    const filteredData = tableData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.id.toString().includes(value)
    );
    setTableData(filteredData);
  };

  const handleDelet = () => {
    // Clear the table data array
    setTableData([]);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <button onClick={() => handleDelet()}>
            <MdDeleteOutline />
          </button>
        </h1>
      </p>

      <table className="table table-responsive">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                {editableRow === item.id ? (
                  <input
                    type="text"
                    value={selectedItem.name}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, name: e.target.value })
                    }
                  />
                ) : (
                  item.name
                )}
              </td>
              <td>
                {editableRow === item.id ? (
                  <input
                    type="text"
                    value={selectedItem.email}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, email: e.target.value })
                    }
                  />
                ) : (
                  item.email
                )}
              </td>
              <td>
                {editableRow === item.id ? (
                  <input
                    type="text"
                    value={selectedItem.role}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, role: e.target.value })
                    }
                  />
                ) : (
                  item.role
                )}
              </td>
              <td>
                {editableRow === item.id ? (
                  <>
                    <button onClick={() => handleSaveUpdate()}>Save</button>
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                        setEditableRow(null);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleUpdate(item.id)}>
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ color: "red" }}
                    >
                      <MdDeleteOutline />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination className="pagi">
        {[...Array(Math.ceil(tableData.length / itemsPerPage))].map(
          (item, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
    </div>
  );
};

export default Dashbord;
