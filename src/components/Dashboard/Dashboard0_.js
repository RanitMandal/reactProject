<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>
const dash = () => {
    return (

        <>
        
        <>{/*form*/}</>

        <div className="card">
  <div className="card-header">
    <h4 className="card-title">Gerenal Elements</h4>
  </div>
  <div className="card-body">
    <div className="row">
      <div className="col-lg-6 col-md-12">
        <form className="form-horizontal">
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Text</label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                defaultValue="Typing....."
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label" htmlFor="example-email">
              Email
            </label>
            <div className="col-md-9">
              <input
                type="email"
                id="example-email"
                name="example-email"
                className="form-control"
                placeholder="Email"
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Password</label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                password="true"
                defaultValue="Password"
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Placeholder</label>
            <div className="col-md-9">
              <input type="text" className="form-control" placeholder="text" />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">readOnly</label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                readOnly=""
                defaultValue="readOnly value"
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Disabled</label>
            <div className="col-md-9">
              <input
                id="disabled"
                type="text"
                className="form-control"
                disabled=""
                defaultValue="Disabled value"
              />
            </div>
          </div>
          <div className=" row mb-4 mb-0">
            <label className="col-md-3 form-label">Number</label>
            <div className="col-md-9">
              <input className="form-control" type="number" name="number" />
            </div>
          </div>
        </form>
      </div>
      <div className="col-lg-6 col-md-12">
        <form className="form-horizontal">
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Name</label>
            <div className="col-md-9">
              <input className="form-control" type="text" name="name" />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Text area</label>
            <div className="col-md-9">
              <textarea
                className="form-control"
                rows={3}
                defaultValue={"Hiiiii....."}
              />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">URL</label>
            <div className="col-md-9">
              <input className="form-control" type="url" name="url" />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Search</label>
            <div className="col-md-9">
              <input className="form-control" type="search" name="search" />
            </div>
          </div>
          <div className=" row mb-4">
            <label className="col-md-3 form-label">Tel</label>
            <div className="col-md-9">
              <input className="form-control" type="tel" name="tel" />
            </div>
          </div>
          <div className=" row mb-4 mb-0">
            <label className="col-md-3 form-label">Input Select</label>
            <div className="col-md-9">
              <div tabIndex={0} className="msl-wrp msl-vars  select2 ">
                <input name="" type="hidden" defaultValue="" />
                <div data-msl="true" className="msl false ">
                  <div
                    data-msl="true"
                    className="msl-input-wrp"
                    style={{ width: "calc(100% - 60px)" }}
                  >
                    <div
                      data-msl="true"
                      data-placeholder="--Select--"
                      className="msl-input"
                      contentEditable="true"
                    />
                  </div>
                  <div className="msl-actions msl-flx">
                    <div
                      role="button"
                      tabIndex={0}
                      dropdown-handle="true"
                      className="msl-btn msl-arrow-btn msl-flx"
                    >
                      <svg viewBox="0 0 20 20" className="msl-arrow-icn">
                        <line
                          stroke="currentColor"
                          strokeLinecap="round"
                          x1={10}
                          y1={14}
                          x2={4}
                          y2={8}
                        />
                        <line
                          stroke="currentColor"
                          strokeLinecap="round"
                          x1={16}
                          y1={8}
                          x2={10}
                          y2={14}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="msl-options">
                  <div>
                    <div
                      tabIndex={0}
                      title="Select"
                      className="msl-option   "
                      value="Group-1"
                    >
                      Select
                    </div>
                    <div
                      tabIndex={0}
                      title="Apple"
                      className="msl-option   "
                      value="Group-2"
                    >
                      Apple
                    </div>
                    <div
                      tabIndex={0}
                      title="Orange"
                      className="msl-option   "
                      value="Group-3"
                    >
                      Orange
                    </div>
                    <div
                      tabIndex={0}
                      title="Mango"
                      className="msl-option   "
                      value="Group-4"
                    >
                      Mango
                    </div>
                    <div
                      tabIndex={0}
                      title="Grapes"
                      className="msl-option   "
                      value="Group-5"
                    >
                      Grapes
                    </div>
                    <div
                      tabIndex={0}
                      title="Banana"
                      className="msl-option   "
                      value="Group-6"
                    >
                      Banana
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>



<>{/*button*/}</>

<div className="container text-center">
                <input
                  className="btn btn-primary"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
        
        
        </>
    )
};

export default dash;