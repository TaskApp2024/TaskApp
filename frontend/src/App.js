import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import DashBoard from './Components/DashBoard';
import HomeDashBoard from './Components/HomeDashBoard';
import CompanySignup from './Components/Company/CompanySignup';
import CompanyLogin from './Components/Company/CompanyLogin';
import VerifyEmail from './Components/Company/VerifyEmail';
import EmailVerification from './Components/Company/EmailVerification';



function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
       
        <Route path='/Dashboard' element={<DashBoard />}>
          <Route index element={<HomeDashBoard />} /> 
          

        </Route>
        <Route path='/companySignup' element={<CompanySignup/>}></Route>
        <Route path='/companyLogin' element={<CompanyLogin/>}></Route>
        <Route path='/verify-email' element={<VerifyEmail/>}></Route>
        <Route path="/email-verification" element={<EmailVerification />} />
        
        
        {/* Other routes can be added here */}
      </Routes>
    </Router>
  </div>
  );
}

export default App;
