import "../style/style.css";
import PropTypes from "prop-types";

interface MessageBoxProps {
  variant?: string;
  children: React.ReactNode;
}

function MessageBox({ variant = "info", children }: MessageBoxProps) {
  return (
    <div id="load-err">
      <div className={`alert alert-${variant}`}>{children}</div>
    </div>
  );
}

MessageBox.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
};

export default MessageBox;
