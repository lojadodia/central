

const Layout: React.FC = ({ children }) => (
  <div className="min-h-screen flex flex-col transition-colors duration-150 bg-gray-100">
    <div className="flex-grow">{children}</div>

    
  </div>
);

export default Layout;
