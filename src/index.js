import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { isAuthenticated } from "./main/common/common";
import "./assets/css/coustom.css"
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
const options = {
  //timeout: 5000,
  position: positions.TOP_CENTER,
  containerStyle: {
    zIndex: 10000
  }
};

const Switcherlayout = React.lazy(() => import("./components/switcherlayout"));
//App
const App = React.lazy(() => import("./components/app"));
const Custompages = React.lazy(() => import("./components/custompages"));

//Dashboard
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));
const Dashboard0 = React.lazy(() =>
  import("./components/Dashboard/Dashboard0")
);
//Widgets

//Dashboard

const ModuleHome = React.lazy(() => import("./main/common/CMF00000_05"));
const ModuleDashboard = React.lazy(() => import("./main/common/CMF00000_06"));

//Common
const Login = React.lazy(() => import("./main/common/CMF00000_01"));
const VMSLogin = React.lazy(() => import("./main/common/VMS_login"));
const VMS_Reg = React.lazy(() => import("./main/common/VMS_Reg"));
const LocationTree = React.lazy(() => import("./main/common/CMF00000_03"));

const LocationList = React.lazy(() => import("./main/common/CMF00000_04"));
const ChangePassword = React.lazy(() => import("./main/common/CMF00000_02"));
const UserProfile = React.lazy(() => import("./main/common/CMF00000_13"));
const CommonModuleDocument = React.lazy(() => import("./main/common/CMF00000_21"));

//SU
const ModuleGroup = React.lazy(() => import("./main/su/SUF00001/SUF00001_01"));
const ModGpMulForm = React.lazy(() => import("./main/su/SUF00001/SUF00001_03"));

const InstallationProfile = React.lazy(() =>
  import("./main/su/SUF00027/SUF00027_01")
);
const DeveloperMaster = React.lazy(() =>
  import("./main/su/SUF00014/SUF00014_01")
);
const Location_Type = React.lazy(() =>
  import("./main/su/SUF00004/SUF00004_01")
);
const Location_Tree = React.lazy(() =>
  import("./main/su/SUF00008/SUF00008_01")
);

const Designation = React.lazy(() => import("./main/su/SUF00055/SUF00055_01"));
const CurrencyMaster = React.lazy(() =>
  import("./main/su/SUF00016/SUF00016_01")
);
const FinancialYearMaster = React.lazy(() => import("./main/su/SUF00012/SUF00012_01"));
const CalenderYearMaster = React.lazy(() => import("./main/su/SUF00023/SUF00023_01"));
const StateMaster = React.lazy(() => import("./main/su/SUF00025/SUF00025_01"));
const SecretQuestionSetting = React.lazy(() => import("./main/su/SUF00026/SUF00026_01"));
const DistrictMaster = React.lazy(() =>
  import("./main/su/SUF00015/SUF00015_01")
);
// const ModuleGroup = React.lazy(() => import("./main/su/SUF00001/SUF00001_01"));
const ModuleMaster = React.lazy(() => import("./main/su/SUF00005/SUF00005_01"));
const ModuleToLocation = React.lazy(() =>
  import("./main/su/SUF00009/SUF00009_01")
);
const LocationToModule = React.lazy(() =>
  import("./main/su/SUF00032/SUF00032_01")
);
const EventMaster = React.lazy(() => import("./main/su/SUF00003/SUF00003_01"));
const Error_Definition = React.lazy(() =>
  import("./main/su/SUF00024/SUF00024_01")
);
const FormMasterPageDefination = React.lazy(() =>
  import("./main/su/SUF00006/SUF00006_01")
);
const UserMaintenance = React.lazy(() =>
  import("./main/su/SUF00033/SUF00033_01")
);
const EnblMobLogin = React.lazy(() =>
  import("./main/su/SUF00033/SUF00033_03")
);
const ForgotPassword = React.lazy(() =>
  import("./main/su/SUF00033/SUF00033_04")
);

const Profile = React.lazy(() =>
  import("./main/su/SUF00033/SUF00033_05")
);

const ReportDeff = React.lazy(() =>
  import("./main/su/SUF00050/SUF00050_01")
);

