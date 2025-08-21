import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import { fetchDepartments, fetchDesignations, addEmployee, updateEmployee } from "../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const genderOptions = ["Male", "Female", "Other"];

export default function EmployeeFormModal({ show, handleClose, editEmployee, onAdd, onUpdate }) {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    address: "",
    mobile: "",
    email: "",
    departmentId: "",
    designationId: "",
    doj: "",
    image: null,
  });
  const [imgPrev, setImgPrev] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments().then((res) => setDepartments(res.data));
    if (editEmployee) {
      setForm({
        ...editEmployee,
        dob: editEmployee.dob ? new Date(editEmployee.dob) : "",
        doj: editEmployee.doj ? new Date(editEmployee.doj) : "",
        departmentId: editEmployee.departmentId?._id || "",
        designationId: editEmployee.designationId?._id || "",
        image: null,
      });
      setImgPrev(`http://localhost:5001/uploads/${editEmployee.image}`);
    } else {
      setForm({
        name: "",
        gender: "",
        dob: "",
        address: "",
        mobile: "",
        email: "",
        departmentId: "",
        designationId: "",
        doj: "",
        image: null,
      });
      setImgPrev(null);
    }
  }, [editEmployee, show]);

  useEffect(() => {
    if (form.departmentId) {
      fetchDesignations(form.departmentId).then((res) => setDesignations(res.data));
    } else setDesignations([]);
    setForm((f) => ({ ...f, designationId: "" }));
  }, [form.departmentId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onDateChange = (date, field) => setForm({ ...form, [field]: date });

  const onImgChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file instanceof Blob) {
      setImgPrev(URL.createObjectURL(file));
      setForm({ ...form, image: file });
    } else {
      setImgPrev(null);
      setForm({ ...form, image: null });
    }
  };

  const validate = () => {
    if (
      !form.name ||
      !form.gender ||
      !form.dob ||
      !form.address ||
      !form.mobile ||
      !form.email ||
      !form.departmentId ||
      !form.designationId ||
      !form.doj ||
      (!editEmployee && !form.image)
    ) {
      setError("All fields are required.");
      return false;
    }
    if (!/^\d{10}$/.test(form.mobile)) {
      setError("Invalid mobile.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Invalid email.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v && (k !== "image" || v instanceof File))
        fd.append(k, v instanceof Date ? v.toISOString().split("T")[0] : v);
    });
    if (editEmployee) {
      updateEmployee(editEmployee._id, fd)
        .then((res) => {
          onUpdate(res.data);
          handleClose();
        })
        .catch((err) => setError(err.response?.data?.message || "Error updating"));
    } else {
      addEmployee(fd)
        .then((res) => {
          onAdd(res.data);
          handleClose();
        })
        .catch((err) => setError(err.response?.data?.message || "Error adding"));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editEmployee ? "Edit Employee" : "Add Employee"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {/* Form groups for fields */}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={form.name} onChange={onChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Control as="select" name="gender" value={form.gender} onChange={onChange} required>
              <option value="">Select</option>
              {genderOptions.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <DatePicker
              selected={form.dob}
              onChange={(d) => onDateChange(d, "dob")}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control as="textarea" name="address" value={form.address} onChange={onChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Mobile</Form.Label>
            <Form.Control name="mobile" value={form.mobile} onChange={onChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={form.email} onChange={onChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Department</Form.Label>
            <Form.Control as="select" name="departmentId" value={form.departmentId} onChange={onChange} required>
              <option value="">Select</option>
              {departments.map((d) => (
                <option value={d._id} key={d._id}>
                  {d.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Designation</Form.Label>
            <Form.Control as="select" name="designationId" value={form.designationId} onChange={onChange} required>
              <option value="">Select</option>
              {designations.map((des) => (
                <option value={des._id} key={des._id}>
                  {des.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Date of Join</Form.Label>
            <DatePicker
              selected={form.doj}
              onChange={(d) => onDateChange(d, "doj")}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={onImgChange} accept="image/*" />
            {imgPrev && <Image src={imgPrev} rounded width={80} className="mt-2" />}
          </Form.Group>
          <Row className="mt-3">
            <Col>
              <Button type="submit" variant="success">
                {editEmployee ? "Update" : "Create"}
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
