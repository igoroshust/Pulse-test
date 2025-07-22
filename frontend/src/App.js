import './styles/styles.css';

import Header from './components/Header/Header.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Main from './components/Main/Main.jsx';
import './scripts/components/header/sidebar-toggle.js';

function App() {
  return (
    <div className="App">
        <Header />
            <div id="layoutSidenav">
                <Sidebar />
                <Main />
            </div>
    </div>
  );
}

export default App;
