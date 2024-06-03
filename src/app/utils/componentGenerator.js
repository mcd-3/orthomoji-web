import { TextInput } from '../components';

/**
 * Generates a TextInput component
 *
 * @param {string} label - Label to display if no value is rpesent
 * @param {callback} setTextState - React state to set the input text
 * @param {number} maxLength - Max string length of the input value
 * @param {boolean} isDisabled - True if disabled. False if not.
 * @param {string} value - Value to display to input
 * @param {string} error - Error to display to input
 * @param {string} type - Type of input
 * @param {boolean} readOnly - True if readonly. False if not.
 * @param {boolean} showError - True to show an error. False to not.
 * @param {boolean} hasClearButton True to enable a clear button. False to not.
 * @param {callback} onChange - Callback function to handle input changes.
 * @returns 
 */
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
