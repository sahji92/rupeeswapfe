import { useState } from "react";
import { Form, Dropdown} from "react-bootstrap";

function Checkboxdropdown() {
  const [isUpiChecked, setUpiIsChecked] = useState(false);
  const [isCashChecked, setCashIsChecked] = useState(false);
  const [upiSelectedOption, setUpiSelectedOption] = useState("upiCharges");
  const [cashSelectedOption, setCashSelectedOption] = useState("cashCharges");

  const handleUpiCheckboxChange = () => {
    setUpiIsChecked(!isUpiChecked);
  };

  const handleCashCheckboxChange = () => {
    setCashIsChecked(!isCashChecked);
  };

  const handleUpiSelect = (option) => {
    setUpiSelectedOption(option);
  };
  const handleCashSelect = (option) => {
    setCashSelectedOption(option);
  };
  return (
    <div className="d-flex flex-column align-items-start">
      <div className="d-flex align-items-center justify-content-center">
        <Form.Check
          type="checkbox"
          label="Upi Exchange"
          checked={isUpiChecked}
          onChange={handleUpiCheckboxChange}
        />
        <Dropdown className="m-1">
          <Dropdown.Toggle
            variant="outline-danger"
            id="dropdown-basic"
            disabled={!isUpiChecked}
          >
            {upiSelectedOption}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 1")}>
              1%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 2")}>
              2%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 3")}>
              3%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 1")}>
              4%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 2")}>
              5%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 3")}>
              6%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 1")}>
              7%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 2")}>
              8%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 3")}>
              9%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpiSelect("Option 3")}>
              10%
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <Form.Check
          type="checkbox"
          label="Cash Change"
          checked={isCashChecked}
          onChange={handleCashCheckboxChange}
        />
        <Dropdown className="">
          <Dropdown.Toggle
            variant="outline-danger"
            id="dropdown-basic"
            disabled={!isCashChecked}
          >
            {cashSelectedOption}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleCashSelect("Option 1")}>
              1%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 2")}>
              2%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 3")}>
              3%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 1")}>
              4%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 2")}>
              5%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 3")}>
              6%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 1")}>
              7%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 2")}>
              8%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 3")}>
              9%
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleCashSelect("Option 3")}>
              10%
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Checkboxdropdown;
