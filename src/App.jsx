import ViewMap from "./components/ViewMap";

function App() {
  return (
    <div style={{}}>
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        {/* Title */}
        <h1>Toronto Major Crimes in 2014</h1>
      </div>

      {/* Map */}
      <ViewMap />
    </div>
  );
}

export default App;
