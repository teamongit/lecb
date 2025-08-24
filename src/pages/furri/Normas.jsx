import { Card, Form, InputGroup, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { TituloSmall } from "../../components/Titulos";

export function Normas({ normas, setNormas }) {
  const handleCheckboxChange = (field) => (val) => {
    setNormas((prev) => ({ ...prev, [field]: val }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setNormas((prev) => ({ ...prev, [field]: value }));
  };

  const CheckToggleGroup = ({ field, options, className, variant = "outline-primary", size = "sm" }) => (
    <ToggleButtonGroup
      type="checkbox"
      name={field}
      value={normas?.[field] || []}
      onChange={handleCheckboxChange(field)}
      className={className}
    >
      {options.map(({ id, value, label, className: btnClassName }) => (
        <ToggleButton
          key={id}
          id={id}
          value={value}
          variant={variant}
          size={size}
          className={btnClassName}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  const RadioToggleGroup = ({ field, options, className, variant = "outline-primary", size = "sm" }) => (
    <ToggleButtonGroup
      type="radio"
      name={field}
      value={normas?.[field] || ""}
      onChange={(val) => setNormas((prev) => ({ ...prev, [field]: val }))}
      className={className}
    >
      {options.map(({ id, value, label, className: btnClassName }) => (
        <ToggleButton
          key={id}
          id={id}
          value={value}
          variant={variant}
          size={size}
          className={btnClassName}
        >
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
  console.log("render normas");
  return (
    <Card className="mt-5">
      <Card.Header>
        <h1>Normas</h1>
      </Card.Header>
      <Form className="m-2">
        {/* RESETEAR PUNTOS */}
        <TituloSmall texto={"Resetear Puntos"} />
        <Form.Select
          size="sm"
          value={normas?.ronda_reset_puntos || ""}
          onChange={handleChange("ronda_reset_puntos")}
        >
          <option value="" disabled>Elegir</option>
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <option key={r} value={r}>Inicio ronda {r}</option>
          ))}
          <option value="0">Al iniciar PideVacas</option>
          <option value="7">Al terminar PideVacas</option>
        </Form.Select>
        <br />
        {/* PERMITIR MULTIPLES */}
        <TituloSmall texto={"Permitir"} />
        <CheckToggleGroup
          field="multiples"
          className="d-flex justify-content-between gap-1 my-1"
          options={[
            { id: "quincenas", value: "quincenas", label: "Quincenas", className: "w-88px" },
            { id: "quincenas_invierno", value: "quincenas_invierno", label: "Invierno" },
            { id: "quincenas_invierno_sin_pasar", value: "quincenas_invierno_sin_pasar", label: "SinPasar" },
            { id: "quincenas_verano", value: "quincenas_verano", label: "Verano" },
            { id: "quincenas_verano_sin_pasar", value: "quincenas_verano_sin_pasar", label: "SinPasar" },
          ]}
        />
        <CheckToggleGroup
          field="multiples"
          className="d-flex justify-content-between gap-1 my-1"
          options={[
            { id: "dobles", value: "dobles", label: "DobleCiclo", className: "w-88px" },
            { id: "dobles_invierno", value: "dobles_invierno", label: "Invierno" },
            { id: "dobles_invierno_sin_pasar", value: "dobles_invierno_sin_pasar", label: "SinPasar" },
            { id: "dobles_verano", value: "dobles_verano", label: "Verano" },
            { id: "dobles_verano_sin_pasar", value: "dobles_verano_sin_pasar", label: "SinPasar" },
          ]}
        />
        <br />
        {/* PENALIZACIONES */}
        <TituloSmall texto={"Penalizaciones"} />
        <CheckToggleGroup
          field="penalizaciones"
          className="d-flex justify-content-between gap-1 my-1"
          options={[
            {
              id: "penalizar_con_pasar",
              value: "penalizar_con_pasar",
              label: <>Penalización con pasar<br /><small>temporal: media puntos ronda</small></>,
              className: "w-50"
            },
            {
              id: "penalizar_sin_pasar",
              value: "penalizar_sin_pasar",
              label: <>Penalización sin pasar<br /><small>50% + puntos ciclos</small></>,
              className: "w-50"
            },
          ]}
        />
        <br />
        {/* MINORAR ULTIMOS CICLOS */}
        <TituloSmall texto={"Minorar puntuación últimos ciclos"} />
        <InputGroup>
          <Form.Select
            size="sm"
            value={normas?.minorar_ultimos_ciclos_cantidad || ""}
            onChange={handleChange("minorar_ultimos_ciclos_cantidad")}
          >
            <option value="" disabled>Cantidad</option>
            {[0, 1, 2, 3, 4].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Form.Select>
          <Form.Select
            size="sm"
            value={normas?.minorar_ultimos_ciclos_valor || ""}
            onChange={handleChange("minorar_ultimos_ciclos_valor")}
          >
            <option value="" disabled>Valor</option>
            {[0, 0.25, 0.5, 0.75].map((v) => (
              <option key={v} value={v}>{v * 100}%</option>
            ))}
          </Form.Select>
        </InputGroup>
        <br />
        {/* GARANTIZAR CICLOS VERANO */}
        <TituloSmall texto={"Garantizar ciclos en verano"} />
        <CheckToggleGroup
          field="garantizar"
          className="d-flex justify-content-between gap-1 my-1"
          options={[
            { id: "dos_ciclos_verano", value: "dos_ciclos_verano", label: <small>Garantizar dos ciclos verano</small>, className: "w-50" },
            { id: "un_ciclo_julago", value: "un_ciclo_julago", label: <small>Garantizar un ciclo Jul Ago</small>, className: "w-50" },
          ]}
        />
        <br />
        {/* PAUSAS */}
        <TituloSmall texto={"Pausas"} />
        <Form.Select
          size="sm"
          value={normas?.pausar_inicio_ronda || ""}
          onChange={handleChange("pausar_inicio_ronda")}
        >
          <option value="" disabled>Elegir</option>
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <option key={r} value={r}>Inicio ronda {r}</option>
          ))}
          <option value="0">No pausar</option>
        </Form.Select>

        <CheckToggleGroup
          field="pausas"
          className="w-100 gap-1 mt-1"
          options={[
            { id: "pausar_inicio_ronda", value: "pausar_inicio_ronda", label: <small>Pausar al inicio de cada ronda</small>, className: "w-50" },
            { id: "pausar_fin_ronda", value: "pausar_fin_ronda", label: <small>Pausar al fin de cada ronda</small>, className: "w-50" },
          ]}
        />
        <CheckToggleGroup
          field="pausas"
          className="w-100 gap-1 mt-1"
          options={[
            { id: "pausar_empates", value: "pausar_empates", label: <small>Pausar empates</small>, className: "w-50" },
            { id: "pausar_renuncias", value: "pausar_renuncias", label: <small>Pausar renuncias</small>, className: "w-50" },
          ]}
        />
        <br />
        <br />
        {/* EMPATES */}
        <TituloSmall texto={"Resolver empates"} />
        <RadioToggleGroup
          field="empates"
          className="d-flex justify-content-between gap-1 my-1"
          options={[
            { id: "empates_aleatorio", value: "empates_aleatorio", label: "Aleatorio" },
            { id: "empates_puntos", value: "empates_puntos", label: "Puntos" },
            { id: "empates_orden", value: "empates_orden", label: "Orden" },
          ]}
        />
      </Form>
      <br />
      
    </Card>
  );
}
