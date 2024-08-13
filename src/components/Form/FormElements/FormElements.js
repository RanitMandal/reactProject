import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { getYear } from "date-fns";
import 'react-datepicker/dist/react-datepicker.css';

function FormElements() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [financialYear, setFinancialYear] = useState("");
  const [isInvalidRange, setIsInvalidRange] = useState(false); // New state variable

  useEffect(() => {
    if (startDate && endDate && startDate <= endDate) {
      const startYear = getYear(startDate);
      const endYear = getYear(endDate);
      setFinancialYear(`${startYear} - ${endYear}`);
      setIsInvalidRange(false); // Resetting isInvalidRange to false when the range is valid
    } else {
      setFinancialYear("");
      setIsInvalidRange(endDate < startDate || endDate && !startDate); // Updating isInvalidRange to true when the range is invalid
    }
  }, [startDate, endDate]);

  return (
    <div>
      <div className="row py-9">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Financial Year Entry</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div>
                      <div className="row mb-4">
                        <label className="col-md-2 form-label">Financial Year</label>
                        <div className="col-md-9">
                          <input
                            readOnly
                            className="form-control border border-primary"
                            type="text"
                            placeholder="Financial Year"
                            value={financialYear}
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <label className="col-md-2 form-label">
                          Start Date <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                          <DatePicker
                            className="form-control fc-datepicker"
                            placeholder="MM/DD/YYYY"
                            selected={startDate}
                            onChange={setStartDate}
                            numberOfMonths={1}
                            required
                          />
                          <span className="input-group-text fa fa-calendar tx-16 lh-0 op-6" />
                        </div>
                      </div>
                      {isInvalidRange && endDate && !startDate && ( // Displaying an error message if the range is invalid
                        <div className="row">
                          <div className="col-md-2"></div>
                          <div className="col-md-9 text-red">
                            First update the Start Date!!
                          </div>
                        </div>
                      )}
                      <div className="row mb-4">
                        <label className="col-md-2 form-label">
                          End Date <span className="text-red">*</span>
                        </label>
                        <div className="col-md-9 input-group">
                          <DatePicker
                            className="form-control fc-datepicker"
                            placeholder="MM/DD/YYYY"
                            selected={endDate}
                            onChange={setEndDate}
                            numberOfMonths={1}
                            required
                          />
                          <span className="input-group-text fa fa-calendar tx-16 lh-0 op-6" />
                        </div>
                      </div>
                      {isInvalidRange && endDate < startDate && ( // Displaying an error message if the range is invalid
                        <div className="row">
                          <div className="col-md-2"></div>
                          <div className="col-md-9 text-red">
                            End Date cannot be less than Start Date
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input className="btn btn-primary" type="submit" defaultValue="Submit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormElements;
