// @ts-nocheck
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AssessmentMini from "@/features/assess/AssessmentMini";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/assess/mini" element={<AssessmentMini />} />
      {/* other routes... */}
    </Routes>
  );
}
