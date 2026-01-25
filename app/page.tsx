"use client"; // บอกว่าเป็น client component

import { useState } from "react"; 

export default function Home() {

  const [ searchTerm, setSearchTerm ] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">X Pokemon Search</h1>

      {/* Search Box */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="ค้นห้า Pokemon..."
          value= {searchTerm} // ผูก Input กับ State
          onChange={(e) => setSearchTerm(e.target.value)} // update state
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
        />
      </div>

      {/* แสดงคำค้นหาที่พิมพ์ */}
      <div>
        <p className="text-center mt-4">
          กำลังค้นหา: {searchTerm|| "..."}
        </p>
      </div>
    </div>
  );
}