const RoleUserMapping = React.lazy(() =>
  import("./main/su/SUF00018/SUF00018_01")
);
const ResetPassword = React.lazy(() =>
  import("./main/su/SUF00029/SUF00029_01")
);
const LikeUserCreation = React.lazy(() =>
  import("./main/su/SUF00078/SUF00078_01")
);
const DivisionSubdivisionUserMapping = React.lazy(() =>
  import("./main/su/SUF00104/SUF00104_01")
);
const UserRoleMapping = React.lazy(() =>
  import("./main/su/SUF00011/SUF00011_01")
);
const UserMenuMapping = React.lazy(() =>
  import("./main/su/SUF00022/SUF00022_01")
);
const MenuCreation = React.lazy(() => import("./main/su/SUF00007/SUF00007_01"));
const RoleDefination = React.lazy(() =>
  import("./main/su/SUF00002/SUF00002_01")
);
const RoleMenuMapping = React.lazy(() =>
  import("./main/su/SUF00010/SUF00010_01")
);
const MenuRoleMapping = React.lazy(() =>
  import("./main/su/SUF00013/SUF00013_01")
);
const UserLocationMapping = React.lazy(() =>
  import("./main/su/SUF00019/SUF00019_01")
);
const LocationUserMapping = React.lazy(() =>
  import("./main/su/SUF00021/SUF00021_01")
);
const AutoNumberDefination = React.lazy(() =>
  import("./main/su/SUF00030/SUF00030_01")
);
const LastAutoNumberUpdation = React.lazy(() =>
  import("./main/su/SUF00031/SUF00031_01")
);

const DataTrnsfrDeff = React.lazy(() =>
  import("./main/su/SUF00122/SUF00122_01")
);

const UserRegView = React.lazy(() =>
  import("./main/su/SUF00123/SUF00123_01")
);

const UserLogInfoDtl = React.lazy(() =>
  import("./main/su/SUF00124/SUF00124_01")
);

const AppCategoryMaster = React.lazy(() =>
  import("./main/su/SUF00120/SUF00120_01")
);
const AppCategoryMasterForm = React.lazy(() =>
  import("./main/su/SUF00120/SUF00120_03")
);

const AppMst = React.lazy(() =>
  import("./main/su/SUF00121/SUF00121_01")
);


const TempForm = React.lazy(() =>
  import("./main/su/SUF00127/SUF00127_01")
);

const ExportApi = React.lazy(() =>
  import("./main/su/SUF00128/SUF00128_01")
);

const FormFileUpldDefination = React.lazy(() =>
  import("./main/su/SUF00129/SUF00129_01")
);

const OtpTypMasters = React.lazy(() =>
  import("./main/su/SUF00130/SUF00130_01")
);

const NewsEntry = React.lazy(() =>
  import("./main/su/SUF00131/SUF00131_01")
);
const NewsLocMapping = React.lazy(() =>
  import("./main/su/SUF00132/SUF00132_01")
);

const NewsUserMapping = React.lazy(() =>
  import("./main/su/SUF00133/SUF00133_01")
);
const ReportProblem = React.lazy(() =>
  import("./main/su/SUF00137/SUF00137_01")
);
const ReportProblemForJackt = React.lazy(() =>
  import("./main/su/SUF00137/SUF00137_04")
);
const Help = React.lazy(() =>
  import("./main/su/SUF00155/SUF00155_01")
);

const ContactUs = React.lazy(() =>
  import("./main/su/SUF00156/SUF00156_01")
);

const ContactUsMulForm = React.lazy(() =>
  import("./main/su/SUF00156/SUF00156_03")
);

const ChangeRequestTypeMaster = React.lazy(() => import("./main/su/SUF00146/SUF00146_01"));
const ChangeRequestTypeMasterMulForm = React.lazy(() => import("./main/su/SUF00146/SUF00146_03"));

const FileCategoryMaster = React.lazy(() =>
  import("./main/su/SUF00147/SUF00147_01")
);

const UserTypeMaster = React.lazy(() =>
  import("./main/su/SUF00148/SUF00148_01")
);

const ExternalUserTypeMaster = React.lazy(() =>
  import("./main/su/SUF00149/SUF00149_01")
);
const ExternalUserTypeMasterMulForm = React.lazy(() =>
  import("./main/su/SUF00149/SUF00149_03")
);

const ExternalUserRegistrationMaster = React.lazy(() =>
  import("./main/su/SUF00150/SUF00150_01")
);
const ChangeRequestTracking = React.lazy(() =>
  import("./main/su/SUF00151/SUF00151_01")
);

