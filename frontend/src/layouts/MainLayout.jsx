import Navbar from "../components/Navbar"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen text-white" style={{ background: "#05050F" }}>
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  )
}
