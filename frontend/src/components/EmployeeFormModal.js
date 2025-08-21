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
    dob: null,
    address: "",
    mobile: "",
    email: "",
    departmentId: "",
    designationId: "",
    doj: null,
    image: null,
  });
  const [imgPrev, setImgPrev] = useState(null);
  const [errors, setErrors] = useState({});

  const today = new Date();

  useEffect(() => {
    fetchDepartments().then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => {
    if (form.departmentId) {
      fetchDesignations(form.departmentId).then((res) => setDesignations(res.data));
    } else {
      setDesignations([]);
      setForm((f) => ({ ...f, designationId: "" }));
    }
  }, [form.departmentId]);

  useEffect(() => {
    if (editEmployee) {
      setForm({
        name: editEmployee.name || "",
        gender: editEmployee.gender || "",
        dob: editEmployee.dob ? new Date(editEmployee.dob) : null,
        address: editEmployee.address || "",
        mobile: editEmployee.mobile || "",
        email: editEmployee.email || "",
        departmentId: editEmployee.departmentId?._id || "",
        designationId: editEmployee.designationId?._id || "",
        doj: editEmployee.doj ? new Date(editEmployee.doj) : null,
        image: null,
      });
      setImgPrev(`http://localhost:5001/uploads/${editEmployee.image}`);
      setErrors({});
    } else if (show) {
      setForm({
        name: "",
        gender: "",
        dob: null,
        address: "",
        mobile: "",
        email: "",
        departmentId: "",
        designationId: "",
        doj: null,
        image: null,
      });
      setImgPrev(null);
      setErrors({});
    }
  }, [editEmployee, show]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const onDateChange = (date, field) => {
    setForm((f) => ({ ...f, [field]: date }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const onImgChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && file instanceof Blob) {
      setImgPrev(URL.createObjectURL(file));
      setForm((f) => ({ ...f, image: file }));
      if (errors.image) setErrors((e) => ({ ...e, image: "" }));
    } else {
      setImgPrev(null);
      setForm((f) => ({ ...f, image: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dob) newErrors.dob = "Date of Birth is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile)) newErrors.mobile = "Mobile number must be 10 digits";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Email format is invalid";
    if (!form.departmentId) newErrors.departmentId = "Department is required";
    if (!form.designationId) newErrors.designationId = "Designation is required";
    if (!form.doj) newErrors.doj = "Date of Join is required";

    if (!editEmployee && !form.image) newErrors.image = "Employee image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null && val !== "") {
        if (val instanceof Date) fd.append(key, val.toISOString().split("T")[0]);
        else fd.append(key, val);
      }
    });

    if (editEmployee) {
      updateEmployee(editEmployee._id, fd)
        .then((res) => {
          onUpdate(res.data);
          handleClose();
        })
        .catch((err) =>
          setErrors({ form: err.response?.data?.message || "Failed to update employee" })
        );
    } else {
      addEmployee(fd)
        .then((res) => {
          onAdd(res.data);
          handleClose();
        })
        .catch((err) =>
          setErrors({ form: err.response?.data?.message || "Failed to add employee" })
        );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editEmployee ? "Edit Employee" : "Add Employee"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} noValidate>
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={onChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={form.gender}
              onChange={onChange}
              isInvalid={!!errors.gender}
            >
              <option value="">Select</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <DatePicker
              selected={form.dob}
              onChange={(date) => onDateChange(date, "dob")}
              dateFormat="yyyy-MM-dd"
              maxDate={today}
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              placeholderText="YYYY-MM-DD"
            />
            {errors.dob && <div className="invalid-feedback d-block">{errors.dob}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={form.address}
              onChange={onChange}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mobile</Form.Label>
            <Form.Control
              name="mobile"
              value={form.mobile}
              onChange={onChange}
              isInvalid={!!errors.mobile}
            />
            <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select
              name="departmentId"
              value={form.departmentId}
              onChange={onChange}
              isInvalid={!!errors.departmentId}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.departmentId}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designation</Form.Label>
            <Form.Select
              name="designationId"
              value={form.designationId}
              onChange={onChange}
              isInvalid={!!errors.designationId}
            >
              <option value="">Select Designation</option>
              {designations.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.designationId}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Join</Form.Label>
            <DatePicker
              selected={form.doj}
              onChange={(date) => onDateChange(date, "doj")}
              dateFormat="yyyy-MM-dd"
              maxDate={today}
              className={`form-control ${errors.doj ? "is-invalid" : ""}`}
              placeholderText="YYYY-MM-DD"
            />
            {errors.doj && <div className="invalid-feedback d-block">{errors.doj}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={onImgChange}
              accept="image/*"
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
            {imgPrev && <Image src={imgPrev} rounded width={80} className="mt-2" />}
          </Form.Group>

          <Row className="mt-3">
            <Col>
              <Button variant="success" type="submit">
                {editEmployee ? "Update" : "Add"}
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

