import { 
  FormControl, 
  FormHelperText,
  InputLabel, 
  MenuItem, 
  Select, 
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const MuiSelect = ({
  label = "",
  value,
  onChange,
  options = [],
  sx = {},
  className = "",
  required = false,
  error = false,
  helperText = "",
  disabled = false,
  fullWidth = true,
  defaultOptionLabel = "",
  size="",
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


export const MuiDatePicker = ({
  label = "",
  sx = {},
  className = "",
  value,
  onChange,
  disabled = false,
  minDate,
  maxDate,
  error = false,
  helperText = "",
  required = false,
  format = "dd/MM/yyyy",
  hidden = false
}) => {
  return (
    <div className={className} hidden={hidden}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          format={format}
          slotProps={{
            textField: {
              fullWidth: true,
              sx,
              error,
              helperText,
              required,
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};