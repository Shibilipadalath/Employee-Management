import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { addDepartment, updateDepartment, deleteDepartment } from "../api";

export default function DepartmentListModal({ show, handleClose, departments, reloadDepartments }) {
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if(show){
      setEdit(null);
      setForm({ name: "", description: "" });
      setError("");
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Department name required");
      return;
    }

    const apiCall = edit ? updateDepartment(edit._id, form) : addDepartment(form);

    apiCall
      .then(() => {
        reloadDepartments();
        setEdit(null);
        setForm({ name: "", description: "" });
      })
      .catch((err) => setError(err.response?.data?.message || "Error"));
  };

  const handleEdit = (dept) => {
    setEdit(dept);
    setForm({ name: dept.name, description: dept.description });
    setError("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this department?")) {
      deleteDepartment(id)
        .then(() => reloadDepartments())
        .catch(() => alert("Failed to delete department"));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Departments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Form.Group>
          <div className="mt-3">
            <Button type="submit" variant="primary">
              {edit ? "Update" : "Add"}
            </Button>
            {edit && (
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => {
                  setEdit(null);
                  setForm({ name: "", description: "" });
                  setError("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>
        <hr />
        <Table bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.description}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => handleEdit(d)}>
                    Edit
                  </Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(d._id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
