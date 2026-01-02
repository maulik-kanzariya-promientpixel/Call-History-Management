import DownloadCSV from "../CSV/DownloadCSV";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import Searchbar from "../Searchbar/Searchbar";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <DateRangePicker />
        </div>
        
        <div className="flex items-center gap-3">
          <Searchbar />
          <DownloadCSV />
        </div>
      </div>
    </header>
  );
};

export default Navbar;