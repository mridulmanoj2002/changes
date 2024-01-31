import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAdminForm = ({ adminId }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  adminId = id;
  console.log(adminId);
  const [adminData, setAdminData] = useState({
    roles: "",
  });

  useEffect(() => {
    // Fetch admin details by ID
    axios.get(`http://localhost:3000/auth/admin/${adminId}`).then((result) => {
      if (result.data.Status) {
        setAdminData(result.data.Result[0]);
      } else {
        alert(result.data.Error);
      }
    });
  }, [adminId]);

  const handleInputChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_admins/${adminId}`, adminData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Admin</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Role
            </label>
            <select
              className="form-select rounded-0"
              id="inputRoles"
              value={adminData.roles}
              onChange={handleInputChange}
              name="roles"
            >
              <option value="superadmin">Super Admin</option>
              <option value="admin1">Admin 1</option>
              <option value="admin2">Admin 2</option>
            </select>
          </div>
          {/* Add other form fields as needed */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Update Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminForm;
