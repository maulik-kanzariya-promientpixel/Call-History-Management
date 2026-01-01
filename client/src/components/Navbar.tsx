import DownloadCSV from "./DownloadCSV";
import { DateRangePicker } from "./DateRangePicker";
import Searchbar from "./Searchbar";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between gap-4 p-6 bg-background border-b border-border">
      <DateRangePicker />
      <div className="flex items-center gap-2">
        <Searchbar />
        <DownloadCSV />
      </div>
    </div>
  );
};

export default Navbar;
