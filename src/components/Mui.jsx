import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Divider,
  RadioGroup,
  Radio,
} from "@mui/material";
import { DatePicker, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from 'date-fns/locale';

export function MuiFechaTurno({ className, label, value, onChange, turnos }) {


  const formatKey = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return (
    
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <DatePicker
        className={className}
        label={label}
        value={value}
        onChange={onChange}
        slots={{
          day: (props) => {
            const key = formatKey(props.day);
            const turno = !props.outsideCurrentMonth ? turnos?.[key] : null; 

            return (             
              <PickersDay 
                {...props} 
                sx={{
                  width: 36,
                  height: 36,        
                  lineHeight: "36px",
                  "&.Mui-selected": {
                    backgroundColor: "black !important",
                    color: "white !important",
                    borderRadius: 0,
                  },
                  "&.Mui-selected:hover, &.Mui-selected.Mui-focusVisible, &.Mui-selected:active": {
                    backgroundColor: "black !important",
                  },
                }}
              >
                <div style={{ fontSize: "0.7rem", lineHeight: 1 }}>
                  {props.day.getDate()}
                  <div style={{ fontSize: "0.55rem", color: "Chocolate" }}>
                    {turno}
                  </div>
                </div>
              </PickersDay>                
            );
          },
        }}
      />
    </LocalizationProvider>
    
  );
}

export const MuiSelect = ({
  label = "",
  value,
  onChange,
  tipo,
  options = [],
  sx = {}, //visibility: "hidden" oculta pero ocupa espacio
  className = "",
  required = false,
  error = false,
  helperText = "",
  disabled = false,
  fullWidth = true,
  defaultOptionLabel = "",
  size = "",
  hidden = false
}) => {
  const labelId = `${label.replace(/\s+/g, "-").toLowerCase()}-label`;
  const selectId = `${label.replace(/\s+/g, "-").toLowerCase()}-select`;

  return (
    <div className={className} hidden={hidden}>
      <FormControl
        fullWidth={fullWidth}
        required={required}
        error={error}
        disabled={disabled}
        sx={sx}
      >
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          value={value}
          label={label}
          onChange={onChange}
          size={size}
        >
          {defaultOptionLabel && (
            <MenuItem value="">
              <em>{defaultOptionLabel}</em>
            </MenuItem>
          )}

          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
};

export const MuiSelectMultiple = ({
  label = "Seleccionar",
  value = [],
  onChange,
  options = [],
  className = "",
  required = false,
  disabled = false,
  fullWidth = true,
  hidden = false,
}) => {
  return (
    <FormControl
      className={className}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      hidden={hidden}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          const labels = selected
            .map((val) => {
              const opt = options.find((o) => o.value === val);
              return opt ? opt.label : val;
            })
            .join(", ");
          return labels || "Ninguna";
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.indexOf(option.value) !== -1} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const MuiRadio = ({
  sx = {},
  label,
  value,
  onChange,
  options,
}) => {

  return (
    <FormControl sx={sx}>
      <Divider sx={{ color: "text.secondary" }}>{label}</Divider>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export const CheckboxMultiple = ({
  sx = {},
  label,
  value = [],
  onChange,
  options = [],

}) => {
  const handleToggle = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };


  return (
    <FormGroup sx={sx}>
      <Divider sx={{ color: "text.secondary" }}>{label}</Divider>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}

            />
          }
          label={option.label}
        />
      ))}
    </FormGroup>
  );
};
