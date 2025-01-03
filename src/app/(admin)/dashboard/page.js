import { SidebarMenu } from '@/app/components/SideBar';
import NavbarComponent from '@/app/components/NavBar';
const menus = [
  {
    label: "Discover",
    name: "Home",
    href: "/home"
  },
  {
    label: "Discover",
    name: "Interviews",
    href: "/Interviews"
  },
  {
    label: "Discover",
    name: "Candidates",
    href: "/Candidates"
  },  
  {
    label: "Discover",
    name: "company",
    href: "/company"
  },
  
  
  // other menu items
];

const AdminDashboard = () => {
  return (
    <>
      <div>
        <NavbarComponent menus={menus} />
        <div className="flex">
          <div className="hidden sm:block">
            <SidebarMenu menus={menus} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
