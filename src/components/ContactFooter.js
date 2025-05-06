export const ContactFooter = () => {
    return (
      <footer className="bg-dark text-white py-4 ">
        <div className="container text-center p-4">
          <h5 className="mb-3 text-primary">Connect With Us</h5>
          <div className="d-flex justify-content-center gap-4">
            <a href="https://facebook.com" className="text-white" aria-label="Facebook">
              <i className="fa fa-facebook fa-2x"></i>
            </a>
            <a href="https://twitter.com" className="text-white" aria-label="Twitter">
              <i className="fa fa-twitter fa-2x"></i>
            </a>
            <a href="https://linkedin.com" className="text-white" aria-label="LinkedIn">
              <i className="fa fa-linkedin fa-2x"></i>
            </a>
            <a href="https://instagram.com" className="text-white" aria-label="Instagram">
              <i className="fa fa-instagram fa-2x"></i>
            </a>
          </div>
          <p className="mt-3 mb-0">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    );
  };
