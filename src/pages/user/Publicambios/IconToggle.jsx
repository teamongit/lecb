import { Button } from "react-bootstrap";
import { List, Calendar2 } from "react-bootstrap-icons";

export default function IconToggle({ selected, onChange }) {
  return (
    <div className="d-flex justify-content-center gap-3 p-2 mb-3">
      <Button 
        variant={selected === "list" ? "primary" : "outline-secondary"} 
        onClick={() => onChange("list")} 
        className="d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: '60px', height: '60px' }}
      >
        <List size={32} />
      </Button>
      <Button 
        variant={selected === "calendar" ? "primary" : "outline-secondary"} 
        onClick={() => onChange("calendar")} 
        className="d-flex align-items-center justify-content-center rounded-circle"
        style={{ width: '60px', height: '60px' }}
      >
        <Calendar2 size={32} />
      </Button>
    </div>
  );
}
