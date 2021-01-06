import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const hideModal = () => setModal(false);
  const showModal = () => setModal(true);

  const [streamData, setStreamData] = useState({ time: "12:00:00 PM", price: undefined });
  const [modal, setModal] = useState(false);
  useEffect(() => {
    const ws = new WebSocket("ws://stream.tradingeconomics.com/?client=guest:guest");
    ws.addEventListener("open", () => {
      console.log("connection established");
      ws.send(JSON.stringify({ topic: "subscribe", to: "EURUSD:CUR" }));
    });
    ws.addEventListener("message", (data) => {
      const parsed = JSON.parse(data.data);
      const time = new Date(parsed.dt).toLocaleTimeString();
      const price = parsed.price;
      if (price) setStreamData(() => ({ time, price }));
    });
  }, []);
  return (
    <div className="App">
      <div className="logo">
        <img alt="ortex" src="https://ortex-static-files.s3.amazonaws.com/static/public/images/ortex_logo_v-white.svg" />
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="form_container" autoComplete="off">
        <div className="form_input">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input type="text" placeholder="Email" />
        </div>
        <div className="form_input">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input type="password" placeholder="Password" />
        </div>
        <div>
          <button className="form_button">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Login
          </button>
          <p onClick={showModal} className="form_forgot_password">
            Forgot Password?
          </p>
        </div>
      </form>

      <div className="market_data">
        <div>
          <h3>Pair</h3>
          <p>EUR/USD</p>
        </div>
        <div>
          <h3>Ask</h3>
          <p>{streamData.price}</p>
        </div>
        <div>
          <h3>Time</h3>
          <p>{streamData.time}</p>
        </div>
      </div>

      {modal ? (
        <div id="modal_wrapper">
          <form onSubmit={(e) => e.preventDefault()} className="password_modal">
            <h2>Reset Pasword</h2>
            <p>Enter your email address to get reset instructions sent to you.</p>
            <div className="form_input">
              <i className="fa fa-user" aria-hidden="true"></i>
              <input type="text" placeholder="Email" />
            </div>
            <button className="form_button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Submit
            </button>
            <p onClick={hideModal} className="form_forgot_password" style={{ margin: 0 }}>
              Cancel
            </p>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default App;
