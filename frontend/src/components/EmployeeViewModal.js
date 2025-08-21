import React from "react";
import { Modal, Button, Table, Image } from "react-bootstrap";

export default function EmployeeViewModal({ show, handleClose, employee }) {
  if (!employee) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Employee Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <Image
            src={`http://localhost:5001/uploads/${employee.image}` || `https://employee-management-v0ae.onrender.com/uploads/${employee.image}`}
            roundedCircle
            width={120}
            height={120}
            alt="Employee"
          />
        </div>
        <Table bordered>
          <tbody>
            <tr>
              <th>Name</th>
              <td>{employee.name}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{employee.gender}</td>
            </tr>
            <tr>
              <th>Date of Birth</th>
              <td>{new Date(employee.dob).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{employee.address}</td>
            </tr>
            <tr>
              <th>Mobile</th>
              <td>{employee.mobile}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{employee.email}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{employee.departmentId?.name || "-"}</td>
            </tr>
            <tr>
              <th>Designation</th>
              <td>{employee.designationId?.name || "-"}</td>
            </tr>
            <tr>
              <th>Date of Joining</th>
              <td>{new Date(employee.doj).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
