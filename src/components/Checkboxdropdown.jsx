import { useState } from "react";
import { Form, Dropdown } from "react-bootstrap";
import '../styles/checkboxdropdown.css'

function Checkboxdropdown({ onChange }) {
  const [isUpiChecked, setUpiIsChecked] = useState(false);
  const [isCashChecked, setCashIsChecked] = useState(false);
  const [upiPercentage, setUpiPercentage] = useState("");
  const [cashPercentage, setCashPercentage] = useState("");

  const percentages = ["1%", "2%", "3%", "4%", "5%", "6%", "7%", "8%", "9%", "10%"];

  const handleUpiCheckboxChange = () => {
    const newUpiChecked = !isUpiChecked;
    setUpiIsChecked(newUpiChecked);
    const newUpiPercentage = newUpiChecked && !upiPercentage ? "1%" : upiPercentage;
    if (newUpiChecked && !upiPercentage) {
      setUpiPercentage("1%");
    }
    onChange({
      upi: { enabled: newUpiChecked, percentage: newUpiPercentage },
      cash: { enabled: isCashChecked, percentage: cashPercentage },
    });
  };

  const handleCashCheckboxChange = () => {
    const newCashChecked = !isCashChecked;
    setCashIsChecked(newCashChecked);
    const newCashPercentage = newCashChecked && !cashPercentage ? "1%" : cashPercentage;
    if (newCashChecked && !cashPercentage) {
      setCashPercentage("1%");
    }
    onChange({
      upi: { enabled: isUpiChecked, percentage: upiPercentage },
      cash: { enabled: newCashChecked, percentage: newCashPercentage },
    });
  };

  const handleUpiPercentageChange = (percent) => {
    setUpiPercentage(percent);
    onChange({
      upi: { enabled: isUpiChecked, percentage: percent },
      cash: { enabled: isCashChecked, percentage: cashPercentage },
    });
  };

  const handleCashPercentageChange = (percent) => {
    setCashPercentage(percent);
    onChange({
      upi: { enabled: isUpiChecked, percentage: upiPercentage },
      cash: { enabled: isCashChecked, percentage: percent },
    });
  };

  return (
    <div className="d-flex flex-column align-items-start checkbox-dropdown">
      <div className="d-flex align-items-center mb-2">
        <Form.Check
          type="checkbox"
          label="UPI Exchange"
          checked={isUpiChecked}
          onChange={handleUpiCheckboxChange}
          className="me-2"
        />
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            id="upi-dropdown"
            disabled={!isUpiChecked}
            className="dropdown-toggle"
          >
            {upiPercentage || "Set Charges"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {percentages.map((percent) => (
              <Dropdown.Item
                key={percent}
                onClick={() => handleUpiPercentageChange(percent)}
              >
                {percent}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="d-flex align-items-center">
        <Form.Check
          type="checkbox"
          label="Denomination Exchange"
          checked={isCashChecked}
          onChange={handleCashCheckboxChange}
          className="me-2"
        />
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            id="cash-dropdown"
            disabled={!isCashChecked}
            className="dropdown-toggle"
          >
            {cashPercentage || "Set Charges"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {percentages.map((percent) => (
              <Dropdown.Item
                key={percent}
                onClick={() => handleCashPercentageChange(percent)}
              >
                {percent}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Checkboxdropdown;