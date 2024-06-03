import { TextInput } from '../components';

const generateTextInput = ({
  label,
  setTextState,
  maxLength = 15,
  isDisabled = false,
  value = "",
  error = "",
  type = "text",
  readOnly = false,
  showError = false,
  hasClearButton = false,
  onChange = () => {},
}) => {
  return <TextInput
    type={type}
    label={label}
    setTextState={setTextState}
    maxLength={maxLength}
    value={value}
    error={error}
    showError={showError}
    readOnly={readOnly}
    isDisabled={isDisabled}
    hasClearButton={hasClearButton}
    onChange={onChange}
  />
}

export { generateTextInput };
