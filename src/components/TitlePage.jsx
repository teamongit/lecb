const TitlePage = ({ texto }) => (
  <div className="d-flex align-items-center text-muted my-3">
    <div className="flex-grow-1 border-top"></div>
    <h1 className="px-3 text-dark">{texto}</h1>
    <div className="flex-grow-1 border-top"></div>
  </div>
);

export default TitlePage;