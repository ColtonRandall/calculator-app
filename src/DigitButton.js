import { ACTIONS } from "./App";

export default function DigitButton({ dispatch, digit }) {
  // this is where the button element will be returned
  // call dispatch on click
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
}
