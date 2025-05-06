import { useState } from "react";
import { Form, Dropdown} from "react-bootstrap";

function Checkboxdropdown() {
  const [isUpiChecked, setUpiIsChecked] = useState(false);
  const [isCashChecked, setCashIsChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Charges");

  const handleUpiCheckboxChange = () => {
    setUpiIsChecked(!isUpiChecked);
  };

  const handleCashCheckboxChange = () => {
    setCashIsChecked(!isCashChecked);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="d-flex flex-column align-items-start">
      <div className="d-flex">
        <Form.Check
          type="checkbox"
          label="Upi Exchange"
          checked={isUpiChecked}
          onChange={handleUpiCheckboxChange}
        />
        <Dropdown className="mt-2">
          <Dropdown.Toggle
            variant="primary"
            id="dropdown-basic"
            disabled={!isUpiChecked}
          >
            {selectedOption}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect("Option 1")}>
              1%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 2")}>
              2%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              3%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 1")}>
              4%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 2")}>
              5%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              6%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 1")}>
              7%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 2")}>
              8%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              9%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              10%
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="d-flex">
        <Form.Check
          type="checkbox"
          label="Cash Change"
          checked={isCashChecked}
          onChange={handleCashCheckboxChange}
        />
        <Dropdown className="mt-2">
          <Dropdown.Toggle
            variant="primary"
            id="dropdown-basic"
            disabled={!isCashChecked}
          >
            {selectedOption}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect("Option 1")}>
              1%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 2")}>
              2%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              3%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 1")}>
              4%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 2")}>
              5%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              6%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 1")}>
              7%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 2")}>
              8%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              9%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect("Option 3")}>
              10%
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Checkboxdropdown;
