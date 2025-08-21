import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import { addDesignation, updateDesignation, deleteDesignation } from "../api";

export default function DesignationListModal({
  show,
  handleClose,
  designations,
  departments,
  reloadDesignations,
}) {
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: "", departmentId: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if(show){
      setEdit(null);
      setForm({ name: "", departmentId: "", description: "" });
      setError("");
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.departmentId) {
      setError("All fields are required");
      return;
    }

    const apiCall = edit ? updateDesignation(edit._id, form) : addDesignation(form);

    apiCall
      .then(() => {
        reloadDesignations();
        setEdit(null);
        setForm({ name: "", departmentId: "", description: "" });
      })
      .catch((err) => setError(err.response?.data?.message || "Error"));
  };

  const handleEdit = (des) => {
    setEdit(des);
    setForm({ name: des.name, departmentId: des.departmentId?._id || "", description: des.description });
    setError("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this designation?")) {
      deleteDesignation(id)
        .then(() => reloadDesignations())
        .catch(() => alert("Failed to delete designation"));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Designations</Modal.Title>
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
            <Form.Label>Department</Form.Label>
            <Form.Control
              as="select"
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              required
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Form.Control>
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
                  setForm({ name: "", departmentId: "", description: "" });
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
              <th>Department</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {designations.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.departmentId?.name || "-"}</td>
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
