const Titulo = ({ tag = "h1", texto, color = "text-dark", tamano = "", margen = "my-3" }) => {
  const Tag = tag;
  return (
    <div className={`d-flex align-items-center text-muted ${margen}`}>
      <div className="flex-grow-1 border-top"></div>
      <Tag className={`px-3 ${color} ${tamano}`}>{texto}</Tag>
      <div className="flex-grow-1 border-top"></div>
    </div>
  );
};

export default Titulo;