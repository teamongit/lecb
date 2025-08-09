export const Titulo = ({
  titulo = "",
  Tag = 'h1',
  estilo = ""
}) => (
  <div className={`d-flex align-items-center ${estilo}`}>
    <div className="border-top flex-grow-1" />
    <Tag className="px-3">{titulo}</Tag>
    <div className="border-top flex-grow-1" />
  </div>
);

