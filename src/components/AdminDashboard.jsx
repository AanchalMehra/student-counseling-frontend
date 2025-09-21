import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://https://student-counseling-backend.onrender.com/api/admin/students')
      .then(res => setStudents(res.data))
      .catch(err => console.log('Error fetching students'));
  }, []);

  // Calculate total 10+2 marks and sort
  const sortedStudents = [...students].sort((a,b) => {
    const totalA = (parseInt(a.marks12?.physics||0) + parseInt(a.marks12?.chemistry||0) + parseInt(a.marks12?.math12||0));
    const totalB = (parseInt(b.marks12?.physics||0) + parseInt(b.marks12?.chemistry||0) + parseInt(b.marks12?.math12||0));
    return totalB - totalA;
  });

  const handleAllocateBranch = (student, branch) => {
    axios.post(`http://localhost:5000/api/admin/allocate`, { studentId: student._id, branch })
      .then(res => {
        alert(`Branch ${branch} allocated to ${student.name}`);
        setStudents(students.map(s => s._id === student._id ? {...s, allocatedBranch: branch} : s));
      })
      .catch(err => alert('Error allocating branch'));
  }

  return (
    <div className="form-container">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Total 10+2</th><th>Branch Choice 1</th><th>Branch Choice 2</th><th>Allocate Branch</th></tr>
        </thead>
        <tbody>
          {sortedStudents.map((s,i)=>(
            <tr key={i}>
              <td>{s.name}</td>
              <td>{(parseInt(s.marks12?.physics||0) + parseInt(s.marks12?.chemistry||0) + parseInt(s.marks12?.math12||0))}</td>
              <td>{s.branchChoices?.branch1}</td>
              <td>{s.branchChoices?.branch2}</td>
              <td>
                <button onClick={()=>handleAllocateBranch(s, s.branchChoices.branch1)}>Allocate 1</button>
                <button onClick={()=>handleAllocateBranch(s, s.branchChoices.branch2)}>Allocate 2</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