const ApiMasterTemp = React.lazy(() =>
  import("./main/su/SUF00119/SUF00119_01")
);

const ApiBatchProcess = React.lazy(() =>
  import("./main/su/SUF00118/SUF00118_01")
);

const NewSearchListPage = React.lazy(() =>
  import("./main/su/SUF00194/SUF00194_01")
);

const CrncMstForm = React.lazy(() => import("./main/su/SUF00016/SUF00016_03"));
const FycForm = React.lazy(() => import("./main/su/SUF00012/SUF00012_03"));
const CalenderYearMasterForm = React.lazy(() => import("./main/su/SUF00023/SUF00023_03"));
const StMstForm = React.lazy(() => import("./main/su/SUF00025/SUF00025_03"));
const SecretQuestionSettingForm = React.lazy(() => import("./main/su/SUF00026/SUF00026_03"));
const DistMstForm = React.lazy(() => import("./main/su/SUF00015/SUF00015_03"));
const LocTypForm = React.lazy(() => import("./main/su/SUF00004/SUF00004_03"));
const DesigForm = React.lazy(() => import("./main/su/SUF00055/SUF00055_03"));
const ErrDeffForm = React.lazy(() => import("./main/su/SUF00024/SUF00024_03"));
const SubDivMapForm = React.lazy(() => import("./main/su/SUF00104/SUF00104_03"));

const Evnt_Mst_Form = React.lazy(() =>
  import("./main/su/SUF00003/SUF00003_03")
);
const MulForm = React.lazy(() => import("./main/su/SUF00002/SUF00002_03"));


const UpldDocuments = React.lazy(() =>
  import("./main/su/SUF00111/SUF00111_01")
);

const SearchDocument = React.lazy(() =>
  import("./main/su/SUF00112/SUF00112_01")
);

const ApiCategoryMaster = React.lazy(() => import("./main/su/SUF00114/SUF00114_01"));
const ApiCatMulForm = React.lazy(() => import("./main/su/SUF00114/SUF00114_03"));
const ApiMaster = React.lazy(() => import("./main/su/SUF00115/SUF00115_01"));
const ApiTestCase = React.lazy(() => import("./main/su/SUF00116/SUF00116_01"));




//custom Pages
//const Login = React.lazy(() => import("./main/common/CMF00000_01"));
const Register = React.lazy(() =>
  import("./components/CustomPages/Register/Register")
);
const RegisterForm = React.lazy(() => import("./main/su/SUF00150/SUF00150_03"));


const LockScreen = React.lazy(() =>
  import("./components/CustomPages/LockScreen/LockScreen")
);
//Errorpages
const Errorpage400 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/400/400")
);
const Errorpage401 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/401/401")
);
const Errorpage403 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/403/403")
);
const Errorpage500 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/500/500")
);
const Errorpage503 = React.lazy(() =>
  import("./components/ErrorPages/ErrorPages/503/503")
);


//MGF
const CreateBlankMemoNumbers = React.lazy(() => import("./main/mg/MGF00001/MGF00001_01"));
const GenerateMemoNumber = React.lazy(() => import("./main/mg/MGF00002/MGF00002_01"));
const FillUpBlankMemoNumbers = React.lazy(() => import("./main/mg/MGF00003/MGF00003_01"));
const MemoRegister = React.lazy(() => import("./main/mg/MGF00004/MGF00004_01"));
const EditMemoInformation = React.lazy(() => import("./main/mg/MGF00005/MGF00005_01"));
const CellMaster = React.lazy(() => import("./main/mg/MGF00006/MGF00006_01"));
const CellMasterMulForm = React.lazy(() => import("./main/mg/MGF00006/MGF00006_03"));
const SubCellMaster = React.lazy(() => import("./main/mg/MGF00007/MGF00007_01"));
const SubCellMstMulForm = React.lazy(() => import("./main/mg/MGF00007/MGF00007_03"));
const FileMaster = React.lazy(() => import("./main/mg/MGF00008/MGF00008_01"));
const ImportantFile = React.lazy(() => import("./main/mg/MGF00009/MGF00009_01"));

// CI
const CourtDefinition = React.lazy(() => import("./main/ci/CIF00001/CIF00001_01"));
const CourtDefinitionMulForm = React.lazy(() => import("./main/ci/CIF00001/CIF00001_03"));
const CaseTypeDefinition = React.lazy(() => import("./main/ci/CIF00002/CIF00002_01"));
const CaseTypeDefinitionMulForm = React.lazy(() => import("./main/ci/CIF00002/CIF00002_03"));

