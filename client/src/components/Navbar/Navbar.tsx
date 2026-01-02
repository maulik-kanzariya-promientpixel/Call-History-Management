import DownloadCSV from "../CSV/DownloadCSV";
import { DateRangePicker } from "../DateRangePicker/DateRangePicker";
import Searchbar from "../Searchbar/Searchbar";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-background">
      <DateRangePicker />

      <div className="flex items-center gap-2">
        <Searchbar />
        <DownloadCSV />
      </div>
    </div>
  );
};

export default Navbar;