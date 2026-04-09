import { useState } from "react";
import Layout from "@/components/Layout";
import HomePage from "./HomePage";
import CoursesPage from "./CoursesPage";
import ExamsPage from "./ExamsPage";
import TrainersPage from "./TrainersPage";
import ProfilePage from "./ProfilePage";
import ReportsPage from "./ReportsPage";
import AdminPage from "./AdminPage";
import ContactsPage from "./ContactsPage";

type Page = "home" | "courses" | "exams" | "trainers" | "profile" | "reports" | "admin" | "contacts";

export default function Index() {
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "courses": return <CoursesPage />;
      case "exams": return <ExamsPage />;
      case "trainers": return <TrainersPage />;
      case "profile": return <ProfilePage />;
      case "reports": return <ReportsPage />;
      case "admin": return <AdminPage />;
      case "contacts": return <ContactsPage />;
    }
  };

  return (
    <Layout currentPage={page} setPage={setPage}>
      {renderPage()}
    </Layout>
  );
}