const AdvocateDefinition = React.lazy(() => import("./main/ci/CIF00003/CIF00003_01"));
const CourtCasesMaintenance = React.lazy(() => import("./main/ci/CIF00004/CIF00004_01"));
const SearchCourtCase = React.lazy(() => import("./main/ci/CIF00005/CIF00005_01"));

const OtherAdvocateDefinition = React.lazy(() => import("./main/ci/CIF00006/CIF00006_01"));

//VM

const BillDocMaster = React.lazy(() => import("./main/vm/VMF00001/VMF00001_01"));
const VendorRequestDetailsMaster = React.lazy(() => import("./main/vm/VMF00003/VMF00003_01"));
const UploadBill = React.lazy(() => import("./main/vm/VMF00004/VMF00004_01"));


// VA
 const NewApplication = React.lazy(() => import("./main/va/VAS00004/VAS00004_01"));


//HR
const EmployeeBasicInfo = React.lazy(() => import("./main/hr/HRF00001/HRF00001_01"));
const LocationWisePostDefinition = React.lazy(() => import("./main/hr/HRF00002/HRF00002_01"));
const PostDesignationMapping = React.lazy(() => import("./main/hr/HRF00012/HRF00012_01"));
const PostDefinition = React.lazy(() => import("./main/hr/HRF00013/HRF00013_01"));
const PostDefinitionMulForm = React.lazy(() => import("./main/hr/HRF00013/HRF00013_03"));
const PostEmailDetail = React.lazy(() => import("./main/hr/HRF00014/HRF00014_01"));



//WPF
const WebPortalMaster = React.lazy(() => import("./main/wp/WPF00001/WPF00001_01"));
const MenuTypeMaster = React.lazy(() => import("./main/wp/WPF00002/WPF00002_01"));
const MenuTree = React.lazy(() => import("./main/wp/WPF00003/WPF00003_01"));
const ArticleCategoryMaster = React.lazy(() => import("./main/wp/WPF00004/WPF00004_01"));

// WAF

const ImageUpload = React.lazy(() => import("./main/wa/WAF00002/WAF00002_01"));
const ImgUpldMulti = React.lazy(() => import("./main/wa/WAF00002/WAF00002_03"));
const ImageCategory = React.lazy(() => import("./main/wa/WAF00001/WAF00001_01"));




export const Private = ({ children }) => {
  const flg = isAuthenticated();

  return flg ? children : <Navigate to={`${process.env.PUBLIC_URL}/`} />;
};

