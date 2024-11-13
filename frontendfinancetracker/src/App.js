import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import SplashLoading from './pages/splash/splashLoading';
import DashboardPage from './pages/Dashboard/dashboardpage';
import AddIncomeForm from './pages/incomeform/incomeForm';
import AddExpenseForm from './pages/expenseform/expenseForm';
import Editentry from './pages/editEntry/editentry';

function App() {
  return (<>
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/splashLoading" element={<SplashLoading />} />
        <Route path='/addincome' element={<AddIncomeForm />} />
        <Route path='/addexpense' element={<AddExpenseForm />} />
        <Route path='/editentry' element={<Editentry />} />
      </Routes>
    </Router>
  </>);
}

export default App;
