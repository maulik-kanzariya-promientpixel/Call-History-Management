import { useLocation } from "react-router-dom";
import DownloadCSV from "../CSV/DownloadCSV";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import Searchbar from "../Searchbar/Searchbar";
import LogoutButton from "../auth/Logout";

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const isMyHistory = location.pathname === "/my-history";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between w-full gap-4 px-6">
        <div className="flex items-center gap-4 w-full justify-between">
          <DateRangePicker />
          {isDashboard && <LogoutButton />}
        </div>

        {/* Only show Searchbar & DownloadCSV if NOT dashboard and NOT /my-history */}
        {!isDashboard && !isMyHistory && (
          <div className="flex items-center gap-3">
            <Searchbar />
            <DownloadCSV />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