const Loaderimg = () => {
  return (
    <div id="global-loader">
      <img
        src={require("./assets/images/loader.svg").default}
        className="loader-img"
        alt="Loader"
      />
    </div>
  );
};
const Root = () => {
  return (
    <Provider template={AlertTemplate} {...options}>
      <Fragment>
        <BrowserRouter>
          <React.Suspense fallback={Loaderimg()}>
            <Routes>
              <Route path={`${process.env.PUBLIC_URL}/`} element={<App />}>
                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_03`}
                  element={<Private><LocationTree /></Private>}
                />


                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_04`}
                  element={<Private><LocationList /></Private>}
                />

                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_02`}
                  element={<Private><ChangePassword /></Private>}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_05`}
                  element={<Private><ModuleHome /></Private>}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_06`}
                  element={<Private><ModuleDashboard /></Private>}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_13`}
                  element={<Private><UserProfile /></Private>}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000_21`}
                  element={<Private><CommonModuleDocument /></Private>}
                />


                <Route>


                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00014_01`}
                    element={<Private><DeveloperMaster /></Private>}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00027_01`}
                    element={<InstallationProfile />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00004_01`}
                    element={<Location_Type />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00004_03`}
                    element={<LocTypForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00008_01`}
                    element={<Location_Tree />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00055_01`}
                    element={<Designation />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00055_03`}
                    element={<DesigForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00016_01`}
                    element={<CurrencyMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00016_03`}
                    element={<CrncMstForm />}
                  />



                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00012_01`}
                    element={<FinancialYearMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00012_03`}
                    element={<FycForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00023_01`}
                    element={<CalenderYearMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00023_03`}
                    element={<CalenderYearMasterForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00025_01`}
                    element={<StateMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00025_03`}
                    element={<StMstForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00026_01`}
                    element={<SecretQuestionSetting />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00026_03`}
                    element={<SecretQuestionSettingForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00015_01`}
                    element={<DistrictMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00015_03`}
                    element={<DistMstForm />}
                  />

                  {/* <Route
                  path={`${process.env.PUBLIC_URL}/SUF00001_01`}
                  element={<ModuleGroup />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00001_03`}
                  element={<Mod_Grp_Form />}
                /> */}
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00001_01`}
                    element={<ModuleGroup />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00001_03`}
                    element={<ModGpMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00005_01`}
                    element={<ModuleMaster />}
                  />
                  {/* <Route
                  path={`${process.env.PUBLIC_URL}/SUF00005_03`}
                  element={<Mod_Mst_Form />}
                /> */}


                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00009_01`}
                    element={<ModuleToLocation />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00032_01`}
                    element={<LocationToModule />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00003_01`}
                    element={<EventMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00003_03`}
                    element={<Evnt_Mst_Form />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00024_01`}
                    element={<Error_Definition />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00024_03`}
                    element={<ErrDeffForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00006_01`}
                    element={<FormMasterPageDefination />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00033_01`}
                    element={<UserMaintenance />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00033_03`}
                    element={<EnblMobLogin />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00033_05`}
                    element={<Profile />}
                  />


                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00050_01`}
                    element={<ReportDeff />}
                  />


                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00029_01`}
                    element={<ResetPassword />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00078_01`}
                    element={<LikeUserCreation />}
                  />
                  {/* <Route
                  path={`${process.env.PUBLIC_URL}/SUF00078_03`}
                  element={<Form />}
                /> */}

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00104_01`}
                    element={<DivisionSubdivisionUserMapping />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00104_03`}
                    element={<SubDivMapForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00018_01`}
                    element={<RoleUserMapping />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00011_01`}
                    element={<UserRoleMapping />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00022_01`}
                    element={<UserMenuMapping />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00019_01`}
                    element={<UserLocationMapping />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00021_01`}
                    element={<LocationUserMapping />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00007_01`}
                    element={<MenuCreation />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00002_01`}
                    element={<RoleDefination />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00002_03`}
                    element={<MulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00010_01`}
                    element={<RoleMenuMapping />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00013_01`}
                    element={<MenuRoleMapping />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00030_01`}
                    element={<AutoNumberDefination />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00031_01`}
                    element={<LastAutoNumberUpdation />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00111_01`}
                    element={<UpldDocuments />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00112_01`}
                    element={<SearchDocument />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00114_01`}
                    element={<ApiCategoryMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00114_03`}
                    element={<ApiCatMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00115_01`}
                    element={<ApiMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00116_01`}
                    element={<ApiTestCase />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00119_01`}
                    element={<ApiMasterTemp />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00118_01`}
                    element={<ApiBatchProcess />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00120_01`}
                    element={<AppCategoryMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00120_03`}
                    element={<AppCategoryMasterForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00122_01`}
                    element={<DataTrnsfrDeff />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00123_01`}
                    element={<UserRegView />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00124_01`}
                    element={<UserLogInfoDtl />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00121_01`}
                    element={<AppMst />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00127_01`}
                    element={<TempForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00128_01`}
                    element={<ExportApi />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00129_01`}
                    element={<FormFileUpldDefination />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00130_01`}
                    element={<OtpTypMasters />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00131_01`}
                    element={<NewsEntry />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00132_01`}
                    element={<NewsLocMapping />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00133_01`}
                    element={<NewsUserMapping />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00137_01`}
                    element={<ReportProblem />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00137_04`}
                    element={<ReportProblemForJackt />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00155_01`}
                    element={<Help />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00156_01`}
                    element={<ContactUs />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00156_03`}
                    element={<ContactUsMulForm />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00146_01`}
                    element={<ChangeRequestTypeMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00146_03`}
                    element={<ChangeRequestTypeMasterMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00147_01`}
                    element={<FileCategoryMaster />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00148_01`}
                    element={<UserTypeMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00149_01`}
                    element={<ExternalUserTypeMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00149_03`}
                    element={<ExternalUserTypeMasterMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00150_01`}
                    element={<ExternalUserRegistrationMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00151_01`}
                    element={<ChangeRequestTracking />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/SUF00194_01`}
                    element={<NewSearchListPage />}
                  />

                </Route>

                {/* MGF Routing Start */}
                <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00001_01`}
                    element={<CreateBlankMemoNumbers />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00002_01`}
                    element={<GenerateMemoNumber />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00003_01`}
                    element={<FillUpBlankMemoNumbers />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00004_01`}
                    element={<MemoRegister />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00005_01`}
                    element={<EditMemoInformation />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00006_01`}
                    element={<CellMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00006_03`}
                    element={<CellMasterMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00007_01`}
                    element={<SubCellMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00007_03`}
                    element={<SubCellMstMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00008_01`}
                    element={<FileMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/MGF00009_01`}
                    element={<ImportantFile />}
                  />
                </Route>
                {/* MGF Routing end */}

                {/* CIF  Start*/}
                <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00001_01`}
                    element={< CourtDefinition />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00001_03`}
                    element={< CourtDefinitionMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00002_01`}
                    element={< CaseTypeDefinition />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00002_03`}
                    element={< CaseTypeDefinitionMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00003_01`}
                    element={< AdvocateDefinition />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00004_01`}
                    element={<CourtCasesMaintenance />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00005_01`}
                    element={<SearchCourtCase />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/CIF00006_01`}
                    element={< OtherAdvocateDefinition />}
                  />
                </Route>
                {/* CIF  End*/}

                {/* HR  Start*/}
                <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/HRF00001_01`}
                    element={< EmployeeBasicInfo />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/HRF00002_01`}
                    element={<LocationWisePostDefinition />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/HRF00012_01`}
                    element={<PostDesignationMapping />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/HRF00013_01`}
                    element={<PostDefinition />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/HRF00013_03`}
                    element={<PostDefinitionMulForm />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/HRF00014_01`}
                    element={<PostEmailDetail />}
                  />

                </Route>
                {/* HR  End*/}

                {/* VM Routing Start*/}
                <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/VMF00001_01`}
                    element={<BillDocMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/VMF00003_01`}
                    element={<VendorRequestDetailsMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/VMF00004_01`}
                    element={<UploadBill />}
                  />


                </Route>
                {/* VM Routing End*/}


                {/* VA Routing Start */}
 <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/VAS00004_01`}
                    element={<NewApplication />}
                  />
                 


                </Route>
                {/* VA Routing End */}

                {/* WP Routing */}
                <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/WPF00001_01`}
                    element={< WebPortalMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/WPF00002_01`}
                    element={< MenuTypeMaster />}
                  />
                  <Route
                    path={`${process.env.PUBLIC_URL}/WPF00003_01`}
                    element={< MenuTree />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/WPF00004_01`}
                    element={< ArticleCategoryMaster />}
                  />

                </Route>

                {/* WA Routing */}
                <Route>
                  <Route
                    path={`${process.env.PUBLIC_URL}/WAF00001_01`}
                    element={<ImageCategory />}
                  />

                  <Route
                    path={`${process.env.PUBLIC_URL}/WAF00002_01`}
                    element={<ImageUpload />}
                  />
                   <Route
                    path={`${process.env.PUBLIC_URL}/WAF00002_03`}
                    element={<ImgUpldMulti />}
                  />
                </Route>

              </Route>



              <Route
                path={`${process.env.PUBLIC_URL}/pages/themeStyle`}
                element={<Switcherlayout />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/`}
                element={<Custompages />}
              >

                <Route index element={<Login />} />
                <Route
                  path={`${process.env.PUBLIC_URL}/CMF00000/login`}
                  element={<Login />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/VMS_login`}
                  element={<VMSLogin />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/custompages/register`}
                  element={<Register />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00150_03`}
                  element={<RegisterForm />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/VAS_Reg`}
                  element={<VMS_Reg />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/VMS_Reg`}
                  element={<VMS_Reg />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00033_04`}
                  element={<ForgotPassword />}
                />

                <Route
                  path={`${process.env.PUBLIC_URL}/custompages/lockScreen`}
                  element={<LockScreen />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage401`}
                  element={<Errorpage401 />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage403`}
                  element={<Errorpage403 />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage500`}
                  element={<Errorpage500 />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage503`}
                  element={<Errorpage503 />}
                />
                <Route path="*" element={<Errorpage400 />} />
              </Route>
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </Fragment>
    </Provider>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
