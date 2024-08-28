import "../style/style.css";
import MoonLoader from "react-spinners/MoonLoader";

function LoadingBox() {
  return (
    <div id="load-err">
      <div style={{ padding: "10px 0px", paddingBottom: "30px" }}>
        <MoonLoader size={45} color="var(--color-primary)" />
      </div>
    </div>
  );
}

export default LoadingBox;
