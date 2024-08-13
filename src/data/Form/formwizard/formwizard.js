import React, { useState, useEffect } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Box from "@mui/material/Box";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Form, } from "react-bootstrap";
import validator from "validator";
import StepZilla from "react-stepzilla";
import * as formelement from "../../../data/Form/formelement/formelement";
import { Tree } from 'antd';
import { Modal, ModalTitle } from "react-bootstrap";
const { DirectoryTree } = Tree;

//WizardForm
function Name({ nextStep, handleFormData, values }) {
  const [error, setError] = useState(false);
  const submitFormData = (e) => {
    e.preventDefault();
    if (
      validator.isEmpty(values.firstName) ||
      validator.isEmpty(values.lastName)
    ) {
      setError(true);
    } else {
      nextStep();
    }
  };

  return (
    <div>
      <Form onSubmit={submitFormData}>
        <Form.Group className="">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            style={{ border: error ? "2px solid #6259ca" : "" }}
            name="firstName"
            defaultValue={values.firstName}
            type="text"
            placeholder="First Name"
            onChange={handleFormData("firstName")}
          />
          {error ? (
            <Form.Text style={{ color: "#6259ca" }}>
              This is a required field
            </Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            style={{ border: error ? "2px solid #6259ca" : "" }}
            name="lastName"
            defaultValue={values.lastName}
            type="text"
            placeholder="Last Name"
            onChange={handleFormData("lastName")}
          />
          {error ? (
            <Form.Text style={{ color: "#6259ca" }}>
              This is a required field
            </Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <Button type="submit">
          Continue
        </Button>
      </Form>
    </div>
  );
}
function StepTwo({ nextStep, handleFormData, prevStep, values }) {

  const [error, setError] = useState(false);


  const submitFormData = (e) => {
    e.preventDefault();


    if (validator.isEmpty(values.age) || validator.isEmpty(values.email)) {
      setError(true);
    } else {
      nextStep();
    }
  };
  return (
    <div>
      <Form onSubmit={submitFormData}>
        <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            style={{ border: error ? "2px solid red" : "" }}
            type="number"
            placeholder="Age"
            onChange={handleFormData("age")}
          />
          {error ? (
            <Form.Text style={{ color: "red" }}>
              This is a required field
            </Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            style={{ border: error ? "2px solid red" : "" }}
            type="email"
            placeholder="email"
            onChange={handleFormData("email")}
          />
          {error ? (
            <Form.Text style={{ color: "red" }}>
              This is a required field
            </Form.Text>
          ) : (
            ""
          )}
        </Form.Group>
        <div >
          <Button className="float-start" onClick={prevStep}>
            Previous
          </Button>

          <Button className="float-end" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};
function Final({ values }) {


  const { firstName, lastName, age, email } = values;
  return (

    <div style={{ textAlign: "left" }}>
      <div>
        <p>
          <strong>First Name :</strong> {firstName}
        </p>
        <p>
          <strong>Last Name :</strong> {lastName}
        </p>
        <p>
          <strong>Age :</strong> {age}
        </p>
        <p>
          <strong>Email :</strong> {email}
        </p>
      </div>
    </div>

  );
};
export function WizardForm() {
  const [step, setstep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: ""
  })
  const nextStep = () => {
    setstep(step + 1);
  };
  const prevStep = () => {
    setstep(step - 1);
  };
  const handleInputData = input => e => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [input]: value
    }));
  }
  switch (step) {
    case 1:
      return (

        <div className="custom-margin">
          <Name nextStep={nextStep} handleFormData={handleInputData} values={formData} />
        </div>
      );

    default:
      return (

        <div className="custom-margin">
          <StepTwo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
        </div>
      );

    case 3:
      return (
        <div className="">
          <div className="custom-margin">
            <Final values={formData} />
          </div>
        </div>


      );


  }
}
//End

//BasicContentWizard
export const BasicContentWizard = () => {
  const [goSteps, setGoSteps] = useState(0);

  return (
    <div>
      <Stepper activeStep={goSteps}>
        <Step onClick={() => setGoSteps(0)} label="Personal Information" />
        <Step onClick={() => setGoSteps(1)} label="Billing Information" />
        <Step onClick={() => setGoSteps(2)} label="Payment Details" />
      </Stepper>
      {goSteps === 0 && (
        <div>
          <h3>Personal Information</h3>
          <section>
            <div className="control-group form-group ">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control required"
                placeholder="Name"
              />
            </div>
            <div className="control-group form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control required"
                placeholder="Email Address"
              />
            </div>
            <div className="control-group form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="number"
                className="form-control required"
                placeholder="Number"
              />
            </div>
            <div className="control-group form-group mb-0">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control required"
                placeholder="Address"
              />
            </div>
          </section>
          <button
            className="btn btn-primary mt-2 float-end"
            onClick={() => setGoSteps(1)}
          >
            Next
          </button>
          <button
            className="btn btn-primary mt-2 float-start"
            onClick={() => setGoSteps(0)}
            disabled
          >
            Previous
          </button>
        </div>
      )}
      {goSteps === 1 && (
        <div>
          <h3>Billing Information</h3>
          <section>
            <div className="table-responsive mg-t-20">
              <table className="table table-bordered border">
                <tbody>
                  <tr>
                    <td>Cart Subtotal</td>
                    <td className="text-end">$792.00</td>
                  </tr>
                  <tr>
                    <td>
                      <span>Totals</span>
                    </td>
                    <td className="text-end text-muted">
                      <span>$792.00</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span>Order Total</span>
                    </td>
                    <td>
                      <h2 className="price text-end mb-0">$792.00</h2>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <div>
            <button
              className="btn btn-primary float-end"
              onClick={() => setGoSteps(2)}
            >
              Next
            </button>
            <button className="btn btn-primary float-start " onClick={() => setGoSteps(0)}>
              Previous
            </button>
          </div>
        </div>
      )}
      {goSteps === 2 && (
        <div className="Paymentdetails">
          <h3>Payment Details</h3>
          <section>
            <div className="form-group">
              <label className="form-label">Card Holder Name</label>
              <input
                type="text"
                className="form-control"
                id="name1"
                placeholder="First Name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Card number</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for..."
                />
                <span className="input-group-text btn btn-info shadow-none">
                  <button>
                    <i className="fa fa-cc-visa"></i> &nbsp;
                    <i className="fa fa-cc-amex"></i> &nbsp;
                    <i className="fa fa-cc-mastercard"></i>
                  </button>
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                <div className="form-group mb-sm-0">
                  <label className="form-label">Expiration</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="MM"
                      name="expiremonth"
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="YY"
                      name="expireyear"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-4 ">
                <div className="form-group mb-0">
                  <label className="form-label">
                    CVV <i className="fa fa-question-circle"></i>
                  </label>
                  <input type="number" className="form-control" required="" />
                </div>
              </div>
            </div>
          </section>
          <button
            className="btn btn-primary float-end"
            onClick={() => setGoSteps(0)}
          >
            Submit
          </button>
          <button className="btn btn-primary wizer float-start" onClick={() => setGoSteps(1)}>
            Previous
          </button>
        </div>
      )}
    </div>
  );
};
//End

//Formwizard
function getSteps() {
  return ["Personal Information", "Billing Information", "Payment Details"];
}
function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <div id="step-10" className="">
          <form>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail6"
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="passwsord"
                className="form-control"

                placeholder="Password"
              />
            </div>
            <div className="form-group mb-0 justify-content-end">
              <div className="">
                <label className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="example-checkbox2"
                    value="option2"
                  />
                  <span className="custom-control-label">Check me Out</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      );
    case 1:
      return (
        <div id="step-11" className="">
          <form>
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                className="form-control"
                id="inputtext"
                placeholder="Enter User Name"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="number"
                className="form-control"
                id="exampleInputEmail8"
                placeholder="Enter Your Number"
              />
            </div>
            <div className="form-group mb-0 justify-content-end">
              <div className="">
                <label className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    name="example-checkbox2"
                    value="option2"
                  />
                  <span className="custom-control-label">Check me Out</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      );
    case 2:
      return (
        <div id="step-12" className="">
          <div className="form-group mb-0 justify-content-end">
            <div className="">
              <label className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name="example-checkbox2"
                  value="option2"
                />
                <span className="custom-control-label">
                  I agree terms & Conditions
                </span>
              </label>
            </div>
          </div>
        </div>
      );
    default:
      return "unknown step";
  }
}
export function Formwizard() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  const isStepOptional = (step) => {
    return step === 1;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = "";
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            All steps completed
            <Button onClick={handleReset} className="float-end">
              Reset
            </Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>

              <Button
                variant="contained"
                className="float-end"
                color="primary"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
//End

//VerticalOrientationWizard
const steps = [
  {
    label: "Personal Information",
    description: (
      <span>
        <span className="control-group form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control required"
            placeholder="Name"
          />
        </span>
        <span className="control-group form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control required"
            placeholder="Email Address"
          />
        </span>
        <span className="control-group form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="number"
            className="form-control required"
            placeholder="Number"
          />
        </span>
        <span className="control-group form-group mb-0">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control required"
            placeholder="Address"
          />
        </span>
      </span>
    ),
  },
  {
    label: "Billing Information",
    description: (
      <span>
        <span className="table-responsive mg-t-20">
          <span className="table table-bordered">
            <span>
              <span className="row valid">
                <span className="col-sm-1"></span>
                <span className="col-sm-5">Cart Subtotal</span>
                <span className="text-end col-sm-5">$792.00</span>
              </span>

              <span className="row">
                <span className="col-sm-1"></span>
                <span className="col-sm-5">
                  <span>Totals</span>
                </span>
                <span className="col-sm-5 text-end text-muted">
                  <span>$792.00</span>
                </span>
              </span>
              <span className="row">
                <span className="col-sm-1"></span>
                <span className="col-sm-5">
                  <span>Order Total</span>
                </span>

                <span className="col-sm-5 price text-end  mb-0">
                  $792.00

                </span>
              </span>
            </span>
          </span>
        </span>
      </span>
    ),
  },
  {
    label: "Payment Details ",
    description: (
      <span>
        <span className="form-group">
          <label className="form-label">Card Holder Name</label>
          <input
            type="text"
            className="form-control"
            id="name12"
            placeholder="First Name"
          />
        </span>
        <span className="form-group">
          <label className="form-label">Card number</label>
          <span className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search for..."
            />
            <span className="input-group-text btn btn-info shadow-none">
              <i className="fa fa-cc-visa"></i> &nbsp;
              <i className="fa fa-cc-amex"></i> &nbsp;
              <i className="fa fa-cc-mastercard"></i>
            </span>
          </span>
        </span>
        <span className="row">
          <span className="col-sm-8">
            <span className="form-group mb-sm-0">
              <label className="form-label">Expiration</label>
              <span className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="MM"
                  name="expiremonth"
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="YY"
                  name="expireyear"
                />
              </span>
            </span>
          </span>
          <span className="col-sm-4 ">
            <span className="form-group mb-0">
              <label className="form-label">
                CVV <i className="fa fa-question-circle"></i>
              </label>
              <input type="number" className="form-control" required="" />
            </span>
          </span>
        </span>
      </span>
    ),
  },
];

export function VerticalOrientationWizard() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? <Typography variant="caption"></Typography> : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div className="buts">
                  <Button
                    className="me-2 mt-2"

                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    className="me-2 mt-2"
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>&nbsp;&nbsp;
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button
            className="me-2 resets mt-2"
            onClick={handleReset}
            sx={{ mt: 1, mr: 1 }}
          >
            Reset
          </Button>&nbsp;&nbsp;
        </Paper>
      )}
    </Box>
  );
}
//End
//AccordionWizardForm
const NameEmail = () => {
  return (
    <div className="list-group">
      <div className="list-group-item" >
        <h5 className="mb-0 d-flex" ><span className="form-wizard-title">Name &amp; Email</span></h5>
        <div className="my-3">
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" className="form-control" />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="text" name="email" className="form-control" />
          </div>
        </div>
      </div>
    </div>
  )
}
const Contact = () => {
  return (
    <div>
      <div className="list-group-item" >
        <h5 className="mb-0 d-flex" ><span className="form-wizard-title">Contact</span></h5>
        <div >
          <div className="my-3">
            <div className="form-group">
              <label>Telephone:</label>
              <input type="text" name="telephone" className="form-control" />
            </div>
            <div className="form-group">
              <label>Mobile:</label>
              <input type="text" name="mobile" className="form-control" />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group form-check">
        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
        <label className="form-check-label" htmlFor="exampleCheck1">Accept</label>
      </div>
    </div>
  )
}
export const FormBeanMasterEntry = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data2 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data3 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data4 = [
    {
      id: 327,
      DistrictName: "DARJEELING",
      Extension: "abc"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI",
      Extension: "abc"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR",
      Extension: "abc"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR",
      Extension: "abc"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR",
      Extension: "abc"
    },
    {
      id: 332,
      DistrictName: "MALDAH",
      Extension: "abc"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD",
      Extension: "abc"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM",
      Extension: "abc"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN",
      Extension: "abc"
    },
    {
      id: 336,
      DistrictName: "NADIA",
      Extension: "abc"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS",
      Extension: "abc"
    },
    {
      id: 338,
      DistrictName: "HOOGLY",
      Extension: "abc"
    },
    {
      id: 339,
      DistrictName: "BANKURA",
      Extension: "abc"
    },
    {
      id: 340,
      DistrictName: "PURULIA",
      Extension: "abc"
    },
    {
      id: 341,
      DistrictName: "HOWRAH",
      Extension: "abc"
    }
  ];

  const data5 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const [searchText2, setSearchText2] = useState('');
  const [open2, setOpen2] = useState(false);
  const [tableData2, setTableData2] = useState(data2);
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectRow2, setSelectRow2] = useState(null);

  const [searchText3, setSearchText3] = useState('');
  const [open3, setOpen3] = useState(false);
  const [tableData3, setTableData3] = useState(data3);
  const [filteredData3, setFilteredData3] = useState([]);
  const [selectRow3, setSelectRow3] = useState(null);

  const [searchText4, setSearchText4] = useState('');
  const [open4, setOpen4] = useState(false);
  const [tableData4, setTableData4] = useState(data4);
  const [filteredData4, setFilteredData4] = useState([]);
  const [selectRow4, setSelectRow4] = useState(null);

  const [searchText5, setSearchText5] = useState('');
  const [open5, setOpen5] = useState(false);
  const [tableData5, setTableData5] = useState(data5);
  const [filteredData5, setFilteredData5] = useState([]);
  const [selectRow5, setSelectRow5] = useState(null);

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  const handleSearch2 = () => {
    // Filter the table data based on the search text
    const filteredData2 = tableData2.filter(
      (row2) =>
        row2.id.toString().toLowerCase().includes(searchText2.toLowerCase()) ||
        row2.DistrictName.toLowerCase().includes(searchText2.toLowerCase())
    );
    setFilteredData2(filteredData2);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData2(tableData2);
  }, [tableData2]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open2) {
      setTableData2(data2);
      setFilteredData2(data2);
      setSearchText2('');
    }
  }, [open2]);

  const handleSearch3 = () => {
    // Filter the table data based on the search text
    const filteredData3 = tableData3.filter(
      (row3) =>
        row3.id.toString().toLowerCase().includes(searchText3.toLowerCase()) ||
        row3.DistrictName.toLowerCase().includes(searchText3.toLowerCase())
    );
    setFilteredData3(filteredData3);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData3(tableData3);
  }, [tableData3]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open3) {
      setTableData3(data3);
      setFilteredData3(data3);
      setSearchText3('');
    }
  }, [open3]);

  const handleSearch4 = () => {
    // Filter the table data based on the search text
    const filteredData4 = tableData4.filter(
      (row4) =>
        row4.id.toString().toLowerCase().includes(searchText4.toLowerCase()) ||
        row4.DistrictName.toLowerCase().includes(searchText4.toLowerCase())
    );
    setFilteredData4(filteredData4);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData4(tableData4);
  }, [tableData4]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open4) {
      setTableData4(data4);
      setFilteredData4(data4);
      setSearchText4('');
    }
  }, [open4]);

  const handleSearch5 = () => {
    // Filter the table data based on the search text
    const filteredData5 = tableData5.filter(
      (row5) =>
        row5.id.toString().toLowerCase().includes(searchText5.toLowerCase()) ||
        row5.DistrictName.toLowerCase().includes(searchText5.toLowerCase())
    );
    setFilteredData5(filteredData5);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData5(tableData5);
  }, [tableData5]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open5) {
      setTableData5(data5);
      setFilteredData5(data5);
      setSearchText5('');
    }
  }, [open5]);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleRowClick2 = (rowData2) => {
    setSelectRow2(rowData2);
    setOpen2(false);
  };

  const closeModal2 = () => {
    setOpen2(false);
  };

  const openmodal2 = () => {
    setTableData2(data2);
    setOpen2(true);
  };

  const handleRowClick3 = (rowData3) => {
    setSelectRow3(rowData3);
    setOpen3(false);
  };

  const closeModal3 = () => {
    setOpen3(false);
  };

  const openmodal3 = () => {
    setTableData3(data3);
    setOpen3(true);
  };

  const handleRowClick4 = (rowData4) => {
    setSelectRow4(rowData4);
    setOpen4(false);
  };

  const closeModal4 = () => {
    setOpen4(false);
  };

  const openmodal4 = () => {
    setTableData4(data4);
    setOpen4(true);
  };

  const handleRowClick5 = (rowData5) => {
    setSelectRow5(rowData5);
    setOpen5(false);
  };

  const closeModal5 = () => {
    setOpen5(false);
  };

  const openmodal5 = () => {
    setTableData5(data5);
    setOpen5(true);
  };

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Module Group<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()} ></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Group Code"
                          value={selectRow?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Group Name"
                          value={selectRow?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Module Group Code</th>
                                      <th>Module Group Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Module<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal2()}></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Code"
                          value={selectRow2?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Name"
                          value={selectRow2?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open2 && (
                          <Modal show={open2} onHide={closeModal2} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText2}
                                    onChange={(e) => setSearchText2(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch2}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Module Code</th>
                                      <th>Module Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData2.map((row2) => (
                                      <tr key={row2.id} onClick={() => handleRowClick2(row2)}>
                                        <td>{row2.id}</td>
                                        <td>{row2.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen2(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Form<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal3()}></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Code"
                          value={selectRow3?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Name"
                          value={selectRow3?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open3 && (
                          <Modal show={open3} onHide={closeModal3} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow2 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText3}
                                    onChange={(e) => setSearchText3(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch3}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Form Code</th>
                                      <th>Form Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData3.map((row3) => (
                                      <tr key={row3.id} onClick={() => handleRowClick3(row3)}>
                                        <td>{row3.id}</td>
                                        <td>{row3.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen3(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Bean Sl No
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Bean Sl No"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Form Bean Name
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Bean Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Bean<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal4()}></i>
                      </label>
                      <div className="col-sm-2 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Bean"
                          value={selectRow4?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-2 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Block"
                          value={selectRow4?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Extension Bean Name"
                          value={selectRow4?.Extension || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open4 && (
                          <Modal show={open4} onHide={closeModal4} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow3 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText4}
                                    onChange={(e) => setSearchText4(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch4}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Bean</th>
                                      <th>Block</th>
                                      <th>Bean Exension Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData4.map((row4) => (
                                      <tr key={row4.id} onClick={() => handleRowClick4(row4)}>
                                        <td>{row4.id}</td>
                                        <td>{row4.DistrictName}</td>
                                        <td>{row4.Extension}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen4(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Base Table
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Table Name<i className="fa fa-search d=inline" title="" onClick={() => openmodal5()} ></i>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Table Name"
                          value={selectRow5?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open5 && (
                          <Modal show={open5} onHide={closeModal5} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow4 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText5}
                                    onChange={(e) => setSearchText5(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch5}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Object Name</th>
                                      <th>Object Code</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData5.map((row5) => (
                                      <tr key={row5.id} onClick={() => handleRowClick5(row5)}>
                                        <td>{row5.id}</td>
                                        <td>{row5.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen5(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export const PageBlockWithColumnDefination = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data2 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data3 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data4 = [
    {
      id: 327,
      DistrictName: "DARJEELING",
      Extension: "abc"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI",
      Extension: "abc"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR",
      Extension: "abc"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR",
      Extension: "abc"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR",
      Extension: "abc"
    },
    {
      id: 332,
      DistrictName: "MALDAH",
      Extension: "abc"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD",
      Extension: "abc"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM",
      Extension: "abc"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN",
      Extension: "abc"
    },
    {
      id: 336,
      DistrictName: "NADIA",
      Extension: "abc"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS",
      Extension: "abc"
    },
    {
      id: 338,
      DistrictName: "HOOGLY",
      Extension: "abc"
    },
    {
      id: 339,
      DistrictName: "BANKURA",
      Extension: "abc"
    },
    {
      id: 340,
      DistrictName: "PURULIA",
      Extension: "abc"
    },
    {
      id: 341,
      DistrictName: "HOWRAH",
      Extension: "abc"
    }
  ];

  const data5 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const [weight, setWeight] = useState("0");
  const [inputValue, setInputValue] = useState("");

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const [searchText2, setSearchText2] = useState('');
  const [open2, setOpen2] = useState(false);
  const [tableData2, setTableData2] = useState(data2);
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectRow2, setSelectRow2] = useState(null);

  const [searchText3, setSearchText3] = useState('');
  const [open3, setOpen3] = useState(false);
  const [tableData3, setTableData3] = useState(data3);
  const [filteredData3, setFilteredData3] = useState([]);
  const [selectRow3, setSelectRow3] = useState(null);

  const [searchText4, setSearchText4] = useState('');
  const [open4, setOpen4] = useState(false);
  const [tableData4, setTableData4] = useState(data4);
  const [filteredData4, setFilteredData4] = useState([]);
  const [selectRow4, setSelectRow4] = useState(null);

  const [searchText5, setSearchText5] = useState('');
  const [open5, setOpen5] = useState(false);
  const [tableData5, setTableData5] = useState(data5);
  const [filteredData5, setFilteredData5] = useState([]);
  const [selectRow5, setSelectRow5] = useState(null);

  function handlechange(event) {
    const value = event.target.value;
    setWeight(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }

  function handlechange2(event) {
    const value = event.target.value;
    setInputValue(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  const handleSearch2 = () => {
    // Filter the table data based on the search text
    const filteredData2 = tableData2.filter(
      (row2) =>
        row2.id.toString().toLowerCase().includes(searchText2.toLowerCase()) ||
        row2.DistrictName.toLowerCase().includes(searchText2.toLowerCase())
    );
    setFilteredData2(filteredData2);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData2(tableData2);
  }, [tableData2]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open2) {
      setTableData2(data2);
      setFilteredData2(data2);
      setSearchText2('');
    }
  }, [open2]);

  const handleSearch3 = () => {
    // Filter the table data based on the search text
    const filteredData3 = tableData3.filter(
      (row3) =>
        row3.id.toString().toLowerCase().includes(searchText3.toLowerCase()) ||
        row3.DistrictName.toLowerCase().includes(searchText3.toLowerCase())
    );
    setFilteredData3(filteredData3);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData3(tableData3);
  }, [tableData3]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open3) {
      setTableData3(data3);
      setFilteredData3(data3);
      setSearchText3('');
    }
  }, [open3]);

  const handleSearch4 = () => {
    // Filter the table data based on the search text
    const filteredData4 = tableData4.filter(
      (row4) =>
        row4.id.toString().toLowerCase().includes(searchText4.toLowerCase()) ||
        row4.DistrictName.toLowerCase().includes(searchText4.toLowerCase())
    );
    setFilteredData4(filteredData4);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData4(tableData4);
  }, [tableData4]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open4) {
      setTableData4(data4);
      setFilteredData4(data4);
      setSearchText4('');
    }
  }, [open4]);

  const handleSearch5 = () => {
    // Filter the table data based on the search text
    const filteredData5 = tableData5.filter(
      (row5) =>
        row5.id.toString().toLowerCase().includes(searchText5.toLowerCase()) ||
        row5.DistrictName.toLowerCase().includes(searchText5.toLowerCase())
    );
    setFilteredData5(filteredData5);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData5(tableData5);
  }, [tableData5]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open5) {
      setTableData5(data5);
      setFilteredData5(data5);
      setSearchText5('');
    }
  }, [open5]);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleRowClick2 = (rowData2) => {
    setSelectRow2(rowData2);
    setOpen2(false);
  };

  const closeModal2 = () => {
    setOpen2(false);
  };

  const openmodal2 = () => {
    setTableData2(data2);
    setOpen2(true);
  };

  const handleRowClick3 = (rowData3) => {
    setSelectRow3(rowData3);
    setOpen3(false);
  };

  const closeModal3 = () => {
    setOpen3(false);
  };

  const openmodal3 = () => {
    setTableData3(data3);
    setOpen3(true);
  };

  const handleRowClick4 = (rowData4) => {
    setSelectRow4(rowData4);
    setOpen4(false);
  };

  const closeModal4 = () => {
    setOpen4(false);
  };

  const openmodal4 = () => {
    setTableData4(data4);
    setOpen4(true);
  };

  const handleRowClick5 = (rowData5) => {
    setSelectRow5(rowData5);
    setOpen5(false);
  };

  const closeModal5 = () => {
    setOpen5(false);
  };

  const openmodal5 = () => {
    setTableData5(data5);
    setOpen5(true);
  };

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Module Group<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()} ></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Group Code"
                          value={selectRow?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Group Name"
                          value={selectRow?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Module Group Code</th>
                                      <th>Module Group Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Module<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal2()}></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Code"
                          value={selectRow2?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Name"
                          value={selectRow2?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open2 && (
                          <Modal show={open2} onHide={closeModal2} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText2}
                                    onChange={(e) => setSearchText2(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch2}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Module Code</th>
                                      <th>Module Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData2.map((row2) => (
                                      <tr key={row2.id} onClick={() => handleRowClick2(row2)}>
                                        <td>{row2.id}</td>
                                        <td>{row2.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen2(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Form<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal3()}></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Code"
                          value={selectRow3?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Name"
                          value={selectRow3?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open3 && (
                          <Modal show={open3} onHide={closeModal3} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow2 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText3}
                                    onChange={(e) => setSearchText3(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch3}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Form Code</th>
                                      <th>Form Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData3.map((row3) => (
                                      <tr key={row3.id} onClick={() => handleRowClick3(row3)}>
                                        <td>{row3.id}</td>
                                        <td>{row3.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen3(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Page<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal4()}></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Page Code"
                          value={selectRow4?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Page Name"
                          value={selectRow4?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open4 && (
                          <Modal show={open4} onHide={closeModal4} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow3 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText4}
                                    onChange={(e) => setSearchText4(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch4}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Page Code</th>
                                      <th>Page Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData4.map((row4) => (
                                      <tr key={row4.id} onClick={() => handleRowClick4(row4)}>
                                        <td>{row4.id}</td>
                                        <td>{row4.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen4(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Block Sl No
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Block Sl No"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Bean Serial No<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal5()} ></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Number"
                          value={selectRow5?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          value={selectRow5?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open5 && (
                          <Modal show={open5} onHide={closeModal5} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow4 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText5}
                                    onChange={(e) => setSearchText5(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch5}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Number</th>
                                      <th>Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData5.map((row5) => (
                                      <tr key={row5.id} onClick={() => handleRowClick5(row5)}>
                                        <td>{row5.id}</td>
                                        <td>{row5.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen5(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Rows<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          maxLength={2}
                          value={weight}
                          onChange={handlechange}
                          placeholder="No of Rows"
                        />
                        <span className="input-group-text">{weight.length}/2</span>
                      </div>
                    </div>
                    <div className=" row mb-4 custom-controls-stacked">
                      <label className="col-sm-3 form-label custom-control custom-radio">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="example-radios"
                          defaultValue="Base Table"
                        />
                        <span className="custom-control-label">Base Table</span>
                      </label>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Block Code
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Block Code"
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Block Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Base Table Name
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Base Table Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Bean Name
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Bean Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Title
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          maxLength={100}
                          value={inputValue}
                          onChange={handlechange2}
                          placeholder="Title"
                        />
                        <span className="input-group-text">{inputValue.length}/100</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Optional
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export const ColumnEntry2 = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data2 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const [weight, setWeight] = useState("0");
  const [weight2, setWeight2] = useState("0");
  const [inputValue, setInputValue] = useState("");

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const [searchText2, setSearchText2] = useState('');
  const [open2, setOpen2] = useState(false);
  const [tableData2, setTableData2] = useState(data2);
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectRow2, setSelectRow2] = useState(null);

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleSearch2 = () => {
    // Filter the table data based on the search text
    const filteredData2 = tableData2.filter(
      (row2) =>
        row2.id.toString().toLowerCase().includes(searchText2.toLowerCase()) ||
        row2.DistrictName.toLowerCase().includes(searchText2.toLowerCase())
    );
    setFilteredData2(filteredData2);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData2(tableData2);
  }, [tableData2]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open2) {
      setTableData2(data2);
      setFilteredData2(data2);
      setSearchText2('');
    }
  }, [open2]);

  const handleRowClick2 = (rowData2) => {
    setSelectRow2(rowData2);
    setOpen2(false);
  };

  const closeModal2 = () => {
    setOpen2(false);
  };

  const openmodal2 = () => {
    setTableData2(data2);
    setOpen2(true);
  };

  function handlechange(event) {
    const value = event.target.value;
    setWeight(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }

  function handlechange2(event) {
    const value = event.target.value;
    setInputValue(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }

  function handlechange3(event) {
    const value = event.target.value;
    setWeight2(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }


  // const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Row<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          value={1}
                          type="text"
                          placeholder="Row"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Col Sl No
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Col Sl No"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Col<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal2()} ></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={selectRow2?.id || ''}
                          placeholder="Col Name"
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={selectRow2?.DistrictName || ''}
                          placeholder="Col Variable Name"
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open2 && (
                          <Modal show={open2} onHide={closeModal2} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText2}
                                    onChange={(e) => setSearchText2(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch2}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Col Name</th>
                                      <th>Col Variable Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData2.map((row2) => (
                                      <tr key={row2.id} onClick={() => handleRowClick2(row2)}>
                                        <td>{row2.id}</td>
                                        <td>{row2.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen2(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Base Table
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Pk Flag
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Pk Seq
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Pk Seq"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">
                        Col Label
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          id="exampleFormControlSelect1"
                          maxLength={100}
                          value={inputValue}
                          onChange={handlechange2}
                          placeholder="Col Label"
                        />
                        <span className="input-group-text">{inputValue.length}/100</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Class<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()} ></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={selectRow?.id || ''}
                          placeholder="Css Class Code"
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={selectRow?.DistrictName || ''}
                          placeholder="Css Class Name"
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow2 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Css Class Code</th>
                                      <th>Css Class Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Col Var Name
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Col Var Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">
                        Row No<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          id="exampleFormControlSelect1"
                          maxLength={2}
                          value={weight2}
                          onChange={handlechange3}
                          placeholder="Col No"
                          required
                        />
                        <span className="input-group-text">{weight2.length}/2</span>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">
                        Col No
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          id="exampleFormControlSelect1"
                          maxLength={2}
                          value={weight}
                          onChange={handlechange}
                          placeholder="Col No"
                        />
                        <span className="input-group-text">{weight.length}/2</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Status
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.StatusSelect />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export const ColumnEntry = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const [weight, setWeight] = useState("0");

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  function handlechange(event) {
    const value = event.target.value;
    setWeight(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }

  // const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Row<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          value={1}
                          type="text"
                          placeholder="Row"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Col Sl No
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Col Sl No"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Table
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Name<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()} ></i>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={selectRow?.DistrictName || ''}
                          placeholder="Col Name"
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Module Group Code</th>
                                      <th>Module Group Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Col Var Name
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Col Var Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        PK?
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">
                        PK Seq
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          id="exampleFormControlSelect1"
                          maxLength={2}
                          value={weight}
                          onChange={handlechange}
                          placeholder="Bean Sl No"
                        />
                        <span className="input-group-text">{weight.length}/2</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const FormMasterEntry = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const data2 = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const [searchText2, setSearchText2] = useState('');
  const [open2, setOpen2] = useState(false);
  const [tableData2, setTableData2] = useState(data2);
  const [filteredData2, setFilteredData2] = useState([]);
  const [selectRow2, setSelectRow2] = useState(null);

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleChange2 = (event) => {
    const { value } = event.target;
    setInputValue2(value);
  };

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  const handleSearch2 = () => {
    // Filter the table data based on the search text
    const filteredData2 = tableData2.filter(
      (row2) =>
        row2.id.toString().toLowerCase().includes(searchText2.toLowerCase()) ||
        row2.DistrictName.toLowerCase().includes(searchText2.toLowerCase())
    );
    setFilteredData2(filteredData2);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData2(tableData2);
  }, [tableData2]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open2) {
      setTableData2(data2);
      setFilteredData2(data2);
      setSearchText2('');
    }
  }, [open2]);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleRowClick2 = (rowData2) => {
    setSelectRow2(rowData2);
    setOpen2(false);
  };

  const closeModal2 = () => {
    setOpen2(false);
  };

  const openmodal2 = () => {
    setTableData2(data2);
    setOpen2(true);
  };

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Module<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()} ></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Code"
                          value={selectRow?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Name"
                          value={selectRow?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Module Code</th>
                                      <th>Module Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Form<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Code"
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Form Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Form
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={inputValue}
                          onChange={handleChange}
                          maxLength={2000}
                          placeholder="Form Description"
                        />
                        <span className="input-group-text">{inputValue.length}/2000</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Template<span className="text-red">*</span><i className="fa fa-search d=inline" onClick={() => openmodal2()}></i>
                      </label>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Template Code"
                          value={selectRow2?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Template Name"
                          value={selectRow2?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open2 && (
                          <Modal show={open2} onHide={closeModal2} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {selectRow && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText2}
                                    onChange={(e) => setSearchText2(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch2}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Template Code</th>
                                      <th>Template Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData2.map((row2) => (
                                      <tr key={row2.id} onClick={() => handleRowClick2(row2)}>
                                        <td>{row2.id}</td>
                                        <td>{row2.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen2(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4 custom-controls-stacked">
                      <label className="col-sm-3 form-label custom-control custom-radio">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="example-radios"
                          defaultValue="List"
                        />
                        <span className="custom-control-label">List</span>
                      </label>
                      <label className="col-sm-3 form-label custom-control custom-radio">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="example-radios"
                          defaultValue="Addition"
                        />
                        <span className="custom-control-label">Addition</span>
                      </label>
                      <label className="col-sm-3 form-label custom-control custom-radio">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="example-radios"
                          defaultValue="View"
                        />
                        <span className="custom-control-label">
                          View
                        </span>
                      </label>
                      <label className="col-sm-3 form-label custom-control custom-radio">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="example-radios2"
                          defaultValue="Otp"
                        />
                        <span className="custom-control-label">
                          Otp
                        </span>
                      </label>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Restriction
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Remarks
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={inputValue2}
                          onChange={handleChange2}
                          maxLength={150}
                          placeholder="Technical Remarks"
                        />
                        <span className="input-group-text">{inputValue2.length}/150</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PageEntry = () => {

  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleChange2 = (event) => {
    const { value } = event.target;
    setInputValue2(value);
  };

  // const [createModalOpen, setCreateModalOpen] = useState(false);
  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Row<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          value={1}
                          type="text"
                          placeholder="Row"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Page Id
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Page Id"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Name<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={inputValue2}
                          onChange={handleChange2}
                          maxLength={100}
                          placeholder="Page Name"
                        />
                        <span className="input-group-text">{inputValue2.length}/100</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Type<span className="text-red">*</span>
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Remarks
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          value={inputValue}
                          onChange={handleChange}
                          maxLength={150}
                          placeholder="Technical Remarks"
                        />
                        <span className="input-group-text">{inputValue.length}/150</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TableEntry = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  // const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Row#
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Module Code"
                          value={1}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Other
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.StatusSelect />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Id/View<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={openmodal}></i>
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Table / View Id"
                          value={selectRow?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Table / View Id</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Name
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Restriction
                      </label>
                      <div className="col-sm-8 input-group">
                        <formelement.PositionSelect />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoginLocation = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const treeData2 = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        {
          title: 'leaf 0-0',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];

  const [value2, setValue2] = useState();
  const [title2, setTitle2] = useState();
  const [openModal2, setOpenModal2] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const onSelect2 = (keys, event) => {
    const { node: { title } } = event;
    console.log('Trigger Select', keys, title);
    setValue2(keys);
    setTitle2(title);
    setOpenModal2(false);
  };

  const onExpand2 = (keys, title) => {
    console.log('Trigger Expand', keys, title);
  };

  const handleOpenModal2 = () => {
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  function handleChange(event) {
    const value = event.target.value;
    setWeight(value);
    // const pattern = /^\d+(\.\d{1,2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }
  // const openModal = () => {
  //   setTableData(data);
  //   setOpen(true);
  // };

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);
  const [weight, setWeight] = useState("0.00");
  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Designation Tree Info
              </h4>
            </div>

            <div className="card-body">

              <div className="row ">

                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Parent<i className="fa fa-search d=inline" title="" onClick={() => handleOpenModal2()}></i>
                      </label>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Parent Code"
                          value={value2}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Parent Name"
                          value={title2}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {openModal2 && (
                          <Modal show={openModal2} onHide={handleCloseModal2}>
                            <Modal.Header closeButton>
                              <Modal.Title>Create New Account</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <DirectoryTree
                                showLine
                                showLeafIcon
                                value={{ value2, title2 }}
                                onSelect={onSelect2}
                                onExpand={onExpand2}
                                treeData={treeData2}
                              />
                            </Modal.Body>
                            <Modal.Footer>
                              <button onClick={handleCloseModal2}>Close</button>
                            </Modal.Footer>
                          </Modal>
                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Code<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()}></i>
                      </label>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Designation Code"
                          value={selectRow?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Designation Name"
                          value={selectRow?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {value2 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Designation Code</th>
                                      <th>Designation Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4 py-4">
                      <label className="col-md-2 form-label">
                        Order By
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Order By"
                          maxLength={5}
                          value={weight}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const Location = () => {

  const treeData = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        {
          title: 'leaf 0-0',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];

  // const [createModalOpen, setCreateModalOpen] = useState(false);
  const [value, setValue] = useState();
  const [title, setTitle] = useState();
  const [openModal, setOpenModal] = useState(false);

  const onSelect = (keys, event) => {
    const { node: { title } } = event;
    console.log('Trigger Select', keys, title);
    setValue(keys);
    setTitle(title);
    setOpenModal(false);
  };

  const onExpand = (keys, title) => {
    console.log('Trigger Expand', keys, title);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <form id="myForm">
      <div class="row my-2 py-4">
        <label
          for="exampleFormControlSelect1"
          className="col-sm-1 col-form-label"
        >
          <b>Location:<i className="fa fa-search d=inline" title="" onClick={() => handleOpenModal()}></i></b>

        </label>
        <div className="col-sm-4">
          <input className="form-control border border-primary" type="text" id="exampleFormControlSelect1" value={value} placeholder="Login Location Code" readOnly />
        </div>
        <div className="col-sm-4">
          <input className="form-control border border-primary" type="text" id="exampleFormControlSelect1" value={title} placeholder="Login Location Name" readOnly />
        </div>
        <div className="row-mb-12">
          {/* Modal */}
          {openModal && (
            <Modal show={openModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Create New Account</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <DirectoryTree
                  showLine
                  showLeafIcon
                  value={{ value, title }}
                  onSelect={onSelect}
                  onExpand={onExpand}
                  treeData={treeData}
                />
              </Modal.Body>
              <Modal.Footer>
                <button onClick={handleCloseModal}>Close</button>
              </Modal.Footer>
            </Modal>
          )}
          {/* Input fields */}
        </div>
      </div>
    </form>
  )
}
const Location2 = () => {

  return (
    <form id="myForm">
      <div class="row my-2 py-4">
        <label
          for="exampleFormControlSelect1"
          className="col-sm-1 col-form-label"
        >
          <b>Location:</b>

        </label>
        <div className="col-sm-4">
          <input className="form-control border border-primary" type="text" id="exampleFormControlSelect1" placeholder="Login Location Code" readOnly />
        </div>
        <div className="col-sm-4">
          <input className="form-control border border-primary" type="text" id="exampleFormControlSelect1" placeholder="Login Location Name" readOnly />
        </div>
      </div>
    </form>
  )
}
export const DesignationTreeInfo = () => {

  const data = [
    {
      id: 327,
      DistrictName: "DARJEELING"
    },
    {
      id: 328,
      DistrictName: "JALPAIGURI"
    },
    {
      id: 329,
      DistrictName: "COOCH BEHAR"
    },
    {
      id: 330,
      DistrictName: "UTTAR DINAJPUR"
    },
    {
      id: 331,
      DistrictName: "DAKSHIN DINAJPUR"
    },
    {
      id: 332,
      DistrictName: "MALDAH"
    },
    {
      id: 333,
      DistrictName: "MURSHIDABAD"
    },
    {
      id: 334,
      DistrictName: "BIRBHUM"
    },
    {
      id: 335,
      DistrictName: "PURBA BARDHAMAN"
    },
    {
      id: 336,
      DistrictName: "NADIA"
    },
    {
      id: 337,
      DistrictName: "NORTH 24 PARGANAS"
    },
    {
      id: 338,
      DistrictName: "HOOGLY"
    },
    {
      id: 339,
      DistrictName: "BANKURA"
    },
    {
      id: 340,
      DistrictName: "PURULIA"
    },
    {
      id: 341,
      DistrictName: "HOWRAH"
    }
  ];

  const treeData2 = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        {
          title: 'leaf 0-0',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];

  const treeData = [
    {
      title: 'parent 0',
      key: '0-0',
      children: [
        {
          title: 'leaf 0-0',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'parent 1',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];

  const [value, setValue] = useState();
  const [title, setTitle] = useState();
  const [openModal, setOpenModal] = useState(false);

  const [value2, setValue2] = useState();
  const [title2, setTitle2] = useState();
  const [openModal2, setOpenModal2] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const onSelect = (keys, event) => {
    const { node: { title } } = event;
    console.log('Trigger Select', keys, title);
    setValue(keys);
    setTitle(title);
    setOpenModal(false);
  };

  const onSelect2 = (keys, event) => {
    const { node: { title } } = event;
    console.log('Trigger Select', keys, title);
    setValue2(keys);
    setTitle2(title);
    setOpenModal2(false);
  };

  const onExpand = (keys, title) => {
    console.log('Trigger Expand', keys, title);
  };

  const onExpand2 = (keys, title) => {
    console.log('Trigger Expand', keys, title);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleOpenModal2 = () => {
    setOpenModal2(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
  };

  function handleChange(event) {
    const value = event.target.value;
    setWeight(value);
    // const pattern = /^\d+(\.\d{1, 2})?$/;
    // const isValid = pattern.test(value);
    // setIsValid(isValid);
    // if (value === '') {
    //   setIsValid(true);
    // }
  }
  // const openModal = () => {
  //   setTableData(data);
  //   setOpen(true);
  // };

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openmodal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);
  const [weight, setWeight] = useState("0.00");
  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Designation Tree Info
              </h4>
            </div>

            <div className="card-body">

              <div className="row ">

                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Location<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => handleOpenModal()}></i>
                      </label>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Location Code"
                          value={value}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Location Name"
                          value={title}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {openModal && (
                          <Modal show={openModal} onHide={handleCloseModal}>
                            <Modal.Header closeButton>
                              <Modal.Title>Create New Account</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <DirectoryTree
                                showLine
                                showLeafIcon
                                value={{ value, title }}
                                onSelect={onSelect}
                                onExpand={onExpand}
                                treeData={treeData}
                              />
                            </Modal.Body>
                            <Modal.Footer>
                              <button onClick={handleCloseModal}>Close</button>
                            </Modal.Footer>
                          </Modal>
                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Parent<i className="fa fa-search d=inline" title="" onClick={() => handleOpenModal2()}></i>
                      </label>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Reference Code"
                          value={value2}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Reference Name"
                          value={title2}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {openModal2 && (
                          <Modal show={openModal2} onHide={handleCloseModal2}>
                            <Modal.Header closeButton>
                              <Modal.Title>Create New Account</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              {value && <DirectoryTree
                                showLine
                                showLeafIcon
                                value={{ value2, title2 }}
                                onSelect={onSelect2}
                                onExpand={onExpand2}
                                treeData={treeData2}
                              />}
                            </Modal.Body>
                            <Modal.Footer>
                              <button onClick={handleCloseModal2}>Close</button>
                            </Modal.Footer>
                          </Modal>
                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Code<span className="text-red">*</span><i className="fa fa-search d=inline" title="" onClick={() => openmodal()}></i>
                      </label>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Designation Code"
                          value={selectRow?.id || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-sm-4">
                        <input
                          className="form-control border border-primary"
                          type="text"
                          placeholder="Designation Name"
                          value={selectRow?.DistrictName || ''}
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              {value2 && <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>Designation Code</th>
                                      <th>Designation Name</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.DistrictName}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>}
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                    <div className=" row mb-4 py-4">
                      <label className="col-md-2 form-label">
                        Order By
                      </label>
                      <div className="col-sm-8 input-group">
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Order By"
                          maxLength={5}
                          value={weight}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const DesignationTreeOtherInfo = () => {

  const [phoneValue, setPhoneValue] = useState('');
  const [isPhoneValidRange, setIsPhoneValidRange] = useState(true);
  const [faxValue, setFaxValue] = useState('');
  const [isFaxValidRange, setIsFaxValidRange] = useState(true);
  const [emailValue, setEmailValue] = useState('');
  const [isEmailValidRange, setIsEmailValidRange] = useState(true);

  const handlePhoneChange = (event) => {
    const input = event.target.value;
    setPhoneValue(input);

    // Regular expression to match year ranges in the format "YYYY-YYYY"
    const regex = /^\d{10}$/;

    // Check if the input matches the regex pattern
    const isValid = regex.test(input);
    setIsPhoneValidRange(isValid);

    if (input === '') {
      setIsPhoneValidRange(true);
    }
  }

  const handleFaxChange = (event) => {
    const input = event.target.value;
    setFaxValue(input);

    // Regular expression to match year ranges in the format "YYYY-YYYY"
    const regex = /^\+?[1-9]\d{1, 14}$/;

    // Check if the input matches the regex pattern
    const isValid = regex.test(input);
    setIsFaxValidRange(isValid);

    if (input === '') {
      setIsFaxValidRange(true);
    }
  }

  const handleEmailChange = (event) => {
    const input = event.target.value;
    setEmailValue(input);

    // Regular expression to match year ranges in the format "YYYY-YYYY"
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the input matches the regex pattern
    const isValid = regex.test(input);
    setIsEmailValidRange(isValid);

    if (input === '') {
      setIsEmailValidRange(true);
    }
  }
  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Designation Tree Other Info
              </h4>
            </div>
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Person<span className="text-red">*</span></label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          placeholder="Designation Person"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Phone No.
                      </label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          type="text"
                          value={phoneValue}
                          placeholder="Phone No."
                          onChange={handlePhoneChange}
                        />
                        {!isPhoneValidRange && <p className="text-red">Invalid Phone Number</p>}
                      </div>
                    </div>
                    <div className=" row mb-4 py-4">
                      <label className="col-md-2 form-label">
                        Fax No.
                      </label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          type="text"
                          value={faxValue}
                          placeholder="Fax No."
                          onChange={handleFaxChange}
                        />
                        {!isFaxValidRange && <p className="text-red">Invalid Fax Number</p>}
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Email
                      </label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          type="text"
                          value={emailValue}
                          placeholder="Email Id"
                          onChange={handleEmailChange}
                        />
                        {!isEmailValidRange && <p className="text-red">Invalid Email Id</p>}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const PaymentDetails = () => {
  return (
    <div>
      <section>
        <div className="form-group">
          <label className="form-label" >Card Holder Name</label>
          <input type="text" className="form-control" id="name1" placeholder="First Name" />
        </div>
        <div className="form-group">
          <label className="form-label">Card number</label>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search for..." />
            <span className="input-group-text btn btn-info shadow-none">
              <button>
                <i className="fa fa-cc-visa"></i> &nbsp; <i className="fa fa-cc-amex"></i> &nbsp;
                <i className="fa fa-cc-mastercard"></i>
              </button>
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <div className="form-group mb-sm-0">
              <label className="form-label">Expiration</label>
              <div className="input-group">
                <input type="number" className="form-control" placeholder="MM" name="expiremonth" />
                <input type="number" className="form-control" placeholder="YY" name="expireyear" />
              </div>
            </div>
          </div>
          <div className="col-sm-4 ">
            <div className="form-group mb-0">
              <label className="form-label">CVV <i className="fa fa-question-circle"></i></label>
              <input type="number" className="form-control" required="" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const NewEntry = () => {

  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');

  const [currentDate, setCurrentDate] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleChange2 = (event) => {
    const { value } = event.target;
    setInputValue2(value);
  };

  useEffect(() => {
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const currentDateFormatted = formatDate(new Date());
    setCurrentDate(currentDateFormatted);
  }, []);

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Dynamic Query Defination New Entry
              </h4>
            </div>
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Query Id</label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          placeholder="Query Id"
                          type="text"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Query Date
                      </label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          type="text"
                          value={currentDate}
                          placeholder="Query Date"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-3 form-label">Description</label>
                      <div className="col-md-8 input-group">
                        <input
                          className="form-control"
                          placeholder="Query Description"
                          type="text"
                          value={inputValue}
                          onChange={handleChange}
                          maxLength={4000}
                        />
                        <span className="input-group-text">{inputValue.length}/4000</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Statement</label>
                      <div className="col-md-9 input-group">
                        <input
                          className="form-control"
                          placeholder="SQL Statement"
                          type="text"
                          value={inputValue2}
                          onChange={handleChange2}
                          maxLength={4000}
                        />
                        <span className="input-group-text">{inputValue2.length}/4000</span>
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        User
                      </label>
                      <div className="col-md-9">
                        <formelement.StatusSelect />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const UserDetails = () => {

  const data = [
    {
      id: 327,
      Name: "DARJEELING",
      Status: "Active"
    },
    {
      id: 328,
      Name: "JALPAIGURI",
      Status: "Active"
    },
    {
      id: 329,
      Name: "COOCH BEHAR",
      Status: "Active"
    },
    {
      id: 330,
      Name: "UTTAR DINAJPUR",
      Status: "Active"
    },
    {
      id: 331,
      Name: "DAKSHIN DINAJPUR",
      Status: "Active"
    },
    {
      id: 332,
      Name: "MALDAH",
      Status: "Active"
    },
    {
      id: 333,
      Name: "MURSHIDABAD",
      Status: "Active"
    },
    {
      id: 334,
      Name: "BIRBHUM",
      Status: "Active"
    },
    {
      id: 335,
      Name: "PURBA BARDHAMAN",
      Status: "Active"
    },
    {
      id: 336,
      Name: "NADIA",
      Status: "Active"
    },
    {
      id: 337,
      Name: "NORTH 24 PARGANAS",
      Status: "Active"
    },
    {
      id: 338,
      Name: "HOOGLY",
      Status: "Active"
    },
    {
      id: 339,
      Name: "BANKURA",
      Status: "Active"
    },
    {
      id: 340,
      Name: "PURULIA",
      Status: "Active"
    },
    {
      id: 341,
      Name: "HOWRAH",
      Status: "Active"
    }
  ];

  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [filteredData, setFilteredData] = useState([]);
  const [selectRow, setSelectRow] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectRow(rowData);
    setOpen(false);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const openModal = () => {
    setTableData(data);
    setOpen(true);
  };

  const handleSearch = () => {
    // Filter the table data based on the search text
    const filteredData = tableData.filter(
      (row) =>
        row.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
        row.DistrictName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    // Update the filtered data when the table data changes
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    // Reset the table data when the modal is closed
    if (!open) {
      setTableData(data);
      setFilteredData(data);
      setSearchText('');
    }
  }, [open]);

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Dynamic Query Defination User Details
              </h4>
            </div>
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Row#</label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          placeholder="Query Id"
                          value={1}
                          type="text"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">User Id<i className="fa fa-search d=inline" title="" onClick={() => openModal()}></i></label>
                      <div className="col-md-9 input-group">
                        <input
                          className="form-control"
                          placeholder="Query Description"
                          type="text"
                          value={selectRow?.id || ''}
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Username</label>
                      <div className="col-md-9 input-group">
                        <input
                          className="form-control"
                          placeholder="Username"
                          type="text"
                          value={selectRow?.Name || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">
                        Status
                      </label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          type="text"
                          value={selectRow?.Status || ''}
                          placeholder="Status"
                          readOnly
                        />
                      </div>
                      <div className="row-mb-12">
                        {/* Modal */}
                        {open && (
                          <Modal show={open} onHide={closeModal} >
                            <Modal.Header closeButton>
                              <ModalTitle>Create New Account</ModalTitle>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="table-responsive">"
                                <h2>Search Modal</h2>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                  />
                                  <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                    Search
                                  </button>
                                </div>
                                <table className="table table-bordered dta-tabl">
                                  <thead>
                                    <tr>
                                      <th>User Id</th>
                                      <th>User Name</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredData.map((row) => (
                                      <tr key={row.id} onClick={() => handleRowClick(row)}>
                                        <td>{row.id}</td>
                                        <td>{row.Name}</td>
                                        <td>{row.Status}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Modal.Body>
                            {/* Close modal button */}
                            <Modal.Footer>
                              <button onClick={() => setOpen(false)}>Close</button>
                            </Modal.Footer>
                          </Modal>

                        )}
                        {/* Input fields */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const QueryParameterDetails = () => {

  const [weight, setWeight] = useState("0");
  const [weight2, setWeight2] = useState("0");
  const [weight3, setWeight3] = useState("0");
  const [inputValue, setInputValue] = useState('');

  function handlechange(event) {
    const value = event.target.value;
    setWeight(value);
  }

  function handlechange2(event) {
    const value = event.target.value;
    setWeight2(value);
  }

  function handlechange3(event) {
    const value = event.target.value;
    setWeight3(value);
  }

  const handleChange4 = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  return (
    <div>
      <div className="row py-1">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                Dynamic Query Defination Parameter Details
              </h4>
            </div>
            <div className="card-body">
              <div className="row ">
                <div className="col-lg-6 col-md-12">
                  <form className="form-horizontal">
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Row#</label>
                      <div className="col-md-9">
                        <input
                          className="form-control"
                          placeholder="Query Id"
                          value={1}
                          type="text"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className=" row mb-4">
                      <label className="col-md-2 form-label">Id<span className="text-red">*</span></label>
                      <div className="col-md-3 input-group">
                        <input
                          className="form-control"
                          placeholder="Id"
                          type="text"
                          required
                        />
                      </div>
                      <label className="col-md-2 form-label">Type<span className="text-red">*</span></label>
                      <div className="col-md-5 input-group">
                        <formelement.StatusSelect />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">Sl No</label>
                      <div className="col-md-3 input-group">
                        <input
                          className="form-control"
                          placeholder="Sl No"
                          value={weight}
                          onChange={handlechange}
                          maxLength={3}
                          type="text"
                        />
                        <span className="input-group-text">{weight.length}/3</span>
                      </div>
                      <label className="col-md-2 form-label">Name<span className="text-red">*</span></label>
                      <div className="col-md-5 input-group">
                        <input
                          className="form-control"
                          placeholder="Name"
                          type="text"
                          required
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">Null Id<span className="text-red">*</span></label>
                      <div className="col-md-4 nput-group">
                        <formelement.PositionSelect />
                      </div>
                      <label className="col-md-2 form-label">Display Id<span className="text-red">*</span></label>
                      <div className="col-md-4 input-group">
                        <formelement.StatusSelect />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">Query</label>
                      <div className="col-md-9 input-group">
                        <input
                          className="form-control"
                          placeholder="Query"
                          onChange={handleChange4}
                          type="text"
                          maxLength={1000}
                        />
                        <span className="input-group-text">{inputValue.length}/1000</span>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <label className="col-md-2 form-label">Height</label>
                      <div className="col-md-3 input-group">
                        <input
                          className="form-control"
                          placeholder="Height"
                          value={weight2}
                          onChange={handlechange2}
                          maxLength={8}
                          type="text"
                        />
                        <span className="input-group-text">{weight2.length}/8</span>
                      </div>
                      <label className="col-md-2 form-label">Width</label>
                      <div className="col-md-5 input-group">
                        <input
                          className="form-control"
                          placeholder="Width"
                          value={weight3}
                          onChange={handlechange3}
                          maxLength={8}
                          type="text"
                        />
                        <span className="input-group-text">{weight3.length}/8</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stepswizard =
  [
    { name: 'Name', component: <NameEmail /> },
    { name: 'Contact', component: <Contact /> },
    { name: 'Payment', component: <PaymentDetails /> },


  ]

// const designationtreecreation =
//   [
//     { name: 'DESIGNATION TREE INFO', component: <DesignationTreeInfo /> },
//     { name: 'DESIGNATION TREE OTHER INFO', component: <DesignationTreeOtherInfo /> }
//   ]

const loginlocationcreation =
  [
    { name: 'LOCATION ENTRY', component: <Location2 /> },
    { name: 'DESIGNATION TREE INFO', component: <LoginLocation /> },
    { name: 'DESIGNATION TREE OTHER INFO', component: <DesignationTreeOtherInfo /> }
  ]

const downthelevellocation =
  [
    { name: 'LOCATION ENTRY', component: <Location /> },
    { name: 'DESIGNATION TREE INFO', component: <LoginLocation /> },
    { name: 'DESIGNATION TREE OTHER INFO', component: <DesignationTreeOtherInfo /> }
  ]

const dynamicquerydefination =
  [
    { name: 'NEW ENTRY', component: <NewEntry /> },
    { name: 'QUERY PARAMETER DETAILS', component: <QueryParameterDetails /> },
    { name: 'USER DETAILS', component: <UserDetails /> }
  ]

const formmaster =
  [
    { name: 'NEW ENTRY', component: <FormMasterEntry /> },
    { name: 'PAGE ENTRY', component: <PageEntry /> },
    { name: 'TABLE ENTRY', component: <TableEntry /> }
  ]

// const formbeanmaster =
//   [
//     { name: 'NEW ENTRY', component: <FormBeanMasterEntry /> },
//     { name: 'COLUMN ENTRY', component: <ColumnEntry /> }
//   ]

// const pageblockwithcolumndefination =
//   [
//     { name: 'NEW ENTRY', component: <PageBlockWithColumnDefination /> },
//     { name: 'COLUMN ENTRY', component: <ColumnEntry2 /> }
//   ]

export const AccordionWizardForm = () => {
  return (
    <div className='step-progress'>
      <StepZilla steps={stepswizard} />
    </div>
  );
}

// export const DesignationTreeCreationForm = () => {
//   return (
//     <div className='step-progress'>
//       <StepZilla steps={designationtreecreation} />
//     </div>
//   );
// }

export const LoginLocationCreationForm = () => {
  return (
    <div className='step-progress'>
      <StepZilla steps={loginlocationcreation} />
    </div>
  );
}

export const DownTheLevelLocation = () => {
  return (
    <div className='step-progress'>
      <StepZilla steps={downthelevellocation} />
    </div>
  );
}

export const FormMaster = () => {
  return (
    <div className='step-progress'>
      <StepZilla steps={formmaster} />
    </div>
  );
}

// export const FormbeanMaster = () => {
//   return (
//     <div className='step-progress'>
//       <StepZilla steps={formbeanmaster} />
//     </div>
//   );
// }

// export const PageBlockColumnDefination = () => {
//   return (
//     <div className='step-progress'>
//       <StepZilla steps={pageblockwithcolumndefination} />
//     </div>
//   );
// }

export const DynamicQueryDefination = () => {
  return (
    <div className='step-progress'>
      <StepZilla steps={dynamicquerydefination} />
    </div>
  );
}
//End