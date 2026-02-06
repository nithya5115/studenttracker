
import React, { useState, useMemo } from 'react';
import { Student } from '../types';

export const GradeTracker: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isNaN(Number(grade))) return;
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      grade: Number(grade)
    };
    setStudents([...students, newStudent]);
    setName('');
    setGrade('');
  };

  const removeStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const stats = useMemo(() => {
    if (students.length === 0) return { avg: 0, high: 0, low: 0 };
    const grades = students.map(s => s.grade);
    const sum = grades.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / students.length).toFixed(2),
      high: Math.max(...grades),
      low: Math.min(...grades)
    };
  }, [students]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Student Grade Tracker</h2>
        <form onSubmit={addStudent} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Student Name"
            className="flex-grow border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Grade (0-100)"
            className="w-full md:w-32 border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Add Student
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
          <p className="text-sm text-indigo-600 font-medium">Average Score</p>
          <p className="text-3xl font-bold text-indigo-900">{stats.avg}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
          <p className="text-sm text-emerald-600 font-medium">Highest Score</p>
          <p className="text-3xl font-bold text-emerald-900">{stats.high}</p>
        </div>
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-center">
          <p className="text-sm text-rose-600 font-medium">Lowest Score</p>
          <p className="text-3xl font-bold text-rose-900">{stats.low}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(student => (
              <tr key={student.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium">{student.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${student.grade >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {student.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="text-rose-500 hover:text-rose-700 font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">No students added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
