import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import PrivateRoute from './components/PrivateRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Header from './components/Header'
import Overview from './pages/Overview'
import Workouts from './pages/Workouts'
import Workout from './pages/Workout'
// import Exercises from './pages/Exercises'

function App() {
	return (
		<>
			<Router>
				<Header />
				<main className='bodyWrapper'>
					<div className='container'>
						<Routes>
							<Route path='/' element={<Overview/>} />
							<Route path='/workouts' element={<Workouts/>} />
              <Route path="/workouts/:workoutId" element={<Workout/>} />
							{/* <Route path='/exercises' element={<Exercises/>} /> */}
						</Routes>
					</div>
				</main>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
