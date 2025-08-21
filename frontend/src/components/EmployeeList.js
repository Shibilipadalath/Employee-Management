import React from "react";
import { Table, Button, Image } from "react-bootstrap";

export default function EmployeeList({ employees, onEdit, onView, onDelete }) {
  return (
    <Table bordered responsive>
      <thead>
        <tr>
          <th>Photo</th>
          <th>Name</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp._id}>
            <td>
              <Image
                src={`http://localhost:5001/uploads/${emp.image}`}
                width={50}
                height={50}
                roundedCircle
              />
            </td>
            <td>{emp.name}</td>
            <td>{emp.departmentId?.name || "-"}</td>
            <td>{emp.designationId?.name || "-"}</td>
            <td>
              <Button size="sm" variant="secondary" onClick={() => onView(emp)}>
                View
              </Button>{" "}
              <Button size="sm" variant="warning" onClick={() => onEdit(emp)}>
                Edit
              </Button>{" "}
              <Button size="sm" variant="danger" onClick={() => onDelete(emp._id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
