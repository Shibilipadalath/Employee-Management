import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import EmployeeList from "./components/EmployeeList";
import EmployeeFormModal from "./components/EmployeeFormModal";
import DepartmentListModal from "./components/DepartmentListModal";
import DesignationListModal from "./components/DesignationListModal";
import EmployeeViewModal from "./components/EmployeeViewModal";
import {
  fetchEmployees,
  deleteEmployee,
  fetchDepartments,
  fetchDesignations,
} from "./api";

function App() {
  // Employee state & handlers
  const [employees, setEmployees] = useState([]);
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  // Department state & handlers
  const [departments, setDepartments] = useState([]);
  const [showDeptModal, setShowDeptModal] = useState(false);

  // Designation state & handlers
  const [designations, setDesignations] = useState([]);
  const [showDesigModal, setShowDesigModal] = useState(false);

  // Employee view modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  // Loading all data first
  useEffect(() => {
    loadEmployees();
    loadDepartments();
    loadDesignations();
  }, []);

  // Load employees
  const loadEmployees = () => {
    fetchEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => setEmployees([]));
  };

  const loadDepartments = () => {
    fetchDepartments()
      .then((res) => setDepartments(res.data))
      .catch(() => setDepartments([]));
  };

  const loadDesignations = () => {
    fetchDesignations()
      .then((res) => setDesignations(res.data))
      .catch(() => setDesignations([]));
  };

  // Hydrate employee data with full department and designation while adding and updating
  const hydrateEmployee = (employee) => {
    const fullDept = departments.find((d) => d._id === employee.departmentId) || null;
    const fullDesig = designations.find((d) => d._id === employee.designationId) || null;
    return { ...employee, departmentId: fullDept, designationId: fullDesig };
  };

  const handleAddEmployee = (newEmployee) => {
    const hydrated = hydrateEmployee(newEmployee);
    setEmployees((prev) => [hydrated, ...prev]);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    const hydrated = hydrateEmployee(updatedEmployee);
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === hydrated._id ? hydrated : emp))
    );
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id)
        .then(() => {
          setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        })
        .catch(() => alert("Failed to delete employee"));
    }
  };

  // Handlers for employee view/edit modal
  const handleView = (employee) => {
    setViewEmployee(employee);
    setShowViewModal(true);
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setShowEmpModal(true);
  };

  return (
    <Container fluid>
      <h2 className="mt-3 mb-4 text-center">Employee Management</h2>
      <Row>
        <Col md={8}>
          <div className="d-flex mb-3">
            <Button
              variant="primary"
              onClick={() => {
                setEditEmployee(null);
                setShowEmpModal(true);
              }}
            >
              + New Employee
            </Button>
          </div>

          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDeleteEmployee}
          />
        </Col>
        <Col md={4} className="d-flex flex-column align-items-end">
          <Button
            variant="outline-secondary"
            className="mb-3"
            onClick={() => setShowDeptModal(true)}
          >
            Departments
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowDesigModal(true)}>
            Designations
          </Button>
        </Col>
      </Row>

      <EmployeeFormModal
        show={showEmpModal}
        handleClose={() => setShowEmpModal(false)}
        editEmployee={editEmployee}
        onAdd={handleAddEmployee}
        onUpdate={handleUpdateEmployee}
      />

      <DepartmentListModal
        show={showDeptModal}
        handleClose={() => setShowDeptModal(false)}
        departments={departments}
        reloadDepartments={loadDepartments}
      />

      <DesignationListModal
        show={showDesigModal}
        handleClose={() => setShowDesigModal(false)}
        designations={designations}
        departments={departments}
        reloadDesignations={loadDesignations}
      />

      <EmployeeViewModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        employee={viewEmployee}
      />
    </Container>
  );
}

export default App;
