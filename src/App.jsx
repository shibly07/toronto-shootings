import { useState } from "react";
import ViewMap from "./components/ViewMap";

const years = [
  { year: 2004 },
  { year: 2005 },
  { year: 2006 },
  { year: 2007 },
  { year: 2008 },
  { year: 2009 },
  { year: 2010 },
  { year: 2011 },
  { year: 2012 },
];

function App() {
  const [selectedYear, setSelectedYear] = useState(years[0].year);

  return (
    <div>
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        {/* Title */}
        <h1>Toronto Shootings</h1>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            right: 0,
            margin: 20,
            padding: 20,
            backgroundColor: "white",
            gap: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label htmlFor="year">Select a year:</label>
          <select name="year" id="year" style={{ padding: 5 }}>
            {years.map((item) => (
              <option
                key={item.year}
                value={item.year}
                onClick={() => setSelectedYear(item.year)}
              >
                {item.year}
              </option>
            ))}
          </select>
        </div>

        {/* Map */}
        <ViewMap selectedYear={selectedYear} />
      </div>
    </div>
  );
}

export default App;
