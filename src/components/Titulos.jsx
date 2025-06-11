export const TituloH1 = ({ texto }) => {  
  return (
    <div className="d-flex align-items-center text-muted my-3">
      <div className="flex-grow-1 border-top"></div>
      <h1 className="px-3 text-dark">{texto}</h1>
      <div className="flex-grow-1 border-top"></div>
    </div>
  );
};

export const TituloSmall = ({ texto }) => {  
  return (
    <div className="d-flex align-items-center text-muted m-0">
      <div className="flex-grow-1 border-top"></div>
      <small className="px-3 text-secondary text-07">{texto}</small>
      <div className="flex-grow-1 border-top"></div>
    </div>
  );
};
