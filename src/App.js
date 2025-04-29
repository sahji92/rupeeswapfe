import './App.css';
import { ContactFooter } from './components/ContactFooter';
import Topbar from './components/Topbar';
import { TypewriterComponent } from './components/TypewriterComponent';
function App() {
  return (
    <div className="App">
      <Topbar/>
    <TypewriterComponent/>
      <ContactFooter/>
    </div>
  );
}

export default App;
